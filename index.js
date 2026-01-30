const { chromium } = require('playwright');
const Crawler = require('./crawler');
const FunctionalAudit = require('./audits/functional');
const ResponsiveAudit = require('./audits/responsive');
// ... other audits
const Reporter = require('./reporter');

async function runAudit(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  const crawler = new Crawler(context);
  const pages = await crawler.crawl(url); // Returns array of page objects with URLs and DOM data
  
  const results = {};
  // Run audits in parallel
  const audits = [
    new FunctionalAudit(context).run(pages),
    new ResponsiveAudit(context).run(pages),
    // ... other audits
  ];
  const auditResults = await Promise.all(audits);
  
  // Aggregate results
  results.functional = auditResults[0];
  // ...
  
  await browser.close();
  
  // Generate reports
  const jsonReport = Reporter.generateJSON(results);
  const htmlReport = Reporter.generateHTML(results);
  
  return { json: jsonReport, html: htmlReport };
}

module.exports = { runAudit };
