import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const logs = [];
page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`));

await page.goto("http://localhost:3000/", { waitUntil: "load" });
await page.waitForTimeout(2500);

const overlayText = await page.evaluate(() => {
  const el = document.querySelector("nextjs-portal");
  if (!el || !el.shadowRoot) return "no portal/shadowRoot";
  return el.shadowRoot.textContent || "shadowRoot has no textContent";
});

console.log("LOGS_START");
console.log(logs.join("\n"));
console.log("LOGS_END");
console.log("OVERLAY_START");
console.log(overlayText);
console.log("OVERLAY_END");

await browser.close();
