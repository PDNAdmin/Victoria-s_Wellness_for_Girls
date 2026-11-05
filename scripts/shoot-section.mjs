// Screenshots one section (by id) at several widths: mid-reveal, settled, and reduced motion.
// Usage: node scripts/shoot-section.mjs <url> <sectionId> <outDir>
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const [url = "http://localhost:4173", id = "about", out = "lab"] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

const runs = [
  ["desktop", { width: 1440, height: 900 }, {}],
  ["tablet", { width: 820, height: 1180 }, { touch: true }],
  ["phone", { width: 390, height: 844 }, { touch: true }],
  ["reduced", { width: 1440, height: 900 }, { reduced: true }],
];

for (const [name, viewport, opts] of runs) {
  const ctx = await browser.newContext({ viewport, reducedMotion: opts.reduced ? "reduce" : "no-preference", hasTouch: !!opts.touch, isMobile: !!opts.touch });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  // Scroll the section's top to 70% of the screen, as a reader would arrive
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * 0.7);
  }, id);
  await page.waitForTimeout(150);
  await page.evaluate(() => window.scrollBy(0, innerHeight * 0.5));
  if (!opts.reduced) {
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${out}/${id}-${name}-a-mid.png` });
  }
  // Walk through the whole section so every group triggers, then capture it whole
  const h = await page.evaluate((id) => document.getElementById(id).offsetHeight, id);
  for (let y = 0; y < h; y += 300) { await page.evaluate(() => window.scrollBy(0, 300)); await page.waitForTimeout(120); }
  await page.waitForTimeout(1800);
  await page.locator(`#${id}`).screenshot({ path: `${out}/${id}-${name}-b-full.png` });

  const metrics = await page.evaluate((id) => {
    const sec = document.getElementById(id);
    const hidden = [...sec.querySelectorAll("[data-reveal]")].filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99).length;
    return {
      height: sec.offsetHeight,
      stillHidden: hidden,
      overflowX: Math.max(document.documentElement.scrollWidth, innerWidth) > screen.width,
      brokenImages: [...sec.querySelectorAll("img")].filter((i) => !(i.complete && i.naturalWidth)).length,
    };
  }, id);
  console.log(name, JSON.stringify(metrics), errors.length ? "ERRORS: " + errors.join(" | ") : "no errors");
  await ctx.close();
}
await browser.close();
