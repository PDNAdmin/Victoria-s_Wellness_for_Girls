// One-off: adds the November 2026 photos and clips to the live content in Sanity.
//   - 8 new Gallery photos (Benevolence Tour, supplies, partners), in an order that fills the grid
//   - the "Voices from our outreaches" clips under the Outreach film
// Photos and clips the editors already have in Sanity are kept as they are (matched by caption).
//
// Run with:  node scripts/add-november-media.mjs
// Needs SANITY_WRITE_TOKEN in .env (an "Editor" token from sanity.io/manage → API → Tokens; delete it afterwards).
// Running it twice is safe: it never adds the same photo or clip twice.
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { randomUUID } from "node:crypto";
import { home } from "../content/defaults.js";

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
const api = `https://${projectId}.api.sanity.io/v2025-02-19`;
const auth = { Authorization: `Bearer ${token}` };
const key = () => randomUUID().slice(0, 12);

async function query(groq) {
  const url = new URL(`${api}/data/query/${dataset}`);
  url.searchParams.set("query", groq);
  url.searchParams.set("perspective", "raw");
  const res = await fetch(url, { headers: auth });
  if (!res.ok) throw new Error(`Query failed: HTTP ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".mp4": "video/mp4" };
async function upload(path, kind) {
  const res = await fetch(`${api}/assets/${kind}/${dataset}?filename=${encodeURIComponent(basename(path))}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": TYPES[extname(path).toLowerCase()] },
    body: await readFile(path),
  });
  if (!res.ok) throw new Error(`Upload of ${path} failed: HTTP ${res.status} ${await res.text()}`);
  console.log(`  uploaded ${path}`);
  return (await res.json()).document._id;
}
const photo = (ref, alt) => ({ _type: "photo", asset: { _type: "reference", _ref: ref }, ...(alt ? { alt } : {}) });
const file = (ref) => ({ _type: "file", asset: { _type: "reference", _ref: ref } });

const docs = await query(`*[_id in ["homePage", "drafts.homePage"]]{_id, "items": gallery.items, "clips": outreach.clips}`);
const live = docs.find((d) => d._id === "homePage");
if (!live) {
  console.error("Could not find the Home page in Sanity. Check the project ID and that the token has Editor rights.");
  process.exit(1);
}

/* ---------- Gallery ---------- */
const current = live.items || [];
const byCaption = new Map(current.map((i) => [i.caption, i]));
const items = [];
for (const d of home.gallery.items) {
  const existing = byCaption.get(d.caption);
  if (existing) {
    items.push({ ...existing, layout: d.layout });
    byCaption.delete(d.caption);
  } else if (d.image.local.startsWith("gallery-n-")) {
    const ref = await upload(`media/${d.image.local}-main-1600.jpg`, "images");
    items.push({ _key: key(), _type: "galleryItem", image: photo(ref, d.image.alt), caption: d.caption, layout: d.layout });
  }
}
items.push(...byCaption.values()); // anything the editors added themselves stays, at the end

/* ---------- Clips ---------- */
const set = { "gallery.items": items };
if (!live.clips?.length) {
  const clips = [];
  for (const c of home.outreach.clips) {
    clips.push({
      _key: key(), _type: "clip",
      video: file(await upload(c.video.local, "files")),
      poster: photo(await upload(c.poster.local, "images"), c.caption),
      caption: c.caption, label: c.label,
    });
  }
  Object.assign(set, { "outreach.clips": clips, "outreach.clipsTitle": home.outreach.clipsTitle, "outreach.clipsIntro": home.outreach.clipsIntro });
} else {
  console.log("  clips already in Sanity: left as they are");
}

const res = await fetch(`${api}/data/mutate/${dataset}`, {
  method: "POST",
  headers: { ...auth, "Content-Type": "application/json" },
  body: JSON.stringify({ mutations: docs.map((d) => ({ patch: { id: d._id, set } })) }),
});
if (!res.ok) {
  console.error(`Sanity refused the change: HTTP ${res.status} ${await res.text()}`);
  process.exit(1);
}
console.log(`Done. Gallery now has ${items.length} photos. Updated: ${docs.map((d) => d._id).join(", ")}`);
console.log("The site rebuilds by itself in a minute or two. Now delete the token in sanity.io/manage and remove it from .env.");
