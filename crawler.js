class Crawler {
  constructor(context) {
    this.context = context;
    this.visited = new Set();
    this.maxDepth = 3;
  }
  
  async crawl(url, depth = 0) {
    if (this.visited.has(url) || depth > this.maxDepth) return [];
    
    this.visited.add(url);
    const page = await this.context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Discover links, buttons, etc.
    const links = await page.$$eval('a[href], button, [role="button"]', elements => 
      elements.map(el => ({
        url: el.href || el.getAttribute('onclick'), // Handle JS links
        element: el.tagName,
        selector: el.className || el.id,
        pageUrl: url
      }))
    );
    
    // Recurse on internal links
    const internalLinks = links.filter(link => link.url.startsWith(url.split('/')[0] + '//' + url.split('/')[2]));
    const subPages = [];
    for (const link of internalLinks) {
      subPages.push(...await this.crawl(link.url, depth + 1));
    }
    
    await page.close();
    return [{ url, links, ...otherData }, ...subPages];
  }
}
