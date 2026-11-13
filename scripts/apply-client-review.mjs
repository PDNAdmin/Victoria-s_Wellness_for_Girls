// One-off: applies the client's review (November 2026) to the live content in Sanity.
//   - new wording for the About heading and body, the Malaria programme text and two photo captions
//   - every photo shows only once: Values and Donate lose their photos (both are in the Gallery),
//     and the Gallery drops the photos already shown in other sections
//
// Run with:  node scripts/apply-client-review.mjs
// Needs SANITY_WRITE_TOKEN in .env (an "Editor" token from sanity.io/manage → API → Tokens; delete it afterwards).
// Running it twice is safe.
import fs from "node:fs";

for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = /^\s*(\w+)\s*=\s*(.*?)\s*$/.exec(line);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Add SANITY_PROJECT_ID and SANITY_WRITE_TOKEN to .env first (see the comment at the top of this file).");
  process.exit(1);
}

const api = `https://${projectId}.api.sanity.io/v2025-02-19/data`;
const auth = { Authorization: `Bearer ${token}` };

const MALARIA = "2fbe4436-715";
// Gallery photos that already appear in another section of the page
const GALLERY_REPEATS = {
  "f77d99fb-535": "blood pressure check (Our mission)",
  "79ab659c-04d": "women from the community (Where we work)",
  "0c84d0d5-fe7": "students at Epe Girls' SHS (Our impact)",
  "95a6d427-be4": "certificates (Our vision)",
  "aef951b1-017": "health education session (Who we are)",
};
// Layout of the six photos left, so they fill the grid without gaps
const LAYOUT = {
  "e08daab2-74b": "big",    // students hold up their pads
  "eb8820b4-a94": "normal", // volunteer with microphone
  "7dbb0647-6b0": "normal", // volunteers hand out sanitary products
  "f7b9ee20-e0d": "wide",   // students show their pads
  "13e43483-994": "wide",   // awards ceremony
  "7391b9ac-5c1": "wide",   // students wait for products
};

const set = {
  "about.title": "A community-oriented health initiative that places local needs, collective participation, and sustainable health outcomes at its core",
  "about.body": "Victoria's Wellness Initiative for Women and Girls is a community-driven nonprofit. We began because too many women and girls could not access good health information or care. We work to change that through education, prevention and local action, so every woman and girl can live a healthy life with dignity.",
  "about.mission.caption": "Non-Communicable Disease (NCD) risk screening at a women's health outreach.",
  [`programmes.items[_key=="${MALARIA}"].text`]: "Community health promotion and education, public health awareness campaigns, and malaria prevention interventions, including the distribution of insecticide-treated mosquito nets (ITNs).",
  "involved.caption": "Presentation and distribution of menstrual hygiene supplies at Epe Girls' Senior High School.",
};
for (const [key, layout] of Object.entries(LAYOUT)) set[`gallery.items[_key=="${key}"].layout`] = layout;

const unset = [
  "values.image",
  "donate.image",
  ...Object.keys(GALLERY_REPEATS).map((key) => `gallery.items[_key=="${key}"]`),
];

// Patch the published page, and any unpublished draft too, so publishing a draft later can't bring the old version back
const q = new URL(`${api}/query/${dataset}`);
q.searchParams.set("query", `*[_id in ["homePage", "drafts.homePage"]]._id`);
q.searchParams.set("perspective", "raw");
const ids = (await (await fetch(q, { headers: auth })).json()).result || [];
if (!ids.includes("homePage")) {
  console.error("Could not find the Home page in Sanity. Check the project ID and that the token has Editor rights.");
  process.exit(1);
}

const res = await fetch(`${api}/mutate/${dataset}?returnIds=true`, {
  method: "POST",
  headers: { ...auth, "Content-Type": "application/json" },
  body: JSON.stringify({ mutations: ids.map((id) => ({ patch: { id, set, unset } })) }),
});
if (!res.ok) {
  console.error(`Sanity refused the change: HTTP ${res.status} ${await res.text()}`);
  process.exit(1);
}
console.log(`Done. Updated: ${ids.join(", ")}`);
console.log("Removed from the Gallery (already shown elsewhere):", Object.values(GALLERY_REPEATS).join("; "));
console.log("The site rebuilds by itself in a minute or two. Now delete the token in sanity.io/manage and remove it from .env.");
