// Search engine optimisation (SEO) and answer engine optimisation (AEO):
// meta tags, schema.org structured data, robots.txt, sitemap.xml and llms.txt, all from the content.
// %SITE_URL% is filled in by vite.config.js (or the tag removed when no address is set).
import { esc, plain, portableText } from "./html.js";
import { contactLinks, upcomingEvents } from "./render-home.js";

const abs = (siteUrl, path = "") => (siteUrl ? `${siteUrl}/${path}` : undefined);

/* ---------- <head> tags for the home page ---------- */
export function renderHead(content, media) {
  const s = content.settings;
  const seo = s.seo || {};
  const og = seo.ogImage && media.isSanity(seo.ogImage)
    ? { url: media.src(seo.ogImage, 1200, 630 / 1200), w: 1200, h: 630 }
    : { url: "%SITE_URL%/og-image.jpg", w: 1200, h: 630 };
  const lines = [
    `<title>${esc(seo.title || s.orgName)}</title>`,
    `<meta name="description" content="${esc(seo.description)}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`,
    `<link rel="canonical" href="%SITE_URL%/">`,
    `<link rel="alternate" type="text/plain" href="%SITE_URL%/llms.txt" title="Plain-text summary for AI assistants">`,
    "",
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(s.orgName)}">`,
    `<meta property="og:locale" content="en_NG">`,
    `<meta property="og:url" content="%SITE_URL%/">`,
    `<meta property="og:title" content="${esc(seo.ogTitle || seo.title)}">`,
    `<meta property="og:description" content="${esc(seo.ogDescription || seo.description)}">`,
    `<meta property="og:image" content="${esc(og.url)}">`,
    `<meta property="og:image:width" content="${og.w}">`,
    `<meta property="og:image:height" content="${og.h}">`,
    `<meta property="og:image:alt" content="${esc(seo.ogImageAlt || seo.ogImage?.alt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(seo.ogTitle || seo.title)}">`,
    `<meta name="twitter:description" content="${esc(seo.twitterDescription || seo.ogDescription || seo.description)}">`,
    `<meta name="twitter:image" content="${esc(og.url)}">`,
  ];
  if (content.source === "sanity") lines.push("", '<link rel="preconnect" href="https://cdn.sanity.io" crossorigin>');
  return lines.map((l) => (l ? `  ${l}` : "")).join("\n");
}

