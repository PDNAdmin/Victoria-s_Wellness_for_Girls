// Screenshots the hero at key moments and widths for visual review.
// Usage: node scripts/shoot-hero.mjs http://localhost:4173 <outDir>
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const url = process.argv[2] || "http://localhost:4173";
const out = process.argv[3] || "lab";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

async function run(name, viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: opts.reduced ? "reduce" : "no-preference", hasTouch: !!opts.touch, isMobile: !!opts.touch });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "load" });
  if (!opts.reduced) {
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/${name}-a-intro.png` });
  }
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${out}/${name}-b-settled.png` });

  const metrics = await page.evaluate(() => {
    const h1 = document.querySelector(".hero__title");
    const lines = Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
    const cta = document.querySelector(".hero__actions .btn-primary").getBoundingClientRect();
    return {
      h1Lines: lines,
      h1Font: getComputedStyle(h1).fontSize,
      ctaBottom: Math.round(cta.bottom),
      vh: innerHeight,
      // compare to the device width, not innerWidth (mobile overflow widens innerWidth too)
      overflowX: Math.max(document.documentElement.scrollWidth, innerWidth) > screen.width,
      heroH: Math.round(document.querySelector(".hero").getBoundingClientRect().height),
    };
  });

  // Mid-scroll and past the hero
  for (const [label, frac] of [["c-scroll40", 0.4], ["d-scroll90", 0.9]]) {
    await page.evaluate((f) => window.scrollTo(0, document.querySelector(".hero").offsetHeight * f), frac);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${out}/${name}-${label}.png` });
  }
  console.log(name, JSON.stringify(metrics), errors.length ? "ERRORS: " + errors.join(" | ") : "no errors");
  await ctx.close();
}

await run("desktop", { width: 1440, height: 900 });
await run("laptop", { width: 1366, height: 768 });
await run("tablet", { width: 820, height: 1180 }, { touch: true });
await run("phone", { width: 390, height: 844 }, { touch: true });
await run("reduced", { width: 1440, height: 900 }, { reduced: true });
await browser.close();
