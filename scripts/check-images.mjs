// Checks that every image on the page actually loads, for each way the site can be opened.
// Usage: node scripts/check-images.mjs <url> [<url> ...]
import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
let failed = false;
for (const url of process.argv.slice(2)) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const bad = [];
  page.on("response", (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));
  page.on("requestfailed", (r) => bad.push(`failed ${r.url()}`));
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  // Walk the whole page, and any sideways rails, so lazy images get their chance to load
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.evaluate(() => document.querySelectorAll("[data-rail-track]").forEach((t) => t.scrollTo(t.scrollWidth, 0)));
  await page.waitForTimeout(2500);
  const imgs = await page.evaluate(() =>
    [...document.images].filter((i) => !i.closest("dialog")).map((i) => ({ src: i.currentSrc.split("/").pop(), ok: i.complete && i.naturalWidth > 0 })));
  const ok = imgs.every((i) => i.ok);
  if (!ok || bad.length) failed = true;
  console.log(`${ok ? "OK  " : "FAIL"} ${url}\n     ${imgs.map((i) => `${i.ok ? "✓" : "✗"} ${i.src}`).join("  ")}${bad.length ? "\n     " + bad.join("\n     ") : ""}`);
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
