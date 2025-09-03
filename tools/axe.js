const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://example.com');
  const results = await new AxeBuilder({ page }).analyze();
  const outDir = path.resolve(__dirname, '../reports/a11y');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'axe.log'), JSON.stringify(results, null, 2));
  await browser.close();
})();
