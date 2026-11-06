// Reading content from Sanity at build time (and on each page load in `npm run dev`).
// Uses Sanity's HTTP API directly, so the site needs no extra packages.

const API_VERSION = "2025-02-19";

export function sanityConfig(env = process.env) {
  const projectId = (env.SANITY_PROJECT_ID || env.SANITY_STUDIO_PROJECT_ID || "").trim();
  const dataset = (env.SANITY_DATASET || env.SANITY_STUDIO_DATASET || "production").trim();
  const token = (env.SANITY_READ_TOKEN || "").trim(); // only needed for a private dataset
  return projectId ? { projectId, dataset, token } : null;
}

export async function query(cfg, groq, params = {}) {
  const url = new URL(`https://${cfg.projectId}.api.sanity.io/v${API_VERSION}/data/query/${cfg.dataset}`);
  url.searchParams.set("query", groq);
  url.searchParams.set("perspective", "published"); // never show unpublished drafts on the live site
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v));
  const res = await fetch(url, { headers: cfg.token ? { Authorization: `Bearer ${cfg.token}` } : {} });
  if (!res.ok) throw new Error(`Sanity query failed: HTTP ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

/* ---------- Asset addresses ---------- */

// image-<id>-<w>x<h>-<ext>
export function parseImageRef(ref) {
  const m = /^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/.exec(ref || "");
  return m ? { id: m[1], width: +m[2], height: +m[3], ext: m[4] } : null;
}

export function fileUrl(cfg, ref) {
  const m = /^file-([a-f0-9]+)-(\w+)$/.exec(ref || "");
  return m ? `https://cdn.sanity.io/files/${cfg.projectId}/${cfg.dataset}/${m[1]}.${m[2]}` : "";
}

/**
 * A Sanity CDN address for an image at a given width.
 * Respects the editor's crop; with `aspect` (height ÷ width) it crops around the hotspot.
 * auto=format serves AVIF or WebP to browsers that support them.
 */
export function imageUrl(cfg, image, { width, aspect } = {}) {
  const info = parseImageRef(image?.asset?._ref);
  if (!info) return "";
  const p = new URLSearchParams();
  const c = image.crop;
  let cw = info.width, ch = info.height, left = 0, top = 0;
  if (c && (c.left || c.right || c.top || c.bottom)) {
    left = Math.round(c.left * info.width);
    top = Math.round(c.top * info.height);
    cw = Math.round((1 - c.left - c.right) * info.width);
    ch = Math.round((1 - c.top - c.bottom) * info.height);
    p.set("rect", `${left},${top},${cw},${ch}`);
  }
  if (width) p.set("w", String(width));
  if (width && aspect) {
    p.set("h", String(Math.round(width * aspect)));
    p.set("fit", "crop");
    const h = image.hotspot;
    if (h) {
      p.set("crop", "focalpoint");
      const fx = (h.x * info.width - left) / cw;
      const fy = (h.y * info.height - top) / ch;
      p.set("fp-x", Math.min(1, Math.max(0, fx)).toFixed(3));
      p.set("fp-y", Math.min(1, Math.max(0, fy)).toFixed(3));
    }
  } else {
    p.set("fit", "max");
  }
  p.set("auto", "format");
  p.set("q", "78");
  return `https://cdn.sanity.io/images/${cfg.projectId}/${cfg.dataset}/${info.id}-${info.width}x${info.height}.${info.ext}?${p}`;
}

/** Width and height of the image after the editor's crop (for the img width/height attributes). */
export function imageSize(image) {
  const info = parseImageRef(image?.asset?._ref);
  if (!info) return { width: 0, height: 0 };
  const c = image.crop || {};
  return {
    width: Math.round((1 - (c.left || 0) - (c.right || 0)) * info.width),
    height: Math.round((1 - (c.top || 0) - (c.bottom || 0)) * info.height),
  };
}