/* ---------- schema.org structured data ---------- */
export function schemaGraph(content, media, siteUrl) {
  const s = content.settings;
  const h = content.home;
  const L = contactLinks(s);
  const aeo = s.aeo || {};
  const orgId = `${siteUrl || ""}/#organization`;
  const org = {
    "@type": "NGO",
    "@id": orgId,
    name: s.orgName,
    alternateName: s.alternateNames?.length ? s.alternateNames : undefined,
    url: abs(siteUrl, ""),
    logo: abs(siteUrl, "brand/logo-full.png"),
    image: s.seo?.ogImage && media.isSanity(s.seo.ogImage) ? media.src(s.seo.ogImage, 1200) : abs(siteUrl, "og-image.jpg"),
    slogan: s.slogan || undefined,
    description: aeo.summary || s.orgDescription,
    disambiguatingDescription: aeo.summary ? s.orgDescription : undefined,
    foundingDate: aeo.foundingDate || undefined,
    nonprofitStatus: "Nonprofit",
    email: s.email || undefined,
    telephone: s.phone || undefined,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "community support",
      telephone: s.phone || undefined,
      email: s.email || undefined,
      url: L.wa,
      areaServed: "NG",
      availableLanguage: ["English"],
    },
    areaServed: (aeo.areasServed || []).map((a) =>
      a.kind === "Country"
        ? { "@type": "Country", name: a.name }
        : { "@type": a.kind || "State", name: a.name, containedInPlace: { "@type": "Country", name: "Nigeria" } }),
    knowsAbout: aeo.topics?.length ? aeo.topics : undefined,
    sameAs: L.instagram ? [L.instagram] : undefined,
    // Programmes as services the organisation offers
    hasOfferCatalog: h.programmes?.items?.length ? {
      "@type": "OfferCatalog",
      name: h.programmes.title || "Programmes",
      itemListElement: h.programmes.items.map((p) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: p.name,
          description: p.text,
          audience: p.audience ? { "@type": "Audience", audienceType: p.audience } : undefined,
          provider: { "@id": orgId },
          areaServed: "Nigeria",
        },
      })),
    } : undefined,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl || ""}/#website`,
    url: abs(siteUrl, ""),
    name: s.shortName || s.orgName,
    alternateName: s.orgName,
    inLanguage: "en-NG",
    publisher: { "@id": orgId },
  };

  const page = {
    "@type": "WebPage",
    "@id": `${siteUrl || ""}/#webpage`,
    url: abs(siteUrl, ""),
    name: s.seo?.title,
    description: s.seo?.description,
    inLanguage: "en-NG",
    isPartOf: { "@id": website["@id"] },
    about: { "@id": orgId },
    dateModified: content.updated?.home || content.updatedAt || undefined,
    // The parts a voice assistant should read out
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".hero__title", ".hero__lead", ".faq__q", ".faq__a"] },
  };

  const faqItems = h.faq?.enabled === false ? [] : (h.faq?.items || []).filter((q) => q.question && q.answer);
  const faq = faqItems.length && {
    "@type": "FAQPage",
    "@id": `${siteUrl || ""}/#faq`,
    isPartOf: { "@id": page["@id"] },
    mainEntity: faqItems.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: plain(q.answer) },
    })),
  };

  const events = upcomingEvents(h.outreach?.events).map((e) => ({
    "@type": "Event",
    name: e.title,
    startDate: e.start,
    endDate: e.end || undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: e.description || undefined,
    location: {
      "@type": "Place",
      name: e.place,
      address: { "@type": "PostalAddress", addressLocality: e.town || e.place, addressCountry: "NG" },
    },
    organizer: { "@id": orgId },
    url: abs(siteUrl, "#outreach"),
  }));

  const data = { "@context": "https://schema.org", "@graph": [org, website, page, faq, ...events].filter(Boolean) };
  // JSON.stringify drops undefined fields; escape "<" so the data can't end the script tag
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2).replace(/</g, "\\u003c")}\n  </script>`;
}

/* ---------- Settings the browser scripts need (form addresses, WhatsApp) ---------- */
export function siteConfigScript(content) {
  const s = content.settings;
  const f = s.forms || {};
  const cfg = {
    supportEndpoint: f.supportEndpoint || "",
    involvedEndpoint: f.involvedEndpoint || "",
    contactEndpoint: f.contactEndpoint || "",
    newsletterEndpoint: f.newsletterEndpoint || "",
    replyTime: f.replyTime || "",
    whatsapp: contactLinks(s).wa,
  };
  return `<script type="application/json" id="site-config">${JSON.stringify(cfg).replace(/</g, "\\u003c")}</script>`;
}

/* ---------- robots.txt ---------- */
// AI search tools fetch pages to cite them in answers: always welcome.
const AI_SEARCH = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User", "Applebot", "DuckAssistBot"];
// Crawlers that collect text to train AI models: allowed or blocked from Site settings → AI answers.
const AI_TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "meta-externalagent", "Bytespider"];

export function robotsTxt(content, siteUrl) {
  const allowTraining = content.settings.aeo?.allowAiTraining !== false;
  const lines = [
    "# Search engines",
    "User-agent: *",
    "Allow: /",
    "",
    "# AI search and answer tools (they quote and link to this site)",
    ...AI_SEARCH.map((b) => `User-agent: ${b}`),
    "Allow: /",
    "",
    `# AI training crawlers (${allowTraining ? "allowed" : "blocked"} in Site settings → AI answers)`,
    ...AI_TRAINING.map((b) => `User-agent: ${b}`),
    allowTraining ? "Allow: /" : "Disallow: /",
  ];
  if (siteUrl) lines.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
  return lines.join("\n") + "\n";
}

