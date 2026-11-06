# SEO and AEO: keyword research and setup

Researched 5 November 2026, looking at the last 6–12 months.

## How the research was done, and its limits

- **Google Trends:** it blocks automated requests, so its raw data could not be pulled. The trend signals below come from published reports based on Google Trends for Nigeria, Google's own Nigeria search summaries for 2026, and 2026 news coverage.
- **Reddit:** searches found almost no Nigerian discussion of these topics. **LinkedIn:** results were mostly news about the posts rather than the posts.
- **No search volumes:** treat this as a list of *directions*, not measured numbers. To confirm them, open the Google Trends links at the end and check the **Rising** tab.

## What is trending

| Topic | Signal (last 6–12 months) | Key phrases to target |
|---|---|---|
| **Menstrual health and period poverty** | Strongest topic. The federal government's 2026 push for **pad banks** and **period-friendly schools**. Widely reported that girls miss school for lack of pads. Menstrual Hygiene Day 2026 (28 May) theme: **#PeriodFriendlyWorld**. | period poverty in Nigeria, menstrual hygiene, menstrual health education, sanitary pads for girls, period-friendly schools, pad bank, menstrual dignity |
| **Cervical cancer and the HPV vaccine** | National HPV vaccination of girls aged 9–14: around 12 million vaccinated by Dec 2025, target 16 million by 2026. Cervical cancer is the 2nd biggest cancer killer of women aged 15–44 in Nigeria. | cervical cancer screening, pap smear, HPV vaccine for girls, cervical cancer awareness, women's health screening |
| **Preventive wellness and self-care** | Google Nigeria, Jan 2026: "how to eat healthy" and "how to meditate" each up about 40%, and "becoming better" searches up 40%. Women-focused self-care searches up about 600% globally. Speakers at International Women's Day 2026 events called for "preventive wellness". | women's wellness, preventive health, self-care for women, healthy living tips |
| **Mental and emotional wellbeing** | Rising stress and burnout among women. The government says mental health is under-discussed. | mental health support for women, emotional wellbeing, stress and anxiety help |
| **Sexual and reproductive health** | Google Trends Nigeria: growing searches for pregnancy tests and the morning-after pill (e.g. "postinor 2 usage" +100%). | reproductive health education, adolescent health, sex education for girls (education content only, if the client approves) |
| **Girls' rights and teen pregnancy** | A recurring LinkedIn and news theme: teenage pregnancy, child marriage, girl-child education. | girl child empowerment, adolescent girls' health, teen pregnancy prevention |
| **Taking action (people ready to act)** | Volunteer-board and NGO-directory listings (Idealist, Jobberman, GlobalGiving) rank for these phrases. | NGO in Lagos, women's health NGO in Nigeria, NGOs for girls in Nigeria, volunteer opportunities in Nigeria, donate to an NGO in Nigeria, free health outreach Lagos / Ile-Ife |

**Recurring LinkedIn themes:** menstrual dignity, preventive wellness, rural cancer awareness outreaches, and women's leadership in health.

## What is set up on the site

All of this is built from the content in Sanity (code: `cms/seo.js`), so editors change it in the Studio under **Site settings → Search and sharing** and **AI answers**. See [CMS.md](CMS.md).

- **Title:** "Victoria's Wellness | Women's and Girls' Health NGO, Nigeria".
- **Description:** includes menstrual health, outreaches, screening, Lagos/Ogun/Osun, and get help/volunteer/donate.
- **Social previews:** Open Graph and Twitter/X cards, with a 1200×630 preview image (`public/og-image.jpg`, or the one chosen in the Studio).
- **Structured data (schema.org):**
  - **NGO:** names (including VWIG and vwigcare), summary, areas served (Lagos, Ogun and Osun states, Nigeria), topics, contact details and Instagram.
  - **Services:** each programme, with who it is for.
  - **WebSite** and **WebPage**, with the date the content last changed.
  - **FAQPage:** the questions and answers from the FAQ section.
  - **Event:** each upcoming outreach entered in the Studio, with date and place.
