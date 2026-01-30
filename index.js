const { chromium } = require('playwright');
const WPDetector = require('./wp-detector');
const Crawler = require('./crawler');
const WPFunctionalAudit = require('./audits/wp-functional');
// ... other audits
const Reporter = require('./reporter');

async function runWPAudit(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  const detector = new WPDetector();
  const wpInfo = await detector.detect(url); // { isWP: true, theme: 'Twenty Twenty-One', plugins: ['yoast-seo'], builder: 'gutenberg' }
  if (!wpInfo.isWP) throw new Error('Not a WordPress site');
  
  const crawler = new Crawler(context, wpInfo);
  const pages = await crawler.crawl(url); // Includes WP post IDs, templates
  
  const results = {};
  const audits = [
    new WPFunctionalAudit(context, wpInfo).run(pages),
    // ... other audits
  ];
  const auditResults = await Promise.all(audits);
  
  results.wpFunctional = auditResults[0];
  // ...
  
  await browser.close();
  
  const jsonReport = Reporter.generateJSON(results, wpInfo);
  const htmlReport = Reporter.generateHTML(results, wpInfo);
  
  return { json: jsonReport, html: htmlReport };
}

module.exports = { runWPAudit };
