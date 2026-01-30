class Crawler {
  constructor(context, wpInfo) {
    this.context = context;
    this.wpInfo = wpInfo;
    this.visited = new Set();
    this.maxDepth = 3;
  }
  
  async crawl(url, depth = 0) {
    if (this.visited.has(url) || depth > this.maxDepth) return [];
    
    this.visited.add(url);
    const page = await this.context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Fetch WP post data via API if possible
    let postData = {};
    try {
      const postIdMatch = url.match(/\/(\d+)\//); // Permalink pattern
      if (postIdMatch) {
        const apiUrl = `${url.split('/').slice(0, 3).join('/')}wp-json/wp/v2/posts/${postIdMatch[1]}`;
        const response = await axios.get(apiUrl);
        postData = { id: response.data.id, title: response.data.title.rendered };
      }
    } catch {}
    
    // Discover WP-specific elements: menus, permalinks
    const elements = await page.$$eval('a[href], .menu-item, button', els => 
      els.map(el => ({
        url: el.href,
        type: el.classList.contains('menu-item') ? 'menu' : 'link',
        selector: el.className || el.id,
        template: 'header.php' // Infer from DOM context
      }))
    );
    
    // Recurse on internal WP links
    const subPages = [];
    for (const el of elements.filter(el => el.url.startsWith(url.split('/')[0] + '//' + url.split('/')[2]))) {
      subPages.push(...await this.crawl(el.url, depth + 1));
    }
    
    await page.close();
    return [{ url, elements, postData, template: 'page.php' }, ...subPages]; // Infer template
  }
}
