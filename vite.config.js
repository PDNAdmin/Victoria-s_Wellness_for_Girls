import { defineConfig } from "vite";
import { resolve } from "node:path";

// The site's live web address, for example https://www.victoriaswellness.org
// Set it when building:  SITE_URL=https://... npm run build
// (PowerShell: $env:SITE_URL="https://..."; npm run build)
// Search engines and social previews need full addresses, so without it the build
// leaves out the canonical link, og:url, the sitemap and full image addresses.
const SITE_URL = (process.env.SITE_URL || "").trim().replace(/\/+$/, "");

const ORG = {
  name: "Victoria's Wellness Initiative for Women and Girls",
  alternateName: ["Victoria's Wellness", "VWIG", "vwigcare"],
  email: "victoriaswellnessintiative4wg@gmail.com",
  telephone: "+234 705 242 9995",
  instagram: "https://www.instagram.com/vwigcare",
};

// schema.org data: who the organisation is, where it works and what it does
function schema() {
  const abs = (p) => (SITE_URL ? `${SITE_URL}/${p}` : undefined);
  const org = {
    "@type": "NGO",
    "@id": SITE_URL ? `${SITE_URL}/#organization` : undefined,
    name: ORG.name,
    alternateName: ORG.alternateName,
    url: abs(""),
    logo: abs("brand/logo-full.png"),
    image: abs("og-image.jpg"),
    slogan: "Healthier Women. Brighter Futures.",
    description:
      "A community-driven Nigerian non-profit advancing the health, dignity and wellbeing of women and girls through health education, menstrual health, preventive care, health screening outreaches and community support.",
    nonprofitStatus: "Nonprofit",
    email: ORG.email,
    telephone: ORG.telephone,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "community support",
      telephone: ORG.telephone,
      email: ORG.email,
      areaServed: "NG",
      availableLanguage: ["English"],
    },
    areaServed: [
      { "@type": "State", name: "Lagos State", containedInPlace: { "@type": "Country", name: "Nigeria" } },
      { "@type": "State", name: "Ogun State", containedInPlace: { "@type": "Country", name: "Nigeria" } },
      { "@type": "State", name: "Osun State", containedInPlace: { "@type": "Country", name: "Nigeria" } },
      { "@type": "Country", name: "Nigeria" },
    ],
    knowsAbout: [
      "Women's health",
      "Girls' health and empowerment",
      "Menstrual health and hygiene",
      "Period poverty",
      "Health education",
      "Cervical cancer screening",
      "HPV vaccination awareness",
      "Malaria prevention",
      "Mental and emotional wellbeing",
      "Community health outreach",
      "Telehealth",
    ],
    sameAs: [ORG.instagram],
  };
  const site = SITE_URL && {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: "Victoria's Wellness",
    inLanguage: "en-NG",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
  const data = { "@context": "https://schema.org", "@graph": [org, site].filter(Boolean) };
  // JSON.stringify drops the undefined fields; escape "<" so the data can't end the script tag
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}

function seo() {
  return {
    name: "vw-seo",
    transformIndexHtml: {
      // "pre": fill the placeholders before Vite reads the page's links
      order: "pre",
      handler: fillSeo,
    },
    generateBundle() {
      const lines = ["User-agent: *", "Allow: /"];
      if (SITE_URL) lines.push("", `Sitemap: ${SITE_URL}/sitemap.xml`);
      this.emitFile({ type: "asset", fileName: "robots.txt", source: lines.join("\n") + "\n" });

      if (SITE_URL) {
        // Only the home page for now: the privacy and terms pages are placeholders marked noindex
        const today = new Date().toISOString().slice(0, 10);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod></url>
</urlset>
`;
        this.emitFile({ type: "asset", fileName: "sitemap.xml", source: xml });
      } else {
        this.warn("SITE_URL is not set: built without canonical link, og:url, full image addresses or sitemap.xml. See vite.config.js.");
      }
    },
  };
}

function fillSeo(html) {
  html = html.replace("<!-- seo:schema -->", `<script type="application/ld+json">\n${schema()}\n  </script>`);
  if (SITE_URL) return html.replaceAll("%SITE_URL%", SITE_URL);
  // No address yet: drop the tags that only work with a full address
  return html.replace(/^[ \t]*<(?:link|meta)\b[^>]*%SITE_URL%[^>]*>\r?\n/gm, "");
}

export default defineConfig({
  // Relative URLs in the build, so the site works from any folder or host path
  base: "./",
  plugins: [seo()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        privacy: resolve(__dirname, "privacy.html"),
        terms: resolve(__dirname, "terms.html"),
      },
    },
  },
});
