import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
const heading = page.getByText('One technology partner. Four connected practices.');
await heading.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.screenshot({ path: '.tmp-shots/difference.png' });
await browser.close();
