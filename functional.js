class WPFunctionalAudit {
  constructor(context, wpInfo) {
    this.context = context;
    this.wpInfo = wpInfo;
  }
  
  async run(pages) {
    const issues = [];
    for (const page of pages) {
      const pageInstance = await this.context.newPage();
      await pageInstance.goto(page.url);
      
      for (const el of page.elements) {
        const response = await pageInstance.evaluate(async (href) => {
          try {
            const res = await fetch(href);
            return { status: res.status };
          } catch { return { status: 0 }; }
        }, el.url);
        
        if (response.status >= 400) {
          issues.push({
            severity: 'critical',
            type: 'broken_wp_link',
            location: {
              url: page.url,
              postId: page.postData.id,
              postTitle: page.postData.title,
              block: 'menu-block', // Infer from WP
              selector: el.selector,
              template: page.template
            },
            fix: `Update the permalink or remove the ${el.type} in ${this.wpInfo.theme}.`
          });
        }
        // Check for noindex/draft via API or meta
      }
      await pageInstance.close();
    }
    return issues;
  }
}
