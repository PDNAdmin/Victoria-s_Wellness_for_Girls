// Captures the hero entrance as a filmstrip, plus the phone menu and sticky button.
// Usage: node scripts/shoot-intro.mjs http://localhost:4173 <outDir>
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const url = process.argv[2] || "http://localhost:4173";
const out = process.argv[3] || "lab";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

// Entrance filmstrip (cache disabled so it behaves like a first visit)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route("**/*", (r) => r.continue());
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const t0 = Date.now();
  for (const ms of [250, 600, 1000, 1500, 2400]) {
    await page.waitForTimeout(Math.max(0, ms - (Date.now() - t0)));
    await page.screenshot({ path: `${out}/intro-${String(ms).padStart(4, "0")}.png` });
  }
  await ctx.close();
}

// Phone: menu open, then sticky button after the hero buttons scroll away
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  await page.click("[data-menu-btn]");
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/phone-menu.png` });
  await page.keyboard.press("Escape");
  await page.evaluate(() => window.scrollTo(0, 620));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/phone-sticky.png` });
  const state = await page.evaluate(() => ({
    sticky: document.querySelector("[data-sticky-support]").className,
    menuExpanded: document.querySelector("[data-menu-btn]").getAttribute("aria-expanded"),
  }));
  console.log(JSON.stringify(state));
  await ctx.close();
}
await browser.close();
