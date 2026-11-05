# Victoria-s_Wellness_for_Girls

One-page website for **Victoria's Wellness Initiative for Women and Girls**: health education, preventive care and community support for women and girls in Nigeria and beyond.

## Run it

```bash
npm install
npm run dev       # local preview at http://localhost:5173
npm run build     # production files in dist/
```

## Project layout

- `index.html`, `privacy.html`, `terms.html`: the pages
- `src/`: scripts (motion with GSAP and Lenis, forms, gallery) and styles (`src/styles/`)
- `src/config.js`: form destinations and the promised reply time (empty means not connected yet)
- `media/`: optimised photos, film and logo used by the site
- `video/`: Remotion source for the 20-second outreach film (`cd video && npm install && npm run render`)
- `scripts/`: image optimisation and screenshot/test helpers

Raw original photos and client documents are not in this repository.
