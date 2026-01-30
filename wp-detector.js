const axios = require('axios');

class WPDetector {
  async detect(url) {
    try {
      const response = await axios.get(url);
      const html = response.data;
      
      const isWP = html.includes('<meta name="generator" content="WordPress">');
      if (!isWP) return { isWP: false };
      
      // Extract theme from meta or API
      const themeMatch = html.match(/wp-content\/themes\/([^\/]+)/);
      const theme = themeMatch ? themeMatch[1] : 'Unknown';
      
      // Detect plugins via scripts/styles
      const plugins = [];
      if (html.includes('wp-content/plugins/yoast-seo')) plugins.push('yoast-seo');
      if (html.includes('wp-content/plugins/elementor')) plugins.push('elementor');
      // Add more patterns
      
      // Detect page builder
      let builder = 'gutenberg'; // Default
      if (html.includes('elementor')) builder = 'elementor';
      if (html.includes('wpbakery')) builder = 'wpbakery';
      
      return { isWP: true, theme, plugins, builder };
    } catch (error) {
      return { isWP: false };
    }
  }
}
