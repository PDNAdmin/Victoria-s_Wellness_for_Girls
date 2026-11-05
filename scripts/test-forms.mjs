// Uses the Get Involved, Contact and Newsletter forms like a person would, plus the video and rail.
// Usage: node scripts/test-forms.mjs <url> [--expect-success]
import { chromium } from "playwright-core";

const [url = "http://localhost:4173", flag] = process.argv.slice(2);
const expectSuccess = flag === "--expect-success";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));
const posts = [];
await page.route("**/test-endpoint/**", async (route) => {
  posts.push(route.request().postDataJSON());
  await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
});
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1500);
const log = (k, v) => console.log(`${k}:`, typeof v === "string" ? v : JSON.stringify(v));
const errorsIn = (sel) => page.$$eval(`${sel} .err:not([hidden])`, (els) => els.map((e) => e.textContent));
const result = async (form) => (expectSuccess
  ? { doneVisible: await page.isVisible(`[data-form-done="${form}"]`) }
  : { status: (await page.textContent(`form[data-form="${form}"] [data-form-status]`)).trim() });

// Get Involved
await page.locator("#involved-form").scrollIntoViewIfNeeded();
await page.click('#involved-form button[type="submit"]');
log("involved, empty", await errorsIn("#involved-form"));
await page.click('#involved-form label.chip:has(input[value="School"])');
log("involved, org field after School", await page.isVisible('[data-field="organisation"]'));
await page.click('#involved-form label.chip:has(input[value="Volunteer"])');
log("involved, org field after Volunteer", await page.isVisible('[data-field="organisation"]'));
await page.fill("#if-name", "Tolu Adeyemi");
await page.fill("#if-contact", "tolu@example.com");
await page.fill("#if-message", "I am a nurse and can help at weekend outreaches.");
await page.check('#involved-form input[name="consent"]');
await page.click('#involved-form button[type="submit"]');
await page.waitForTimeout(600);
log("involved, filled", await result("involved"));

// Contact
await page.locator("#contact-form").scrollIntoViewIfNeeded();
await page.click('#contact-form button[type="submit"]');
log("contact, empty", await errorsIn("#contact-form"));
await page.fill("#cf-name", "Ngozi");
await page.fill("#cf-contact", "+234 803 000 1111");
await page.fill("#cf-message", "Could you visit our school in Ogun State?");
await page.check('#contact-form input[name="consent"]');
await page.click('#contact-form button[type="submit"]');
await page.waitForTimeout(600);
log("contact, filled", await result("contact"));

// Newsletter
await page.locator('form[data-form="newsletter"]').scrollIntoViewIfNeeded();
await page.fill("#nf-email", "not-an-email");
await page.click('form[data-form="newsletter"] button[type="submit"]');
log("newsletter, bad email", await errorsIn('form[data-form="newsletter"]'));
await page.fill("#nf-email", "reader@example.com");
await page.check('form[data-form="newsletter"] input[name="consent"]');
await page.click('form[data-form="newsletter"] button[type="submit"]');
await page.waitForTimeout(600);
log("newsletter, filled", await result("newsletter"));
if (expectSuccess) log("sent", posts);

// Video and rail
await page.locator("[data-video]").scrollIntoViewIfNeeded();
log("video downloaded before play", await page.evaluate(() => document.querySelector("[data-video-el]").readyState > 0));
await page.click("[data-video-play]");
await page.waitForTimeout(1500);
log("video playing", await page.evaluate(() => { const v = document.querySelector("[data-video-el]"); return !v.paused && v.currentTime > 0; }));
// Gallery viewer
await page.locator('[data-gallery]').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.click('[data-gallery] .g-item__btn >> nth=2');
await page.waitForTimeout(500);
log('viewer open', await page.evaluate(() => document.querySelector('[data-lightbox]').open));
log('viewer shows', await page.textContent('[data-lightbox-count]'));
await page.click('[data-lightbox-next]');
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(300);
log('after next + arrow key', await page.textContent('[data-lightbox-count]'));
log('big image loaded', await page.evaluate(() => new Promise((r) => { const i = document.querySelector('[data-lightbox-img]'); i.complete ? r(i.naturalWidth > 0) : i.onload = () => r(true); })));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
log('closed, focus back on photo 3', await page.evaluate(() => !document.querySelector('[data-lightbox]').open && document.activeElement === document.querySelectorAll('[data-gallery] .g-item__btn')[2]));

log("page errors", pageErrors.length ? pageErrors : "none");
await browser.close();
