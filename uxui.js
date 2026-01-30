const axe = require('axe-core');

class UXUIAudit {
  async run(pages) {
    const issues = [];
    for (const page of pages) {
      const pageInstance = await this.context.newPage();
      await pageInstance.goto(page.url);
      
      await pageInstance.addScriptTag({ content: axe.source });
      const results = await pageInstance.evaluate(() => axe.run());
      
      for (const violation of results.violations) {
        if (violation.id === 'color-contrast') {
          issues.push({
            severity: 'warning',
            type: 'contrast_issue',
            location: { url: page.url, selector: violation.nodes[0].target[0] },
            fix: 'Increase contrast ratio to at least 4.5:1.'
          });
        }
        // Check CTA hierarchy, font sizing, etc.
      }
      await pageInstance.close();
    }
    return issues;
  }
}
