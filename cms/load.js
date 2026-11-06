// Gets the site's content: from Sanity when it is connected, otherwise from content/defaults.js.
import * as defaults from "../content/defaults.js";
import { sanityConfig, query } from "./sanity.js";

const DOCS = `{
  "settings": *[_id == "siteSettings"][0],
  "home": *[_id == "homePage"][0],
  "privacy": *[_id == "privacyPage"][0],
  "terms": *[_id == "termsPage"][0]
}`;

// Every image asset used anywhere in the content, so their blurred previews can be fetched in one go
function imageRefs(node, out = new Set()) {
  if (Array.isArray(node)) node.forEach((n) => imageRefs(n, out));
  else if (node && typeof node === "object") {
    if (typeof node._ref === "string" && node._ref.startsWith("image-")) out.add(node._ref);
    Object.values(node).forEach((v) => imageRefs(v, out));
  }
  return out;
}

/**
 * @param env      where to read SANITY_PROJECT_ID and friends
 * @param strict   true for production builds: if Sanity can't be reached, stop the build
 *                 rather than publish the old default wording over the editors' changes
 */
export async function loadContent(env = process.env, { strict = false, log = console } = {}) {
  const fallback = {
    settings: defaults.settings, home: defaults.home, privacy: defaults.privacy, terms: defaults.terms,
    cfg: null, lqip: {}, source: "defaults", updatedAt: null,
  };
  const cfg = sanityConfig(env);
  if (!cfg) return fallback;

  try {
    const docs = await query(cfg, DOCS);
    const ids = [...imageRefs(docs)];
    const assets = ids.length ? await query(cfg, `*[_id in $ids]{_id, "lqip": metadata.lqip}`, { ids }) : [];
    const missing = Object.keys(docs).filter((k) => !docs[k]);
    if (missing.length) log.warn?.(`[cms] Not in Sanity yet, using the built-in content for: ${missing.join(", ")}. Run "npm run cms:seed" to load it.`);
    const updatedAt = Object.values(docs).map((d) => d?._updatedAt).filter(Boolean).sort().pop() || null;
    return {
      settings: docs.settings || fallback.settings,
      home: docs.home || fallback.home,
      privacy: docs.privacy || fallback.privacy,
      terms: docs.terms || fallback.terms,
      cfg,
      lqip: Object.fromEntries(assets.map((a) => [a._id, a.lqip])),
      source: "sanity",
      updatedAt,
      updated: Object.fromEntries(Object.entries(docs).map(([k, d]) => [k, d?._updatedAt || null])),
    };
  } catch (err) {
    if (strict) throw new Error(`[cms] Could not read content from Sanity, so the build stopped (the live site is unchanged). ${err.message}`);
    log.warn?.(`[cms] Could not reach Sanity, showing the built-in content instead. ${err.message}`);
    return fallback;
  }
}
