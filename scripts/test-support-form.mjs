// Uses the Get Support form like a person would and reports what happened.
// Usage: node scripts/test-support-form.mjs <url> <outDir> [--expect-success]
import { chromium } from "playwright-core";

const [url, out = "lab", flag] = process.argv.slice(2);
const expectSuccess = flag === "--expect-success";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
let posted = null;
await page.route("**/test-endpoint", async (route) => {
  posted = route.request().postDataJSON();
  await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
});

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1500);
const log = (label, v) => console.log(`${label}:`, typeof v === "string" ? v : JSON.stringify(v));

// 1. Send it empty
await page.locator("#support-form").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.click('#support-form button[type="submit"]');
await page.waitForTimeout(300);
log("errors shown", await page.$$eval("#support-form .err:not([hidden])", (els) => els.map((e) => e.textContent)));
log("focused after empty send", await page.evaluate(() => document.activeElement.id || document.activeElement.name));
await page.screenshot({ path: `${out}/support-errors.png`, fullPage: false });

// 2. Under 18 shows the guardian question
await page.click('label.chip:has(input[value="Under 18"])');
log("guardian visible after Under 18", await page.isVisible("[data-guardian]"));
await page.click('label.chip:has(input[value="18 to 35"])');
log("guardian visible after 18 to 35", await page.isVisible("[data-guardian]"));

// 3. Fill it in properly
await page.fill("#sf-name", "Ada");
await page.fill("#sf-contact", "0803 123 4567");
await page.click('label.chip:has(input[value="Menstrual health support"])');
await page.check('input[name="consent"]');
log("errors left after fixing", await page.$$eval("#support-form .err:not([hidden])", (els) => els.length));
await page.click('#support-form button[type="submit"]');
await page.waitForTimeout(800);
if (expectSuccess) {
  log("posted to endpoint", posted);
  log("thank-you visible", await page.isVisible("[data-support-done]"));
  log("thank-you text", await page.textContent("[data-done-text]"));
  log("focus moved to thank-you", await page.evaluate(() => document.activeElement.matches("[data-support-done]")));
  await page.screenshot({ path: `${out}/support-done.png` });
} else {
  log("status message", (await page.textContent("[data-form-status]")).trim());
  log("whatsapp link in message", await page.getAttribute("[data-form-status] a", "href"));
  await page.screenshot({ path: `${out}/support-not-connected.png` });
}

// 4. Referral shortcut
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1200);
await page.locator("[data-referral]").scrollIntoViewIfNeeded();
await page.click("[data-referral]");
await page.waitForTimeout(1500);
log("referral preselected", await page.isChecked('input[name="help"][value="A referral"]'));
log("focus after referral", await page.evaluate(() => document.activeElement.id));

log("page errors", errors.length ? errors : "none");
await browser.close();
