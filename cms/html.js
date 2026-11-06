// Small, safe HTML helpers. Every piece of content is escaped before it reaches the page.
import { imageUrl, imageSize, fileUrl } from "./sanity.js";

export const esc = (v) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); // attributes always use double quotes

/** Text with the editors' marks: **bold** and *highlight/italic*. */
export function inline(text, { em = "", bold = "b" } = {}) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, `<${bold}>$1</${bold}>`)
    .replace(/\*(.+?)\*/g, em ? `<em class="${em}">$1</em>` : "<em>$1</em>");
}

/** Marks removed, for places that need plain text (meta tags, structured data, llms.txt). */
export const plain = (text) => String(text ?? "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");

/** Text with blank lines between paragraphs, as <p> elements. */
export const paras = (text, attrs = "") =>
  String(text ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    .map((p) => `<p${attrs}>${inline(p).replace(/\n/g, "<br>")}</p>`).join("\n");

/** Only render `html` when `value` has content. */
export const when = (value, html) => (value && (!Array.isArray(value) || value.length) ? html() : "");

export const isExternal = (href) => /^https?:\/\//i.test(href || "");
export const linkAttrs = (href) => `href="${esc(href)}"${isExternal(href) ? ' target="_blank" rel="noopener"' : ""}`;

/* ---------- Portable Text (legal pages) ---------- */

function spans(block) {
  const defs = Object.fromEntries((block.markDefs || []).map((d) => [d._key, d]));
  return (block.children || []).map((s) => {
    let out = esc(s.text).replace(/\n/g, "<br>");
    for (const m of s.marks || []) {
      if (m === "strong") out = `<strong>${out}</strong>`;
      else if (m === "em") out = `<em>${out}</em>`;
      else if (m === "code") out = `<code>${out}</code>`;
      else if (defs[m]?._type === "link") out = `<a ${linkAttrs(defs[m].href)}>${out}</a>`;
    }
    return out;
  }).join("");
}

export function portableText(blocks = []) {
  const out = [];
  let list = null;
  for (const b of blocks) {
    if (b._type !== "block") continue;
    if (b.listItem) {
      const tag = b.listItem === "number" ? "ol" : "ul";
      if (list !== tag) { if (list) out.push(`</${list}>`); out.push(`<${tag}>`); list = tag; }
      out.push(`<li>${spans(b)}</li>`);
      continue;
    }
    if (list) { out.push(`</${list}>`); list = null; }
    const tag = ["h2", "h3", "h4", "blockquote"].includes(b.style) ? b.style : "p";
    out.push(`<${tag}>${spans(b)}</${tag}>`);
  }
  if (list) out.push(`</${list}>`);
  return out.join("\n");
}

export const portableTextPlain = (blocks = []) =>
  blocks.filter((b) => b._type === "block").map((b) => (b.children || []).map((c) => c.text).join("")).join("\n\n");

/* ---------- Images and media ---------- */

const isSanity = (image) => !!image?.asset?._ref;

/** Local image files made by scripts/optimize-media.mjs: media/<name>-main-<width>.<ext> */
const LOCAL_WIDTHS = { gallery: [480, 960], section: [560, 880, 1280] };
const LOCAL_SRC = { gallery: 960, section: 880 };

export function createMedia(ctx) {
  const { cfg, lqip = {} } = ctx;

  /** A blurred preview behind a Sanity photo while it loads (local photos have theirs in the CSS). */
  const lqipStyle = (image) => {
    const data = isSanity(image) && lqip[image.asset._ref];
    return data ? ` style="background-image:url('${data}')"` : "";
  };

  /**
   * <picture> for one photo.
   * opts.sizes      the sizes attribute
   * opts.eager      load straight away (above the fold)
   * opts.full       also list a large file (the gallery viewer opens the largest one)
   * opts.imgSizes   a separate sizes for the <img> (gallery)
   */
  function picture(image, opts = {}) {
    if (!image) return "";
    const { sizes = "100vw", eager = false, full = false, imgSizes } = opts;
    const alt = esc(image.alt);
    const load = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';

    if (isSanity(image)) {
      const { width, height } = imageSize(image);
      const widths = [480, 800, 1200, ...(full ? [1600, 2000] : [])].filter((w) => w <= width || w === 480);
      const srcset = widths.map((w) => `${imageUrl(cfg, image, { width: w })} ${w}w`).join(", ");
      const shown = Math.min(960, width);
      return `<picture>
  <img src="${imageUrl(cfg, image, { width: shown })}" srcset="${srcset}" sizes="${esc(imgSizes || sizes)}" width="${shown}" height="${Math.round((shown * height) / width)}" ${load} alt="${alt}">
</picture>`;
    }

    const kind = image.kind || "gallery";
    const name = image.local;
    const widths = LOCAL_WIDTHS[kind];
    const set = (ext) => widths.map((w) => `media/${name}-main-${w}.${ext} ${w}w`).join(", ");
    const jpg = `media/${name}-main-${LOCAL_SRC[kind]}.jpg`;
    const fullSet = full ? ` srcset="${jpg} 960w, media/${name}-main-1600.jpg 1600w" sizes="${esc(imgSizes || sizes)}"` : "";
    return `<picture>
  <source type="image/avif" srcset="${set("avif")}" sizes="${esc(sizes)}">
  <source type="image/webp" srcset="${set("webp")}" sizes="${esc(sizes)}">
  <img src="${jpg}"${fullSet} width="${image.width}" height="${image.height}" ${load} alt="${alt}">
</picture>`;
  }

  /** The hero photo: a tall 4:5 crop on computers, a wider one on phones. */
  function heroPicture(image, mobile) {
    if (!image) return "";
    const alt = esc(image.alt);
    const desktopSizes = "(min-width: 1180px) 520px, 44vw";
    const phoneSizes = "calc(100vw - 32px)";
    if (isSanity(image)) {
      const m = mobile && isSanity(mobile) ? mobile : image;
      const portrait = [640, 960, 1280].map((w) => `${imageUrl(cfg, image, { width: w, aspect: 1.25 })} ${w}w`).join(", ");
      const wide = [480, 800, 1200].map((w) => `${imageUrl(cfg, m, { width: w, aspect: 0.8 })} ${w}w`).join(", ");
      return `<picture>
  <source media="(min-width: 900px)" srcset="${portrait}" sizes="${desktopSizes}">
  <source srcset="${wide}" sizes="${phoneSizes}">
  <img src="${imageUrl(cfg, image, { width: 960, aspect: 1.25 })}" width="960" height="1200" alt="${alt}" fetchpriority="high" decoding="async">
</picture>`;
    }
    const set = (crop, ws, ext) => ws.map((w) => `media/hero-${crop}-${w}.${ext} ${w}w`).join(", ");
    return `<picture>
  <source type="image/avif" media="(min-width: 900px)" srcset="${set("portrait", [640, 960, 1280], "avif")}" sizes="${desktopSizes}">
  <source type="image/webp" media="(min-width: 900px)" srcset="${set("portrait", [640, 960, 1280], "webp")}" sizes="${desktopSizes}">
  <source type="image/avif" srcset="${set("wide", [480, 800, 1200], "avif")}" sizes="${phoneSizes}">
  <source type="image/webp" srcset="${set("wide", [480, 800, 1200], "webp")}" sizes="${phoneSizes}">
  <img src="media/hero-portrait-960.jpg" width="960" height="1200" alt="${alt}" fetchpriority="high" decoding="async">
</picture>`;
  }

  /** A single image address (video poster, share image). */
  const src = (image, width = 1280, aspect) =>
    !image ? "" : isSanity(image) ? imageUrl(cfg, image, { width, aspect }) : image.local;

  const file = (f) => (!f ? "" : f.asset?._ref ? fileUrl(cfg, f.asset._ref) : f.local);

  return { picture, heroPicture, lqipStyle, src, file, isSanity };
}
