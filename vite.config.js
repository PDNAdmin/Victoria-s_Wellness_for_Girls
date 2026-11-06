import { defineConfig, loadEnv } from "vite";
import { resolve } from "node:path";
import { loadContent } from "./cms/load.js";
import { createMedia } from "./cms/html.js";
import { renderHome } from "./cms/render-home.js";
import { renderHead, schemaGraph, siteConfigScript, robotsTxt, sitemapXml, llmsTxt, renderLegal } from "./cms/seo.js";

// Settings come from the environment or a .env file next to this one (see .env.example):
//   SITE_URL           the live web address, e.g. https://www.victoriaswellness.org
//                      Search engines and social previews need full addresses, so without it the
//                      build leaves out the canonical link, og:url, the sitemap and full image addresses.
//   SANITY_PROJECT_ID  and SANITY_DATASET: where the content lives. Without them the site uses
//                      content/defaults.js.

function cms(env, command) {
  const SITE_URL = (env.SITE_URL || "").trim().replace(/\/+$/, "");
  const isBuild = command === "build";
  let cached;
  // A build reads the content once; the dev server reads it fresh on every page load,
  // so a published change in the Studio shows on refresh.
  const content = () => {
    if (isBuild) return (cached ??= loadContent(env, { strict: true }));
    return loadContent(env, { strict: false });
  };

  const fillUrls = (html) => {
    if (SITE_URL) return html.replaceAll("%SITE_URL%", SITE_URL);
    // No address yet: drop the tags that only work with a full address
    return html.replace(/^[ \t]*<(?:link|meta)\b[^>]*%SITE_URL%[^>]*>\r?\n/gm, "");
  };

  async function render(html, ctx) {
    const c = await content();
    const media = createMedia(c);
    if (html.includes("<!-- cms:body -->")) {
      html = html
        .replace("<!-- cms:head -->", () => renderHead(c, media).trimStart())
        .replace("<!-- cms:schema -->", () => schemaGraph(c, media, SITE_URL))
        .replace("<!-- cms:body -->", () => renderHome(c, media).trim())
        .replace("<!-- cms:config -->", () => siteConfigScript(c));
    }
    if (html.includes("<!-- cms:legal-body -->")) {
      const key = /terms/.test(ctx.filename || ctx.path) ? "terms" : "privacy";
      const page = renderLegal(c, key);
      html = html.replace("<!-- cms:legal-head -->", () => page.head.trimStart()).replace("<!-- cms:legal-body -->", () => page.body.trimStart());
    }
    return fillUrls(html);
  }

  const files = {
    "/robots.txt": ["text/plain", (c) => robotsTxt(c, SITE_URL)],
    "/llms.txt": ["text/plain", (c) => llmsTxt(c, SITE_URL)],
    ...(SITE_URL ? { "/sitemap.xml": ["application/xml", (c) => sitemapXml(c, SITE_URL)] } : {}),
  };

  return {
    name: "vw-cms",
    transformIndexHtml: {
      // "pre": build the page before Vite reads its links, so images and scripts are still bundled
      order: "pre",
      handler: render,
    },
    // npm run dev: serve robots.txt, llms.txt and sitemap.xml too
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const file = files[(req.url || "").split("?")[0]];
        if (!file) return next();
        res.setHeader("Content-Type", `${file[0]}; charset=utf-8`);
        res.end(file[1](await content()));
      });
    },
    async generateBundle() {
      const c = await content();
      for (const [path, [, make]] of Object.entries(files)) {
        this.emitFile({ type: "asset", fileName: path.slice(1), source: make(c) });
      }
      this.info?.(`content from ${c.source === "sanity" ? `Sanity (${c.cfg.projectId}/${c.cfg.dataset})` : "content/defaults.js"}`);
      if (!SITE_URL) {
        this.warn("SITE_URL is not set: built without canonical link, og:url, full image addresses or sitemap.xml. See vite.config.js.");
      }
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  return {
    // Relative URLs in the build, so the site works from any folder or host path
    base: "./",
    plugins: [cms(env, command)],
    server: { watch: { ignored: ["**/studio/**"] } },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          privacy: resolve(__dirname, "privacy.html"),
          terms: resolve(__dirname, "terms.html"),
        },
      },
    },
  };
});
