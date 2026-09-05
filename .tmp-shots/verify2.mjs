import { chromium } from 'playwright';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

// dismiss cookie banner once, persists via localStorage/cookie for rest of session
await page.goto('http://localhost:3001/', { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(600);
const acceptBtn = page.getByRole('button', { name: 'Accept All' });
if (await acceptBtn.isVisible().catch(() => false)) {
  await acceptBtn.click();
  await page.waitForTimeout(300);
}

async function shot(url, name, scrollToText, scrollExtra = 0) {
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(600);
    if (scrollToText) {
      const el = page.getByText(scrollToText).first();
      await el.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(400);
    }
    if (scrollExtra) {
      await page.mouse.wheel(0, scrollExtra);
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: `.tmp-shots/${name}.png` });
    console.log('OK', name);
  } catch (e) {
    console.log('FAIL', name, e.message);
  }
}

await shot('http://localhost:3001/', 'home-difference', 'One technology partner. Four connected practices.');
await page.mouse.wheel(0, 900);
await page.waitForTimeout(1200);
await page.screenshot({ path: '.tmp-shots/home-difference-2.png' });
await page.mouse.wheel(0, 1200);
await page.waitForTimeout(1200);
await page.screenshot({ path: '.tmp-shots/home-difference-3.png' });

await shot('http://localhost:3001/cybersecurity', 'cyber-intro', 'CoreDefense protecting connected infrastructure'.slice(0,0) || null);
await page.mouse.wheel(0, 1400);
await page.waitForTimeout(500);
await page.screenshot({ path: '.tmp-shots/cyber-page-2.png' });

await shot('http://localhost:3001/digital-engineering', 'digital-eng');
await page.mouse.wheel(0, 1400);
await page.waitForTimeout(500);
await page.screenshot({ path: '.tmp-shots/digital-eng-2.png' });

await shot('http://localhost:3001/business-transformation', 'biz-transform');
await page.mouse.wheel(0, 1400);
await page.waitForTimeout(500);
await page.screenshot({ path: '.tmp-shots/biz-transform-2.png' });

await shot('http://localhost:3001/cybersecurity/vulnerability-management', 'service-detail');
await page.mouse.wheel(0, 700);
await page.waitForTimeout(500);
await page.screenshot({ path: '.tmp-shots/service-detail-2.png' });

await shot('http://localhost:3001/industries/healthcare', 'industry-detail');
await page.mouse.wheel(0, 700);
await page.waitForTimeout(500);
await page.screenshot({ path: '.tmp-shots/industry-detail-2.png' });

await browser.close();
