const lighthouse = require('lighthouse');

class SEOAudit {
  async run(pages) {
    const issues = [];
    for (const page of pages) {
      const runnerResult = await lighthouse(page.url, { logLevel: 'error' });
      const seoScore = runnerResult.lhr.categories.seo.score;
      
      if (seoScore < 0.8) {
        issues.push({
          severity: 'warning',
          type: 'seo_issues',
          location: { url: page.url },
          details: runnerResult.lhr.audits, // e.g., missing title, duplicated H1
          fix: 'Optimize title tags, meta descriptions, and heading structure.'
        });
      }
    }
    return issues;
  }
}