- **Generated at build time:** a canonical address, `robots.txt`, `sitemap.xml` (with real last-changed dates) and `llms.txt`.
- **Privacy and Terms pages:** marked *noindex* while **Hide from search engines** is on in the Studio. They join the sitemap when it is turned off.
- **Already in place:** the page uses the right words in headings and photo descriptions (menstrual health kits, cervical screening, malaria, Lagos/Ogun/Osun).

## AEO: being the answer in AI search

Answer engine optimisation (AEO) is about being quoted when people ask ChatGPT, Perplexity, Google AI Overviews, Copilot or Siri a question, not only about ranking in a list of links. These tools favour pages that state facts plainly, answer questions directly, are easy to fetch, and agree with what other sites say.

What is set up:

- **FAQ section** (new, `#faq`): eight questions written the way people ask them, each answered in the first sentence. Marked up as FAQPage data. **The draft answers only use facts already on the site, but the client should check them** (Studio → Home page → FAQ).
- **`llms.txt`** at the site root: a plain-text summary of the organisation, programmes, places, figures, health checks, how to get help, FAQs and contacts, for AI assistants (format: [llmstxt.org](https://llmstxt.org)). It is linked from the page head.
- **AI crawlers named in `robots.txt`:** AI search and answer tools (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User, Applebot, DuckAssistBot) are always allowed, so the site can be cited. Training-only crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot and others) are allowed by default; one switch in the Studio blocks them.
- **A quotable summary** (Studio → Site settings → AI answers) used in structured data and `llms.txt`.
- **Dated figures:** an optional "Figures as of" date in the Impact section, shown on the page and in `llms.txt`. AI tools trust dated numbers more. **Fill it in** once the client confirms the figures.
- **Everything is in the HTML:** the content is written into the page at build time, so tools that don't run JavaScript still read all of it.
- **Speakable markup** pointing voice assistants at the hero and the FAQ.

What helps most from here (needs the client):

1. **Fill in the "as of" date** and the **year founded** (Studio → Site settings → AI answers).
2. **Keep the FAQ growing.** Add questions people ask on WhatsApp and at outreaches, e.g. "How can my school get sanitary pads?", "Is the outreach free?", "Where is the next outreach?". Only state what is true.
3. **Add each outreach** under Outreach and events before it happens. It shows on the site and goes out as event data.
4. **Be consistent everywhere.** Use the same name, description, phone and email on Instagram, LinkedIn, Google Business Profile and NGO directories. AI tools cross-check sources.
5. **Get mentioned.** News stories, partner websites and directory listings (GlobalGiving, Idealist, Nigerian NGO directories) are what AI tools cite alongside the site.
6. **Check what AI tools say.** Every month or two, ask ChatGPT, Perplexity and Google "What is Victoria's Wellness Initiative for Women and Girls?" and "NGOs for girls' menstrual health in Lagos", and note whether the site is cited.

### Setting the web address (required before launch)

```bash
SITE_URL=https://your-domain.org npm run build          # Git Bash / macOS / Linux
$env:SITE_URL="https://your-domain.org"; npm run build  # PowerShell
```

Put it in `.env` (`SITE_URL=https://your-domain.org`) or set it on the host. Without it, the build still works but leaves out the canonical link, sitemap and full preview-image address, and prints a warning.

## Next steps (need the client or the live domain)

1. **Google Search Console and Bing Webmaster Tools:** verify the domain and submit `sitemap.xml`. Bing matters for AEO: ChatGPT search and Copilot use its index.
2. **Google Business Profile** for the organisation. This is the biggest win for "NGO near me" and "NGO in Lagos" searches.
3. **Get listed** on GlobalGiving, Idealist and Jobberman volunteer listings, and on Nigerian NGO directories. These rank for the action phrases and link back to the site.
4. **News or stories page:** one short post per outreach, named by place and topic. For example: "Menstrual health outreach for schoolgirls in Epe, Lagos".
5. **Post around awareness days**, using the matching hashtags on Instagram and LinkedIn:
   - January: Cervical Cancer Awareness Month
   - 25 April: World Malaria Day
   - 28 May: Menstrual Hygiene Day (#PeriodFriendlyWorld, #MHDay)
   - 10 October: World Mental Health Day
   - 11 October: International Day of the Girl
6. **Optional copy suggestion for the client to approve:** Programmes intro: "…including menstrual health, cervical screening and malaria prevention." (The FAQ suggested here before is now on the site.)

## Check these in Google Trends (Nigeria, past 12 months)

- [period poverty vs sanitary pad vs menstrual hygiene](https://trends.google.com/trends/explore?geo=NG&date=today%2012-m&q=period%20poverty,sanitary%20pad,menstrual%20hygiene)
- [cervical cancer vs HPV vaccine vs pap smear](https://trends.google.com/trends/explore?geo=NG&date=today%2012-m&q=cervical%20cancer,HPV%20vaccine,pap%20smear)
- [NGO vs volunteer vs donate](https://trends.google.com/trends/explore?geo=NG&date=today%2012-m&q=NGO,volunteer,donate)
- [women's health vs mental health vs self care](https://trends.google.com/trends/explore?geo=NG&date=today%2012-m&q=women%27s%20health,mental%20health,self%20care)

## Sources

- [Federal Ministry of Information: pad banks and period-friendly schools](https://fmino.gov.ng/fg-champions-menstrual-dignity-launches-stronger-push-for-pad-banks-and-period-friendly-schools/)
- [AllAfrica: thousands of Nigerian girls missing school over period poverty (June 2026)](https://allafrica.com/stories/202606050178.html)
- [Nigeria Health Watch: why Nigeria must fund a period-friendly future](https://nigeriahealthwatch.com/articles/thought-leadership/beyond-awareness-why-nigeria-must-fund-a-period-friendly-future/)
- [Gazette Nigeria: period poverty forces girls to use rags](https://gazettengr.com/special-how-period-poverty-forces-nigerian-girls-women-to-use-rags-cloths-during-menstruation/)
- [Malawi WASH-Ed: #PeriodFriendlyWorld, Menstrual Hygiene Day 2026](https://washted.mubas.ac.mw/together-for-a-periodfriendlyworld-breaking-the-silence-on-menstrual-hygiene/)
- [AllAfrica: 12 million girls have received the HPV vaccine](https://allafrica.com/stories/202512220092.html)
- [ThisDay: 16m girls to be vaccinated against HPV by 2026](https://www.thisdaylive.com/2025/07/24/16m-girls-to-be-vaccinated-against-hpv-by-2026-says-fg)
- [Techpoint: Nigerians' top Google searches, January 2026](https://techpoint.africa/news/nigeria-google-search-january-2026/)
- [TechEconomy: 40% spike in "becoming better" searches](https://techeconomy.ng/nigeria-records-40-spike-in-becoming-better-searches-google-trends-shows/)
- [BrandIconImage: Nigeria's search trends and fitness habits (Sept 2026)](https://www.brandiconimage.com/2026/09/what-nigerias-search-trends-reveal.html)
- [MoreBranches: what Nigerians are asking Google about sex (Google Trends, 12 months to Oct 2026)](https://www.morebranches.com/what-nigerians-are-asking-google-about-sex/)
- [HT World: surging women's health and wellness trends](https://www.htworld.co.uk/?p=39472)
- [AllAfrica: presidency and women's health partnership](https://allafrica.com/stories/202602100600.html)
- [AllAfrica: Favour Abatang and Nigeria's teenage mothers](https://allafrica.com/stories/202604060271.html)
- [OncoDaily: Zainab Shinkafi-Bagudu on women's health (LinkedIn activity)](https://oncodaily.com/blog/zainab-shinkafi-bagudu260379)
- [BrandTimes: wellness at WOHAN IWD 2026](https://www.brandtimes.com.ng/?p=35877)
- [Idealist: She Empowers Women & Girls Initiative volunteer listing](https://www.idealist.org/en/volunteer-opportunity/9c75c55e87334bc3911648a983a14193-volunteer-opportunity-for-she-empowers-women-girls-initiative-she-empowers-women-girls-initiative-bauchi)
