# Editing the site with Sanity

Everything people see on the site is edited in **Sanity Studio**: every heading, paragraph, photo, caption, button, programme, value, figure, community, form question, FAQ, upcoming outreach, the contact details, the announcement bar, the footer, the legal pages, and the search and AI-answer settings.

What stays in code: the design (layout, colours, fonts, animation), the drawings of the icons (editors pick from a list), and the error messages inside the forms.

## How it works

```
Sanity Studio  ──publish──▶  Sanity (content)  ──webhook──▶  host rebuilds the site  ──▶  live site
```

- The site is still a fast static site. The content is read from Sanity **when the site is built**, and written into the HTML. Search engines and AI tools see all the text without running any scripts.
- **Not connected to Sanity?** The site uses `content/defaults.js`, which holds the wording that was on the site before Sanity. Nothing breaks.
- **Sanity unreachable during a build?** The build stops, and the live site stays as it was. It never falls back to the old wording over the editors' changes.
- Only **published** changes go live. Drafts stay in the Studio.

## One-time setup (about 15 minutes)

### 1. Create the Sanity project

1. Sign in at [sanity.io/manage](https://www.sanity.io/manage) and create a project, for example "Victoria's Wellness". The free plan is enough.
2. Keep the dataset called `production`, and leave it **public** (the content is the public website anyway).
3. Copy the **Project ID**.

### 2. Add the project ID

Copy `.env.example` to `.env` and `studio/.env.example` to `studio/.env`, then fill in:

```
# .env
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production

# studio/.env
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

### 3. Load the current content into Sanity

In sanity.io/manage → your project → **API → Tokens**, add a token with **Editor** permissions and put it in `.env` as `SANITY_WRITE_TOKEN`. Then:

```bash
npm run cms:seed
```

This uploads the photos and the film and creates the Home page, Site settings, Privacy policy and Terms of use documents. It never overwrites documents that already exist. Once it's done, **delete the token** in sanity.io/manage and remove it from `.env`.

### 4. Open the Studio

```bash
cd studio && npm install && cd ..
npm run studio          # opens http://localhost:3333
```

The first time, Sanity asks you to sign in. If it says the address isn't allowed, add it in sanity.io/manage → **API → CORS origins**: `http://localhost:3333`, with "Allow credentials" ticked.

To give the team an online Studio (no install needed for editors):

```bash
npm run studio:deploy   # publishes it at https://victorias-wellness.sanity.studio
```

Invite editors in sanity.io/manage → **Members**.

### 5. Rebuild the site when content is published

On your host, set these environment variables for the build: `SITE_URL`, `SANITY_PROJECT_ID` and `SANITY_DATASET`. The build command stays `npm run build` and the output folder `dist`.

Then make publishing trigger a rebuild:

1. On the host, create a **deploy hook** (build hook): Netlify → Site configuration → Build hooks; Vercel → Settings → Git → Deploy Hooks; Cloudflare Pages → Settings → Builds → Deploy hooks. Copy its URL.
2. In sanity.io/manage → **API → Webhooks**, add a webhook:
   - URL: the deploy hook URL
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["homePage", "siteSettings", "legalPage"]`
   - HTTP method: POST

A published change is live in a minute or two, once the host has rebuilt.

**Upcoming outreaches** disappear by themselves once their date has passed, at the next rebuild. If nothing is published for a while, schedule a daily rebuild on the host (or call the deploy hook from a daily cron job) so past events drop off.

## Trying changes locally

```bash
npm run dev
```

With the project ID in `.env`, the local site reads Sanity on every page load. Publish in the Studio, refresh the page, and the change is there.

## For editors: where things are

| On the site | In the Studio |
|---|---|
| Any section of the home page | **Home page**, then the tab with the section's name |
| Phone, WhatsApp, email, Instagram | **Site settings → Contact details** (used everywhere on the site) |
| Menu, announcement bar, footer | **Site settings → Header, banner and footer** |
| Google title and description, sharing preview | **Site settings → Search and sharing** |
| What AI assistants say about you | **Site settings → AI answers**, and the **FAQ** tab |
| Where form answers are sent, promised reply time | **Site settings → Forms** |
| Privacy policy, Terms of use | Their own pages in the menu on the left |

Tips:

- In headings and short texts, `*single stars*` gives the highlight or italic style and `**double stars**` gives bold.
- Every photo needs a **description**. Say what is in it; it helps screen-reader users and search.
- Set the **hotspot** on a photo (the circle tool) so crops keep the important part in view.
- Changing the order of programmes, values, communities, gallery photos or FAQs: drag them in the list.
- Leaving a text or photo field empty usually hides that element on the site.
- The legal pages are hidden from search engines while **Hide from search engines** is on. Turn it off when the final text is in.
