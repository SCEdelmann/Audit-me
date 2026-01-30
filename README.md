Website Audit Tool
A comprehensive, automated website auditing application that performs functional testing, responsive design checks, image audits, SEO analysis, and UX/UI evaluations. Built for scalability and extensibility, with special support for WordPress-based sites.

Features
Functional Testing: Crawls the site, tests links, buttons, and CTAs; detects broken links, redirects, and anchor issues.
Responsive Design Testing: Checks layouts across common breakpoints (desktop, tablet, mobile); identifies overflows, overlaps, and cut-off elements with screenshot comparisons.
Image Audit: Analyzes image dimensions, attributes, file sizes, and alt text for performance and accessibility.
SEO On-Page Audit: Evaluates titles, meta descriptions, headings, canonicals, and internal linking; provides actionable suggestions.
UX/UI Design Analysis: Assesses CTA hierarchy, color contrast, readability, and consistency; suggests precise improvements.
Reporting: Generates structured JSON and human-readable HTML reports with severity levels and fixes.
Extensibility: Modular design for adding custom audits, e.g., WordPress-specific checks (themes, plugins).
Architecture Overview
The application uses a modular, event-driven architecture:

Crawler Module: Discovers pages and elements via headless browsing.
Audit Modules: Independent classes for each audit type, running in parallel.
Reporter Module: Aggregates and formats results.
Extensibility Layer: Detects WordPress sites and loads custom audits.
Workflow: Input URL → Crawl → Parallel Audits → Aggregate → Report.

Tech Stack
Runtime: Node.js (v18+)
Headless Browser: Playwright
Libraries: Cheerio, Sharp, Lighthouse, Axe-core, Axios
Reporting: JSON, Handlebars for HTML
Deployment: Docker
