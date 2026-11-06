# Victoria-s_Wellness_for_Girls

One-page website for **Victoria's Wellness Initiative for Women and Girls**: health education, preventive care and community support for women and girls in Nigeria and beyond.

## Run it

```bash
npm install
npm run dev       # local preview at http://localhost:5173
npm run build     # production files in dist/
```

For the live site, build with the real web address so search engines get the canonical link,
sitemap and preview image: set `SITE_URL` in `.env` (see `.env.example`). See [SEO.md](SEO.md).

## Editing the content

All the words, photos and settings are edited in **Sanity Studio** (`studio/`). The site reads them when it
is built. Without Sanity connected, it uses `content/defaults.js`. Setup and an editors' guide: [CMS.md](CMS.md).

```bash
npm run studio      # the Studio at http://localhost:3333 (after: cd studio && npm install)
npm run cms:seed    # one time: load the current content and photos into Sanity
```

## Project layout

- `index.html`, `privacy.html`, `terms.html`: page shells; their content is filled in at build time
- `cms/`: turns the content into HTML (`render-home.js`), plus SEO/AEO tags, structured data, `robots.txt`, `sitemap.xml` and `llms.txt` (`seo.js`)
- `content/defaults.js`: the content used when Sanity is not connected, and the source for `npm run cms:seed`
- `studio/`: Sanity Studio (the editing app) and the content model (`studio/schemaTypes/`)
- `src/`: scripts (motion with GSAP and Lenis, forms, gallery) and styles (`src/styles/`)
- `src/config.js`: reads the form destinations and reply time set in the Studio
- `media/`: optimised photos, film and logo used by the site
- `video/`: Remotion source for the 20-second outreach film (`cd video && npm install && npm run render`)
- `scripts/`: image optimisation and screenshot/test helpers

Raw original photos and client documents are not in this repository.
