class Reporter {
  static generateJSON(results, wpInfo) {
    return JSON.stringify({ wpInfo, ...results }, null, 2);
  }
  
  static generateHTML(results, wpInfo) {
    return `<html><body><h1>WordPress Audit Report</h1><p>Theme: ${wpInfo.theme}, Builder: ${wpInfo.builder}</p>${/* Render issues */}</body></html>`;
  }
}
