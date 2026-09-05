import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultNavigationTimeout(30000);

async function shot(url, name, scrollToText) {
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(800);
    if (scrollToText) {
      const el = page.getByText(scrollToText).first();
      await el.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: `.tmp-shots/${name}.png` });
    console.log('OK', name);
  } catch (e) {
    console.log('FAIL', name, e.message);
  }
}

await shot('http://localhost:3001/', 'home-difference', 'One technology partner. Four connected practices.');
await shot('http://localhost:3001/cybersecurity', 'cyber-intro');
await shot('http://localhost:3001/digital-engineering', 'digital-eng');
await shot('http://localhost:3001/business-transformation', 'biz-transform');
await shot('http://localhost:3001/cybersecurity/vulnerability-management', 'service-detail');
await shot('http://localhost:3001/industries/healthcare', 'industry-detail');

await browser.close();
