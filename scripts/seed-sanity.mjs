// Loads the site's current content and photos into Sanity, once, so editors start from
// what is live today instead of an empty Studio.
//
//   npm run cms:seed            creates the documents that don't exist yet (never overwrites)
//   npm run cms:seed -- --force replaces them with content/defaults.js (loses Studio edits!)
//
// Needs in .env (or the environment): SANITY_PROJECT_ID, SANITY_DATASET and
// SANITY_WRITE_TOKEN (an "Editor" token from sanity.io/manage → API → Tokens; delete it afterwards).
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
import * as defaults from "../content/defaults.js";

if (existsSync(".env")) process.loadEnvFile(".env");
const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
const force = process.argv.includes("--force");
if (!projectId || !token) {
  console.error("Set SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env first (see CMS.md).");
  process.exit(1);
}
const api = `https://${projectId}.api.sanity.io/v2025-02-19`;
const auth = { Authorization: `Bearer ${token}` };

/* ---------- Uploads (each file once) ---------- */
const uploaded = new Map();
const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4" };

async function upload(path, kind = "images") {
  if (uploaded.has(path)) return uploaded.get(path);
  const body = await readFile(path);
  const res = await fetch(`${api}/assets/${kind}/${dataset}?filename=${encodeURIComponent(basename(path))}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": TYPES[extname(path).toLowerCase()] || "application/octet-stream" },
    body,
  });
  if (!res.ok) throw new Error(`Upload of ${path} failed: HTTP ${res.status} ${await res.text()}`);
  const id = (await res.json()).document._id;
  console.log(`  uploaded ${path}`);
  uploaded.set(path, id);
  return id;
}

// The largest optimised file for each local photo (the originals are not in the repository)
const LOCAL_FILE = {
  gallery: (n) => `media/${n}-main-1600.jpg`,
  section: (n) => `media/${n}-main-1280.jpg`,
  hero: () => "media/hero-portrait-1280.jpg",
};

const photo = async (assetId, alt) => ({ _type: "photo", asset: { _type: "reference", _ref: assetId }, ...(alt ? { alt } : {}) });

/* ---------- Turn defaults.js into Sanity documents ---------- */
async function convert(value, key = "") {
  if (Array.isArray(value)) {
    const out = [];
    for (const v of value) {
      const c = await convert(v);
      if (c === undefined) continue;
      // Objects in arrays need a _key in Sanity
      out.push(c && typeof c === "object" && !c._key ? { _key: randomUUID().slice(0, 12), ...c } : c);
    }
    return out;
  }
  if (value && typeof value === "object") {
    if (value.local && value.kind) return photo(await upload(LOCAL_FILE[value.kind](value.local)), value.alt);
    if (key === "poster" && value.local) return photo(await upload(value.local), "Outreach film cover");
    if (key === "video" && value.local) return { _type: "file", asset: { _type: "reference", _ref: await upload(value.local, "files") } };
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const c = await convert(v, k);
      if (c !== undefined) out[k] = c;
    }
    return out;
  }
  // Empty values are left out, as the Studio does
  return value === "" || value === null ? undefined : value;
}

console.log(`Seeding ${projectId}/${dataset}${force ? " (replacing existing documents)" : ""}…`);
const settings = await convert(defaults.settings);
settings.seo.ogImage = await photo(await upload("public/og-image.jpg"), defaults.settings.seo.ogImageAlt);
const home = await convert(defaults.home);
home.hero.mobileImage = await photo(await upload("media/hero-wide-1200.jpg"), defaults.home.hero.image.alt);
const docs = [settings, home, await convert(defaults.privacy), await convert(defaults.terms)];

const res = await fetch(`${api}/data/mutate/${dataset}?returnIds=true`, {
  method: "POST",
  headers: { ...auth, "Content-Type": "application/json" },
  body: JSON.stringify({ mutations: docs.map((d) => ({ [force ? "createOrReplace" : "createIfNotExists"]: d })) }),
});
if (!res.ok) throw new Error(`Saving the documents failed: HTTP ${res.status} ${await res.text()}`);
const { results } = await res.json();
for (const r of results) console.log(`  ${r.operation === "none" ? "kept (already there)" : r.operation}: ${r.id}`);
console.log("Done. Open the Studio to see and edit the content.");
