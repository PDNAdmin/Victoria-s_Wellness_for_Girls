// Viewport screenshots while walking through a section (shows sticky and spotlight behaviour).
// Usage: node scripts/shoot-walk.mjs <url> <sectionId> <outDir> [width] [height] [steps]
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const [url, id, out, w = "1440", h = "900", steps = "4"] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const mobile = +w < 600;
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, hasTouch: mobile, isMobile: mobile });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1200);
const { top, height } = await page.evaluate((id) => {
  const r = document.getElementById(id).getBoundingClientRect();
  return { top: r.top + scrollY, height: r.height };
}, id);
const n = +steps;
for (let i = 0; i < n; i++) {
  const y = top - 76 + ((height - +h * 0.6) * i) / (n - 1);
  // approach in small steps so scroll-triggered effects fire as they would for a reader
  const from = await page.evaluate(() => scrollY);
  for (let k = 1; k <= 6; k++) { await page.evaluate((v) => window.scrollTo(0, v), from + ((y - from) * k) / 6); await page.waitForTimeout(80); }
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/${id}-walk-${w}-${i}.png` });
}
await browser.close();
