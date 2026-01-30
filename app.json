class Reporter {
  static generateJSON(results) {
    return JSON.stringify(results, null, 2);
  }
  
  static generateHTML(results) {
    // Use a template engine to render HTML
    return `<html><body><h1>Audit Report</h1>${Object.entries(results).map(([key, issues]) => 
      `<h2>${key}</h2><ul>${issues.map(i => `<li>${i.type}: ${i.fix}</li>`).join('')}</ul>`
    ).join('')}</body></html>`;
  }
}