/* ---------- sitemap.xml ---------- */
export function sitemapXml(content, siteUrl) {
  const day = (d) => (d ? d.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const pages = [{ loc: `${siteUrl}/`, lastmod: day(content.updated?.home || content.updatedAt) }];
  for (const [key, file] of [["privacy", "privacy.html"], ["terms", "terms.html"]]) {
    if (content[key] && !content[key].hideFromSearch) pages.push({ loc: `${siteUrl}/${file}`, lastmod: day(content.updated?.[key]) });
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${esc(p.loc)}</loc><lastmod>${p.lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;
}

/* ---------- llms.txt: a plain summary for AI assistants (llmstxt.org) ---------- */
export function llmsTxt(content, siteUrl) {
  const s = content.settings;
  const h = content.home;
  const L = contactLinks(s);
  const url = (p = "") => (siteUrl ? `${siteUrl}/${p}` : p || "./");
  const fmt = (n) => Number(n || 0).toLocaleString("en-GB");
  const stat = (x) => `- ${x.prefix ? x.prefix + " " : ""}${fmt(x.number)} ${x.label}`;
  const out = [];
  const push = (...l) => out.push(...l);

  push(`# ${s.orgName}`, "", `> ${plain(s.aeo?.summary || s.orgDescription)}`, "");
  if (s.alternateNames?.length) push(`Also known as: ${s.alternateNames.join(", ")}.`);
  if (s.slogan) push(`Slogan: ${s.slogan}`);
  push(`Website: ${url()}`, "");

  const pr = h.programmes;
  if (pr?.items?.length) {
    push(`## ${pr.title || "Programmes"}`, "");
    for (const p of pr.items) {
      const status = p.status === "partner" ? pr.statusPartnerLabel || "With partners" : pr.statusNowLabel || "Running now";
      push(`- **${p.name}** (${status.toLowerCase()}): ${p.text}${p.audience ? ` For: ${p.audience}.` : ""}`);
    }
    if (pr.note) push("", plain(pr.note));
    push("");
  }

  const wh = h.where;
  if (wh) {
    push("## Where we work", "", plain(wh.body), "");
    if (wh.stops?.length) push(`Communities reached: ${wh.stops.map((x) => (x.area ? `${x.place} (${x.area})` : x.place)).join(", ")}.`, "");
  }

  const im = h.impact;
  if (im) {
    push(`## Impact${im.asOf ? ` (figures as of ${im.asOf})` : ""}`, "");
    [...(im.major || []), ...(im.minor || [])].forEach((x) => push(stat(x)));
    if (im.checks?.length) push("", `${im.checksTitle || "Health checks offered"}: ${im.checks.join(", ")}.`);
    push("");
  }

  const ev = upcomingEvents(h.outreach?.events);
  if (ev.length) {
    push("## Upcoming outreaches", "");
    ev.forEach((e) => push(`- ${e.start.slice(0, 10)}: ${e.title}, ${[e.place, e.town].filter(Boolean).join(", ")}${e.description ? `. ${e.description}` : ""}`));
    push("");
  }

  push("## How to get help", "");
  if (h.support?.body) push(plain(h.support.body), "");
  push(`- Support request form: ${url("#get-support")}`);
  if (s.phone) push(`- WhatsApp: ${L.wa}`, `- Phone: ${s.phone}`);
  if (s.email) push(`- Email: ${s.email}`);
  if (h.support?.disclaimer) push("", plain(h.support.disclaimer));
  push("");

  if (h.involved) push("## Get involved", "", plain(h.involved.body), `Form: ${url("#get-involved")}`, "");
  if (h.donate) push("## Donate", "", plain(h.donate.howText), "");

  const faq = h.faq?.enabled === false ? [] : (h.faq?.items || []).filter((q) => q.question && q.answer);
  if (faq.length) {
    push("## Frequently asked questions", "");
    faq.forEach((q) => push(`### ${q.question}`, "", plain(q.answer), ""));
  }

  push("## Contact", "");
  if (s.phone) push(`- Phone and WhatsApp: ${s.phone}`);
  if (s.email) push(`- Email: ${s.email}`);
  if (L.instagram) push(`- Instagram: ${L.instagram}`);
  push("");

  push("## Pages", "", `- [Home](${url()}): everything above, with photos and forms`);
  for (const [key, file] of [["privacy", "privacy.html"], ["terms", "terms.html"]]) {
    const p = content[key];
    if (p && !p.hideFromSearch) push(`- [${p.title}](${url(file)}): ${p.description || ""}`);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

/* ---------- Legal pages ---------- */
export function renderLegal(content, key) {
  const s = content.settings;
  const p = content[key];
  const file = `${key}.html`;
  const updated = p.updated ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(p.updated)) : "";
  const head = [
    `<title>${esc(p.title)} | ${esc(s.shortName)}</title>`,
    `<meta name="description" content="${esc(p.description)}">`,
    `<meta name="robots" content="${p.hideFromSearch ? "noindex, follow" : "index, follow"}">`,
    p.hideFromSearch ? "" : `<link rel="canonical" href="%SITE_URL%/${file}">`,
  ].filter(Boolean).map((l) => `  ${l}`).join("\n");

  const body = `  <header class="site-header is-scrolled">
    <div class="wrap site-header__inner">
      <a class="brand" href="index.html" aria-label="${esc(s.orgName)}, home">
        <img class="brand__mark" src="media/logo-emblem.png" width="223" height="192" alt="">
        <span class="brand__text">
          <span class="brand__name">${esc(s.shortName)}</span>
          <span class="brand__sub">${esc(s.subName)}</span>
        </span>
      </a>
      <a class="btn btn-primary btn-sm" href="index.html#get-support">${esc(s.supportLabel)}</a>
    </div>
  </header>
  <main class="legal wrap">
    <h1>${esc(p.title)}</h1>
    ${updated ? `<p class="legal__updated">Last updated <time datetime="${esc(p.updated)}">${updated}</time></p>` : ""}
    ${portableText(p.body || [])}
    ${p.pendingNote ? `<p class="pending-note">${esc(p.pendingNote)}</p>` : ""}
    <p><a href="index.html">Back to home</a></p>
  </main>`;
  return { head, body };
}

