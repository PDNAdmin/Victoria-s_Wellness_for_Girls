// The home page's <body>, built from the content. The markup matches the hand-written page
// it replaced, so the styles and scripts in src/ work unchanged.
import { esc, inline, paras, when, linkAttrs } from "./html.js";
import { iconSvg } from "./icons.js";

const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const BTN_ARROW = '<span class="btn__arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>';
const CHECK = '<span class="form-done__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';

const motif = (name, cls) => `<svg class="motif motif--${name}${cls}" data-reveal="motif" focusable="false"><use href="#m-${name}"/></svg>`;
const linkArrow = (l, extra = "") => `<a class="link-arrow" ${linkAttrs(l.href)}${extra}>${esc(l.label)}${ARROW}</a>`;
const fmt = (n) => Number(n || 0).toLocaleString("en-GB");

export function contactLinks(s) {
  const wa = `https://wa.me/${String(s.whatsapp || "").replace(/\D/g, "")}`;
  const tel = `tel:+${String(s.phone || "").replace(/\D/g, "")}`;
  return {
    wa,
    waMsg: (msg) => (msg ? `${wa}?text=${encodeURIComponent(msg)}` : wa),
    tel,
    mail: (subject) => `mailto:${s.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`,
    instagram: s.instagram ? `https://www.instagram.com/${String(s.instagram).replace(/^@/, "")}` : "",
    handle: s.instagram ? `@${String(s.instagram).replace(/^@/, "")}` : "",
  };
}

/** Outreaches that haven't finished yet, soonest first. */
export function upcomingEvents(events = [], now = new Date()) {
  return events
    .filter((e) => e?.start && new Date(e.end || e.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start));
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" });
const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });

export function renderHome(content, media) {
  const s = content.settings;
  const h = content.home;
  const L = contactLinks(s);
  const { picture, heroPicture, lqipStyle } = media;

  /* ---------- Announcement, header ---------- */
  const a = s.announcement || {};
  const announce = a.enabled && (a.bold || a.text) ? `
  <div class="announce" data-announce>
    <div class="wrap announce__inner">
      <p><span class="announce__dot" aria-hidden="true"></span>${when(a.bold, () => `<b>${esc(a.bold)}</b> `)}${esc(a.text)}</p>
      <button class="announce__close" type="button" aria-label="Close the announcement" data-announce-close>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
  </div>` : "";

  const header = `
  <header class="site-header" data-header>
    <div class="wrap site-header__inner">
      <a class="brand" href="#top" aria-label="${esc(s.orgName)}, back to top">
        <img class="brand__mark" src="media/logo-emblem.png" width="223" height="192" alt="">
        <span class="brand__text">
          <span class="brand__name">${esc(s.shortName)}</span>
          <span class="brand__sub">${esc(s.subName)}</span>
        </span>
      </a>

      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul class="site-nav__list">
${(s.nav || []).map((n) => `          <li><a ${linkAttrs(n.href)}>${esc(n.label)}</a></li>`).join("\n")}
        </ul>
        <div class="site-nav__actions">
          <a class="btn btn-donate btn-sm" href="#donate">${esc(s.donateLabel)}</a>
          <a class="btn btn-primary btn-sm" href="#get-support">${esc(s.supportLabel)}</a>
        </div>
      </nav>

      <div class="site-header__compact">
        <a class="btn btn-primary btn-sm" href="#get-support">${esc(s.supportLabel)}</a>
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-btn>
          <span class="menu-btn__icon" aria-hidden="true"><i></i><i></i></span>
          <span class="menu-btn__label">Menu</span>
        </button>
      </div>
    </div>
  </header>`;

  /* ---------- 1 · Hero ---------- */
  const hero = h.hero || {};
  const heroHtml = `
    <section class="hero" id="top" aria-labelledby="hero-title" data-hero>
      <div class="wrap hero__grid">
        <div class="hero__copy" data-hero-copy>
          <h1 class="hero__title" id="hero-title" data-split>${inline(hero.title, { em: "hl" })}</h1>
          ${when(hero.lead, () => `<p class="hero__lead" data-rise>${esc(hero.lead)}</p>`)}
          <div class="hero__actions" data-rise>
${(hero.buttons || []).map((b) => `            <a class="btn btn-${esc(b.style || "primary")} btn-lg btn--arrow" ${linkAttrs(b.href)}>${esc(b.label)}${BTN_ARROW}</a>`).join("\n")}
          </div>
          ${when(hero.privacyNote, () => `<p class="hero__privacy" data-rise>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>
            ${esc(hero.privacyNote)}
          </p>`)}
        </div>

        <figure class="hero__media" data-hero-media>
          <div class="hero__backdrop" data-depth="back" aria-hidden="true">
            <svg class="hero__blob hero__blob--sage" viewBox="0 0 200 200"><path d="M104 8c34 2 66 22 80 54s10 72-14 98-62 36-96 28S16 152 10 116 18 40 44 22 70 6 104 8z"/></svg>
            <svg class="hero__blob hero__blob--rose" viewBox="0 0 200 200"><path d="M100 14c28 0 58 12 72 40s10 66-12 90-56 40-88 32S20 140 16 106 26 38 50 24s22-10 50-10z"/></svg>
          </div>
          <div class="hero__arc" data-depth="arc" aria-hidden="true">
            <svg viewBox="0 0 120 120"><path d="M4.85 69.72A56 56 0 0 1 112.62 40.85" pathLength="1"/></svg>
          </div>
          <div class="hero__frame"${lqipStyle(hero.image)}>
            <div class="hero__photo" data-bloom>
              ${heroPicture(hero.image, hero.mobileImage)}
            </div>
          </div>
          <div class="hero__sprig" data-depth="front" aria-hidden="true">
            <svg viewBox="0 0 220 320">
              <path class="sprig__stem" pathLength="1" d="M104 318C98 250 126 200 112 140S118 60 132 22"/>
              <path class="sprig__leaf" d="M106 252C70 248 44 222 38 186c36 2 62 26 68 66z"/>
              <path class="sprig__leaf" d="M115 204c35-8 61-38 65-76-34 6-60 34-65 76z"/>
              <path class="sprig__leaf" d="M112 152c-30-6-48-32-50-60 30 6 48 28 50 60z"/>
              <path class="sprig__leaf" d="M121 98c25-10 39-34 39-58-24 8-38 30-39 58z"/>
            </svg>
          </div>
          ${when(hero.caption, () => `<figcaption class="hero__caption" data-rise>
            <span class="hero__caption-dot" aria-hidden="true"></span>
            ${esc(hero.caption)}
          </figcaption>`)}
        </figure>
      </div>
    </section>`;

  /* ---------- 2 · About ---------- */
  const ab = h.about || {};
  const mv = (m, flip) => !m || (!m.lead && !m.image) ? "" : `
          <div class="mv${flip ? " mv--flip" : ""}">
            <div class="mv__text" data-reveal-group>
              ${when(m.label, () => `<h3 class="about__label" data-reveal="rise">${esc(m.label)}</h3>`)}
              ${when(m.lead, () => `<p class="about__lead" data-reveal="rise">${esc(m.lead)}</p>`)}
              ${when(m.more, () => `<p class="about__more" data-reveal="rise">${esc(m.more)}</p>`)}
            </div>
            ${when(m.image, () => `<figure class="mv__media">
              <div class="mv__photo" data-reveal="clip">
                ${picture(m.image, { sizes: "(min-width: 900px) 560px, calc(100vw - 40px)" })}
              </div>
              ${when(m.caption, () => `<figcaption class="caption">${esc(m.caption)}</figcaption>`)}
            </figure>`)}
          </div>`;
  const aboutHtml = `
    <section class="has-decor about" id="about" aria-labelledby="about-title">
      <div class="decor" aria-hidden="true">${motif("flower", " d-about-1")}${motif("sprig", " d-about-2")}</div>
      <div class="wrap">
        <div class="about__intro" data-reveal-group>
          <div class="about__text">
            ${when(ab.eyebrow, () => `<p class="eyebrow" data-reveal="rise">${esc(ab.eyebrow)}</p>`)}
            <h2 class="about__title" id="about-title" data-reveal="rise">${esc(ab.title)}</h2>
            ${when(ab.body, () => `<p class="about__body" data-reveal="rise">${esc(ab.body)}</p>`)}
            ${when(ab.linkLabel && ab.linkHref, () => `<a class="link-arrow" ${linkAttrs(ab.linkHref)} data-reveal="rise">${esc(ab.linkLabel)}${ARROW}</a>`)}
          </div>
          ${when(ab.image, () => `<figure class="about__media">
            <div class="about__photo" data-reveal="clip"${lqipStyle(ab.image)}>
              ${picture(ab.image, { sizes: "(min-width: 1180px) 620px, (min-width: 900px) 54vw, calc(100vw - 32px)" })}
            </div>
            ${when(ab.caption, () => `<figcaption class="about__caption" data-reveal="rise">${esc(ab.caption)}</figcaption>`)}
          </figure>`)}
        </div>

        <div class="about__pillars">${mv(ab.mission, false)}${mv(ab.vision, true)}
        </div>

        ${when(ab.symbols, () => `<ul class="about__symbols" aria-label="${esc(ab.symbolsLabel)}" data-reveal-group>
${ab.symbols.map((x) => `          <li data-reveal="draw">
            <span class="about__icon">${iconSvg(x.icon, { draw: true })}</span>
            ${esc(x.label)}
          </li>`).join("\n")}
        </ul>`)}
      </div>
    </section>`;

  /* ---------- 3 · Programmes ---------- */
  const pr = h.programmes || {};
  const statusLabel = (st) => (st === "partner" ? pr.statusPartnerLabel || "With partners" : pr.statusNowLabel || "Running now");
  const progHtml = `
    <section class="has-decor programmes" id="programmes" aria-labelledby="programmes-title">
      <div class="decor" aria-hidden="true">${motif("bud", " motif--rose d-prog-1")}</div>
      <div class="wrap programmes__grid">
        <div class="programmes__aside">
          <div class="programmes__sticky" data-reveal-group>
            <h2 class="programmes__title" id="programmes-title" data-reveal="rise">${esc(pr.title)}</h2>
            ${when(pr.intro, () => `<p class="programmes__intro" data-reveal="rise">${esc(pr.intro)}</p>`)}
            ${when(pr.image, () => `<figure class="programmes__media">
              <div class="programmes__photo" data-reveal="bloom">
                ${picture(pr.image, { sizes: "(min-width: 1180px) 460px, (min-width: 900px) 40vw, calc(100vw - 32px)" })}
              </div>
              ${when(pr.caption, () => `<figcaption class="programmes__caption" data-reveal="rise">${esc(pr.caption)}</figcaption>`)}
            </figure>`)}
          </div>
        </div>

        <div class="programmes__main">
          <ol class="prog-list" role="list">
${(pr.items || []).map((p) => `            <li class="prog${p.highlight ? " prog--girls" : ""}" data-reveal="rise">
              <span class="prog__icon">${iconSvg(p.icon)}</span>
              <div class="prog__body">
                <div class="prog__head">
                  <h3 class="prog__name">${esc(p.name)}</h3>
                  <span class="status status--${p.status === "partner" ? "partner" : "now"}">${esc(statusLabel(p.status))}</span>
                </div>
                ${when(p.text, () => `<p class="prog__text">${esc(p.text)}</p>`)}
                ${when(p.audience, () => `<p class="prog__for"><span>${esc(pr.audienceLabel || "For")}</span> ${esc(p.audience)}</p>`)}
                ${when(p.actions, () => `<div class="prog__actions">
                  ${p.actions.map((l) => linkArrow(l)).join("\n                  ")}
                </div>`)}
              </div>
            </li>`).join("\n")}
          </ol>

          ${when(pr.note, () => `<div class="programmes__note" data-reveal="rise">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.5"/></svg>
            <p>${inline(pr.note, { bold: "strong" })}</p>
          </div>`)}
        </div>
      </div>
    </section>`;

  /* ---------- 4 · Where we work ---------- */
  const wh = h.where || {};
  const whereHtml = `
    <section class="has-decor where" id="where-we-work" aria-labelledby="where-title">
      <div class="decor" aria-hidden="true">${motif("flower", " motif--sage d-where-1")}${motif("leaf", " d-where-2")}</div>
      <div class="wrap where__grid">
        <div class="where__text" data-reveal-group>
          <h2 class="where__title" id="where-title" data-reveal="rise">${esc(wh.title)}</h2>
          ${when(wh.body, () => `<p class="where__body" data-reveal="rise">${esc(wh.body)}</p>`)}
          ${when(wh.image, () => `<figure class="where__media" data-reveal="clip">
            ${picture(wh.image, { sizes: "(min-width: 900px) 440px, calc(100vw - 40px)" })}
          </figure>`)}
          ${when(wh.caption, () => `<p class="caption" data-reveal="rise">${esc(wh.caption)}</p>`)}
        </div>

        <div class="route" data-route>
          <span class="route__line" aria-hidden="true"><span class="route__fill" data-route-fill></span></span>
          <ul class="route__list" aria-label="${esc(wh.stopsLabel)}">
${(wh.stops || []).map((st) => `            <li class="route__stop" data-route-stop>${esc(st.place)}${when(st.area, () => `<span>, ${esc(st.area)}</span>`)}</li>`).join("\n")}
          </ul>
          <div class="route__next" data-route-stop>
            ${when(wh.nextLabel, () => `<p class="route__next-label">${esc(wh.nextLabel)}</p>`)}
            ${when(wh.nextButtonLabel, () => `<a class="btn btn-secondary" ${linkAttrs(wh.nextButtonHref || "#get-involved")}>${esc(wh.nextButtonLabel)}</a>`)}
          </div>
        </div>
      </div>
    </section>`;

  /* ---------- 5 · Impact ---------- */
  const im = h.impact || {};
  const stat = (x, lg) => `
          <div class="stat${lg ? " stat--lg" : ""}${x.highlight ? " stat--girls" : ""}" data-reveal="rise">
            <p class="stat__num">${when(x.prefix, () => `<small>${esc(x.prefix)}</small> `)}<span class="sr-only">${fmt(x.number)}</span><span aria-hidden="true" data-count="${Number(x.number) || 0}">${fmt(x.number)}</span></p>
            <p class="stat__label">${esc(x.label)}</p>
          </div>`;
  const asOf = im.asOf ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(im.asOf)) : "";
  const impactHtml = `
    <section class="impact dark is-panel" id="impact" aria-labelledby="impact-title">
      <div class="impact__decor" data-impact-decor aria-hidden="true">
        <svg viewBox="0 0 220 320">
          <path d="M104 318C98 250 126 200 112 140S118 60 132 22"/>
          <path d="M106 252C70 248 44 222 38 186c36 2 62 26 68 66z"/>
          <path d="M115 204c35-8 61-38 65-76-34 6-60 34-65 76z"/>
          <path d="M112 152c-30-6-48-32-50-60 30 6 48 28 50 60z"/>
          <path d="M121 98c25-10 39-34 39-58-24 8-38 30-39 58z"/>
        </svg>
      </div>

      <div class="wrap impact__inner">
        <div class="impact__head" data-reveal-group>
          ${when(im.eyebrow, () => `<p class="eyebrow eyebrow--dark" data-reveal="rise">${esc(im.eyebrow)}</p>`)}
          <h2 class="impact__title" id="impact-title" data-reveal="rise">${esc(im.title)}</h2>
          ${when(im.intro, () => `<p class="impact__intro" data-reveal="rise">${esc(im.intro)}</p>`)}
          ${when(asOf, () => `<p class="impact__asof" data-reveal="rise">Figures as of <time datetime="${esc(im.asOf)}">${asOf}</time>.</p>`)}
        </div>

        ${when(im.major, () => `<div class="impact__major" data-reveal-group>
          <span class="impact__rule" data-reveal="line" aria-hidden="true"></span>${im.major.map((x) => stat(x, true)).join("")}
        </div>`)}

        ${when(im.minor, () => `<div class="impact__minor" data-reveal-group>
          <span class="impact__rule" data-reveal="line" aria-hidden="true"></span>${im.minor.map((x) => stat(x, false)).join("")}
        </div>`)}

        ${when(im.image, () => `<figure class="impact__photo" data-reveal="clip">
          ${picture(im.image, { sizes: "(min-width: 1180px) 1100px, calc(100vw - 40px)" })}
          ${when(im.caption, () => `<figcaption>${esc(im.caption)}</figcaption>`)}
        </figure>`)}

        ${when(im.checks, () => `<div class="impact__checks" data-reveal-group>
          <span class="impact__rule" data-reveal="line" aria-hidden="true"></span>
          ${when(im.checksTitle, () => `<h3 class="impact__checks-title" data-reveal="rise">${esc(im.checksTitle)}</h3>`)}
          <ul class="checks" data-reveal="rise">
${im.checks.map((c) => `            <li>${esc(c)}</li>`).join("\n")}
          </ul>
          ${when(im.buttonLabel, () => `<div class="impact__proof" data-reveal="rise">
            <a class="btn btn-on-dark" ${linkAttrs(im.buttonHref || "#outreach")}>${esc(im.buttonLabel)}</a>
          </div>`)}
        </div>`)}
      </div>
    </section>`;

  /* ---------- 6 · Values ---------- */
  const va = h.values || {};
  const valuesHtml = `
    <section class="has-decor values is-panel" id="values" aria-labelledby="values-title">
      <div class="decor" aria-hidden="true">${motif("flower", " motif--gold d-values-1")}${motif("sprig", " d-values-2")}</div>
      <div class="wrap values__grid">
        <div class="values__head" data-reveal-group>
          ${when(va.eyebrow, () => `<p class="eyebrow" data-reveal="rise">${esc(va.eyebrow)}</p>`)}
          <h2 class="values__title" id="values-title" data-reveal="rise">${esc(va.title)}</h2>
          ${when(va.intro, () => `<p class="values__intro" data-reveal="rise">${esc(va.intro)}</p>`)}
          ${when(va.image, () => `<figure class="values__media" data-reveal="clip">
            ${picture(va.image, { sizes: "(min-width: 1000px) 340px, calc(100vw - 40px)" })}
          </figure>`)}
        </div>
        <ul class="values__list" role="list">
${(va.items || []).map((v) => `          <li class="value value--${esc(v.color || "sage")}" data-reveal="draw">
            <span class="value__icon">${iconSvg(v.icon, { draw: true })}</span>
            <h3 class="value__name">${esc(v.name)}</h3>
            <p class="value__text">${esc(v.text)}</p>
            <svg class="value__flourish" aria-hidden="true" focusable="false"><use href="#m-flower"/></svg>
          </li>`).join("\n")}
        </ul>
      </div>
    </section>`;

  /* ---------- 7 · Get Support ---------- */
  const su = h.support || {};
  const sf = su.form || {};
  const chips = (name, options, { checkedFirst = false, mark } = {}) => (options || []).map((o, i) =>
    `<label class="chip"><input type="radio" name="${name}" value="${esc(o)}"${checkedFirst && i === 0 ? " checked" : ""}${mark ? mark(o, i) : ""}><span>${esc(o)}</span></label>`).join("\n                ");
  const supportHtml = `
    <section class="support is-panel" id="get-support" aria-labelledby="support-title">
      <div class="wrap support__grid">
        <div class="support__intro" data-reveal-group>
          <h2 class="support__title" id="support-title" data-reveal="rise">${esc(su.title)}</h2>
          ${when(su.body, () => `<p class="support__body" data-reveal="rise">${esc(su.body)}</p>`)}

          <ul class="quick" aria-label="${esc(su.quickLabel)}" data-reveal="rise">
            <li>
              <a class="quick__item" href="${esc(L.waMsg(su.whatsappMessage))}" target="_blank" rel="noopener" data-whatsapp>
                <span class="quick__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 19.6l1.2-4A8 8 0 1 1 20 11.5z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.4-1.8-.9-.8.8a4 4 0 0 1-2.4-2.4l.8-.8-.9-1.8z"/></svg></span>
                <span><b>${esc(su.whatsappLabel)}</b><small>${esc(su.whatsappNote)}</small></span>
              </a>
            </li>
            <li>
              <a class="quick__item" href="${esc(L.tel)}">
                <span class="quick__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></span>
                <span><b>${esc(su.callLabel)}</b><small>${esc(s.phone)}</small></span>
              </a>
            </li>
            <li>
              <a class="quick__item" href="#support-form" data-referral>
                <span class="quick__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6v3H9z"/><path d="M15 5.5h2a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1h2"/><path d="M9.5 13.5l2 2 3.5-4"/></svg></span>
                <span><b>${esc(su.referralLabel)}</b><small>${esc(su.referralNote)}</small></span>
              </a>
            </li>
          </ul>
        </div>

        <div class="support__formwrap" data-reveal="rise">
          <form class="sform" id="support-form" novalidate data-support-form aria-labelledby="sform-title">
            <h3 class="sform__title" id="sform-title">${esc(sf.title)}</h3>
            ${when(sf.requiredNote, () => `<p class="sform__required">${esc(sf.requiredNote)}</p>`)}

            <div class="sform__row">
              <div class="field" data-field="firstName">
                <label for="sf-name">${esc(sf.nameLabel)}</label>
                <span class="help" id="sf-name-help">${esc(sf.nameHelp)}</span>
                <input id="sf-name" name="firstName" type="text" autocomplete="given-name" aria-describedby="sf-name-help sf-name-err" required>
                <span class="err" id="sf-name-err" hidden></span>
              </div>
              <div class="field" data-field="contact">
                <label for="sf-contact">${esc(sf.contactLabel)}</label>
                <span class="help" id="sf-contact-help">${esc(sf.contactHelp)}</span>
                <input id="sf-contact" name="contact" type="text" autocomplete="tel" aria-describedby="sf-contact-help sf-contact-err" required>
                <span class="err" id="sf-contact-err" hidden></span>
              </div>
            </div>

            <fieldset class="field choice" data-field="preferred">
              <legend>${esc(sf.preferredLabel)}</legend>
              <div class="choice__opts">
                <label class="chip"><input type="radio" name="preferred" value="WhatsApp" checked><span>WhatsApp</span></label>
                <label class="chip"><input type="radio" name="preferred" value="phone call"><span>Phone call</span></label>
                <label class="chip"><input type="radio" name="preferred" value="email"><span>Email</span></label>
              </div>
            </fieldset>

            <fieldset class="field choice" data-field="help" aria-describedby="sf-help-note sf-help-err">
              <legend>${esc(sf.helpLabel)}</legend>
              ${when(sf.privacyNote, () => `<span class="help note-privacy" id="sf-help-note">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z"/></svg>
                ${esc(sf.privacyNote)}
              </span>`)}
              <div class="choice__opts">
                ${chips("help", sf.helpOptions, { mark: (o) => (o === sf.referralOption ? " data-referral-option" : "") })}
              </div>
              <span class="err" id="sf-help-err" hidden></span>
            </fieldset>

            <fieldset class="field choice" data-field="age" aria-describedby="sf-age-err">
              <legend>${esc(sf.ageLabel)}</legend>
              <div class="choice__opts">
                ${chips("age", sf.ageOptions, { mark: (o, i) => (i === 0 ? " data-minor" : "") })}
              </div>
              <span class="err" id="sf-age-err" hidden></span>
            </fieldset>

            <div class="field guardian" data-field="guardian" data-guardian hidden>
              <label for="sf-guardian">${esc(sf.guardianLabel)}</label>
              <span class="help" id="sf-guardian-help">${esc(sf.guardianHelp)}</span>
              <input id="sf-guardian" name="guardian" type="text" autocomplete="off" aria-describedby="sf-guardian-help sf-guardian-err">
              <span class="err" id="sf-guardian-err" hidden></span>
            </div>

            <div class="field consent" data-field="consent">
              <label class="check">
                <input type="checkbox" name="consent" aria-describedby="sf-consent-err">
                <span>${esc(sf.consentText)} <a href="privacy.html">Read our privacy policy</a>.</span>
              </label>
              <span class="err" id="sf-consent-err" hidden></span>
            </div>

            <div class="hp" aria-hidden="true">
              <label for="sf-website">Leave this empty</label>
              <input id="sf-website" name="website" type="text" tabindex="-1" autocomplete="off">
            </div>

            <div class="sform__send">
              ${when(sf.emergency, () => `<p class="emergency" id="sf-emergency">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.2v.3"/></svg>
                <span>${inline(sf.emergency)}</span>
              </p>`)}
              <button class="btn btn-primary btn-lg" type="submit"${sf.emergency ? ' aria-describedby="sf-emergency"' : ""}>${esc(sf.submitLabel)}</button>
            </div>

            <div class="sform__status" role="status" aria-live="polite" data-form-status></div>
          </form>

          <div class="sform-done" data-support-done hidden tabindex="-1">
            <span class="sform-done__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
            <h3>${esc(sf.doneTitle)}</h3>
            <p data-done-text>${esc(sf.doneText)}</p>
            ${when(sf.doneEmergency, () => `<p class="sform-done__emergency">${esc(sf.doneEmergency)}</p>`)}
          </div>
        </div>

        ${when(su.disclaimer, () => `<aside class="disclaimer" aria-label="Health information disclaimer" data-reveal="rise">
          ${when(su.disclaimerTitle, () => `<b>${esc(su.disclaimerTitle)}</b>`)}
          <p>${esc(su.disclaimer)}</p>
        </aside>`)}
      </div>
    </section>`;

  /* ---------- 8 · Get Involved ---------- */
  const inv = h.involved || {};
  const ifm = inv.form || {};
  const involvedHtml = `
    <section class="has-decor involved" id="get-involved" aria-labelledby="involved-title">
      <div class="decor" aria-hidden="true">${motif("sprig", " d-inv-1")}${motif("flower", " motif--sage d-inv-2")}</div>
      <div class="wrap">
        <div class="involved__top" data-reveal-group>
          <div class="involved__text">
            ${when(inv.eyebrow, () => `<p class="eyebrow" data-reveal="rise">${esc(inv.eyebrow)}</p>`)}
            <h2 class="involved__title" id="involved-title" data-reveal="rise">${esc(inv.title)}</h2>
            ${when(inv.body, () => `<p class="involved__body" data-reveal="rise">${esc(inv.body)}</p>`)}
          </div>
          ${when(inv.image, () => `<figure class="involved__media">
            <div class="involved__photo" data-reveal="clip"${lqipStyle(inv.image)}>
              ${picture(inv.image, { sizes: "(min-width: 1180px) 600px, (min-width: 900px) 50vw, calc(100vw - 32px)" })}
            </div>
            ${when(inv.caption, () => `<figcaption class="caption" data-reveal="rise">${esc(inv.caption)}</figcaption>`)}
          </figure>`)}
        </div>

        ${when(inv.ways, () => `<ul class="ways" aria-label="${esc(inv.waysLabel)}" data-reveal-group>
${inv.ways.map((w) => `          <li data-reveal="draw">
            <span class="ways__icon">${iconSvg(w.icon, { draw: true })}</span>
            ${esc(w.label)}
          </li>`).join("\n")}
        </ul>`)}

        <div class="involved__bottom">
          ${when(inv.closing, () => `<p class="involved__closing" data-reveal="rise">${inline(inv.closing)}</p>`)}

          <div class="form-card" data-reveal="rise">
            <form class="vform" id="involved-form" novalidate data-form="involved" aria-labelledby="iform-title">
              <h3 class="vform__title" id="iform-title">${esc(ifm.title)}</h3>

              <div class="vform__row">
                <div class="field" data-field="name" data-rule="required" data-msg="Please tell us your name.">
                  <label for="if-name">${esc(ifm.nameLabel)}</label>
                  <input id="if-name" name="name" type="text" autocomplete="name" aria-describedby="if-name-err">
                  <span class="err" id="if-name-err" hidden></span>
                </div>
                <div class="field" data-field="contact" data-rule="contact" data-msg="That phone number or email doesn't look right. Please check it.">
                  <label for="if-contact">${esc(ifm.contactLabel)}</label>
                  <input id="if-contact" name="contact" type="text" autocomplete="email" aria-describedby="if-contact-err">
                  <span class="err" id="if-contact-err" hidden></span>
                </div>
              </div>

              <fieldset class="field choice" data-field="role" data-rule="choice" data-msg="Please choose the option that fits you best." aria-describedby="if-role-err">
                <legend>${esc(ifm.roleLabel)}</legend>
                <div class="choice__opts">
                  ${chips("role", ifm.roleOptions)}
                </div>
                <span class="err" id="if-role-err" hidden></span>
              </fieldset>

              ${when(ifm.orgRoles, () => `<div class="field" data-field="organisation" data-rule="required" data-show-when="role=${esc(ifm.orgRoles.join(","))}" data-msg="Please add the name of your organisation." hidden>
                <label for="if-org">${esc(ifm.orgLabel)}</label>
                <input id="if-org" name="organisation" type="text" autocomplete="organization" aria-describedby="if-org-err">
                <span class="err" id="if-org-err" hidden></span>
              </div>`)}

              <div class="field" data-field="message" data-rule="required" data-msg="Please tell us briefly how you would like to help.">
                <label for="if-message">${esc(ifm.messageLabel)}</label>
                <span class="help" id="if-message-help">${esc(ifm.messageHelp)}</span>
                <textarea id="if-message" name="message" rows="3" maxlength="600" aria-describedby="if-message-help if-message-err"></textarea>
                <span class="err" id="if-message-err" hidden></span>
              </div>

              <div class="field consent" data-field="consent" data-rule="checked" data-msg="Please tick the box so we can reply to you.">
                <label class="check">
                  <input type="checkbox" name="consent" aria-describedby="if-consent-err">
                  <span>${esc(ifm.consentText)} <a href="privacy.html">Read our privacy policy</a>.</span>
                </label>
                <span class="err" id="if-consent-err" hidden></span>
              </div>

              <div class="hp" aria-hidden="true"><label for="if-website">Leave this empty</label><input id="if-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>

              <div class="vform__actions">
                <button class="btn btn-primary btn-lg" type="submit">${esc(ifm.submitLabel)}</button>
                ${when(ifm.whatsappLabel, () => linkArrow({ label: ifm.whatsappLabel, href: L.waMsg(ifm.whatsappMessage) }))}
              </div>
              <div class="form-status" role="status" aria-live="polite" data-form-status></div>
            </form>
            <div class="form-done" data-form-done="involved" hidden tabindex="-1">
              ${CHECK}
              <h3>${esc(ifm.doneTitle)}</h3>
              <p>${esc(ifm.doneText)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  /* ---------- 9 · Donate ---------- */
  const dn = h.donate || {};
  const donateHtml = `
    <section class="has-decor donate is-panel" id="donate" aria-labelledby="donate-title">
      <div class="decor" aria-hidden="true">${motif("flower", " motif--gold d-donate-1")}${motif("leaf", " d-donate-2")}</div>
      <div class="wrap donate__grid">
        <div class="donate__main" data-reveal-group>
          <h2 class="donate__title" id="donate-title" data-reveal="rise">${esc(dn.title)}</h2>
          ${when(dn.body, () => `<p class="donate__body" data-reveal="rise">${esc(dn.body)}</p>`)}
          ${when(dn.howText, () => `<div class="donate__how" data-reveal="rise">
            ${when(dn.howTitle, () => `<h3>${esc(dn.howTitle)}</h3>`)}
            ${paras(dn.howText)}
          </div>`)}
          <div class="donate__actions" data-reveal="rise">
            ${when(dn.whatsappLabel, () => `<a class="btn btn-donate btn-lg btn--arrow" href="${esc(L.waMsg(dn.whatsappMessage))}" target="_blank" rel="noopener">${esc(dn.whatsappLabel)}${BTN_ARROW}</a>`)}
            ${when(dn.emailLabel && s.email, () => `<a class="btn btn-secondary btn-lg" href="${esc(L.mail(dn.emailSubject))}">${esc(dn.emailLabel)}</a>`)}
          </div>
        </div>

        <div class="donate__use" data-reveal-group>
          ${when(dn.image, () => `<figure class="donate__photo" data-reveal="clip">
            ${picture(dn.image, { sizes: "(min-width: 900px) 480px, calc(100vw - 40px)" })}
          </figure>`)}
          ${when(dn.useTitle, () => `<h3 class="donate__use-title" data-reveal="rise">${esc(dn.useTitle)}</h3>`)}
          ${when(dn.uses, () => `<ul class="gift-list">
${dn.uses.map((u) => `            <li data-reveal="rise">${esc(u)}</li>`).join("\n")}
          </ul>`)}
          ${when(dn.note, () => `<p class="donate__note" data-reveal="rise">${esc(dn.note)}</p>`)}
          ${when(dn.thanks, () => `<p class="donate__thanks" data-reveal="rise">${esc(dn.thanks)}</p>`)}
        </div>
      </div>
    </section>`;

  /* ---------- 10 · Outreach ---------- */
  const ou = h.outreach || {};
  const events = upcomingEvents(ou.events);
  const videoSrc = media.file(ou.video);
  const posterSrc = media.src(ou.poster, 1280, ou.poster?.asset ? 9 / 16 : undefined);
  const eventItem = (e) => {
    const start = new Date(e.start);
    return `<li class="event">
                <time class="event__date" datetime="${esc(e.start)}">${dateFmt.format(start)}, ${timeFmt.format(start)}</time>
                <b class="event__name">${esc(e.title)}</b>
                <span class="event__place">${esc([e.place, e.town].filter(Boolean).join(", "))}</span>
                ${when(e.description, () => `<span class="event__text">${esc(e.description)}</span>`)}
              </li>`;
  };
  const outreachHtml = `
    <section class="outreach" id="outreach" aria-labelledby="outreach-title">
      <div class="wrap">
        <div class="outreach__head" data-reveal-group>
          <h2 class="outreach__title" id="outreach-title" data-reveal="rise">${esc(ou.title)}</h2>
          ${when(ou.body, () => `<p class="outreach__body" data-reveal="rise">${esc(ou.body)}</p>`)}
        </div>

        <div class="outreach__feature">
          ${when(videoSrc, () => `<figure class="video" data-reveal="rise" data-video>
            <div class="video__frame">
              <video preload="none" playsinline controls${posterSrc ? ` poster="${esc(posterSrc)}"` : ""} width="1920" height="1080" muted data-video-el
                     aria-label="${esc(ou.videoLabel)}">
                <source src="${esc(videoSrc)}" type="video/mp4">
              </video>
              <button class="video__play" type="button" data-video-play>
                <span class="video__play-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>
                <span>${esc(ou.playLabel)}${when(ou.playNote, () => ` <small>${esc(ou.playNote)}</small>`)}</span>
              </button>
            </div>
            ${when(ou.videoCaption, () => `<figcaption class="caption">${esc(ou.videoCaption)}</figcaption>`)}
          </figure>`)}

          <div class="upcoming" data-reveal="rise">
            <h3>${esc(ou.upcomingTitle)}</h3>
            ${events.length ? `<ul class="events" role="list">
              ${events.map(eventItem).join("\n              ")}
            </ul>` : when(ou.upcomingText, () => `<p>${esc(ou.upcomingText)}</p>`)}
            <div class="upcoming__actions">
              ${when(L.instagram && ou.instagramLabel, () => `<a class="btn btn-primary" href="${esc(L.instagram)}" target="_blank" rel="noopener">${esc(ou.instagramLabel)}</a>`)}
              ${when(ou.askLabel, () => linkArrow({ label: ou.askLabel, href: "#contact" }))}
            </div>
          </div>
        </div>
      </div>
    </section>`;

  /* ---------- 10b · Gallery ---------- */
  const ga = h.gallery || {};
  const galleryItem = (g) => {
    const big = g.layout === "big" || g.layout === "wide";
    const cls = g.layout === "big" ? " g-item--big" : g.layout === "wide" ? " g-item--wide" : "";
    const cap = esc(g.caption || g.image?.alt);
    return `          <li class="g-item${cls}" data-reveal="rise">
            <button class="g-item__btn" type="button" data-caption="${cap}" aria-label="View larger: ${cap}">
              ${picture(g.image, { sizes: big ? "(min-width: 900px) 580px, 100vw" : "(min-width: 900px) 290px, 50vw", full: true, imgSizes: "(min-width: 900px) 580px, 100vw" })}
              <span class="g-item__cap" aria-hidden="true">${esc(g.caption)}</span>
            </button>
          </li>`;
  };
  const galleryHtml = `
    <section class="has-decor gallery" id="gallery" aria-labelledby="gallery-title">
      <div class="decor" aria-hidden="true">${motif("bud", " motif--rose d-gal-1")}${motif("flower", " d-gal-2")}${motif("leaf", " d-gal-3")}</div>
      <div class="wrap">
        <div class="gallery__head" data-reveal-group>
          ${when(ga.eyebrow, () => `<p class="eyebrow" data-reveal="rise">${esc(ga.eyebrow)}</p>`)}
          <h2 class="gallery__title" id="gallery-title" data-reveal="rise">${esc(ga.title)}</h2>
          ${when(ga.intro, () => `<p class="gallery__intro" data-reveal="rise">${esc(ga.intro)}</p>`)}
        </div>
        <ul class="gallery__grid" role="list" data-gallery>
${(ga.items || []).filter((g) => g.image).map(galleryItem).join("\n")}
          ${when(L.instagram && ga.instagramTitle, () => `<li class="g-item g-item--wide g-item--social" data-reveal="rise">
            <a href="${esc(L.instagram)}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/></svg>
              <span><b>${esc(ga.instagramTitle)}</b> ${esc(ga.instagramText)}</span>
            </a>
          </li>`)}
        </ul>
      </div>

      <dialog class="lightbox" aria-label="Photo viewer" data-lightbox>
        <figure class="lightbox__figure">
          <img class="lightbox__img" alt="" data-lightbox-img>
          <figcaption class="lightbox__cap"><span data-lightbox-cap></span> <small data-lightbox-count></small></figcaption>
        </figure>
        <button class="lightbox__btn lightbox__btn--prev" type="button" aria-label="Previous photo" data-lightbox-prev><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>
        <button class="lightbox__btn lightbox__btn--next" type="button" aria-label="Next photo" data-lightbox-next><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>
        <button class="lightbox__close" type="button" aria-label="Close photo viewer" data-lightbox-close><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </dialog>
    </section>`;

  /* ---------- 10c · FAQ (answers written to be quoted by search and AI answers) ---------- */
  const fq = h.faq || {};
  const faqItems = (fq.items || []).filter((q) => q.question && q.answer);
  const faqHtml = fq.enabled === false || !faqItems.length ? "" : `
    <section class="has-decor faq" id="faq" aria-labelledby="faq-title">
      <div class="decor" aria-hidden="true">${motif("sprig", " d-faq-1")}</div>
      <div class="wrap faq__grid">
        <div class="faq__head" data-reveal-group>
          ${when(fq.eyebrow, () => `<p class="eyebrow" data-reveal="rise">${esc(fq.eyebrow)}</p>`)}
          <h2 class="faq__title" id="faq-title" data-reveal="rise">${esc(fq.title)}</h2>
          ${when(fq.intro, () => `<p class="faq__intro" data-reveal="rise">${esc(fq.intro)}</p>`)}
        </div>
        <div class="faq__list" data-reveal-group>
${faqItems.map((q, i) => `          <details class="faq__item" data-reveal="rise"${i === 0 ? " open" : ""}>
            <summary><h3 class="faq__q">${esc(q.question)}</h3><span class="faq__icon" aria-hidden="true"></span></summary>
            <div class="faq__a">
              ${paras(q.answer)}
            </div>
          </details>`).join("\n")}
        </div>
      </div>
    </section>`;

  /* ---------- 11 · Newsletter ---------- */
  const nl = h.newsletter || {};
  const newsletterHtml = `
    <section class="has-decor newsletter is-panel" id="newsletter" aria-labelledby="news-title">
      <div class="decor" aria-hidden="true">${motif("flower", " d-news-1")}</div>
      <div class="wrap newsletter__inner" data-reveal-group>
        <div class="newsletter__text">
          <h2 class="newsletter__title" id="news-title" data-reveal="rise">${esc(nl.title)}</h2>
          ${when(nl.text, () => `<p data-reveal="rise">${esc(nl.text)}</p>`)}
        </div>
        <div data-reveal="rise">
          <form class="nform" novalidate data-form="newsletter" aria-labelledby="news-title">
            <div class="nform__row">
              <div class="field" data-field="email" data-rule="email" data-msg="That email doesn't look right.">
                <label for="nf-email">${esc(nl.emailLabel)}</label>
                <input id="nf-email" name="email" type="email" autocomplete="email" aria-describedby="nf-email-err">
                <span class="err" id="nf-email-err" hidden></span>
              </div>
              <button class="btn btn-primary btn-lg" type="submit">${esc(nl.submitLabel)}</button>
            </div>
            <div class="field consent" data-field="consent" data-rule="checked" data-msg="Please tick the box to subscribe.">
              <label class="check">
                <input type="checkbox" name="consent" aria-describedby="nf-consent-err">
                <span>${esc(nl.consentText)}</span>
              </label>
              <span class="err" id="nf-consent-err" hidden></span>
            </div>
            <div class="hp" aria-hidden="true"><label for="nf-website">Leave this empty</label><input id="nf-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
            <div class="form-status" role="status" aria-live="polite" data-form-status></div>
          </form>
          <div class="form-done form-done--inline" data-form-done="newsletter" hidden tabindex="-1">
            ${CHECK}
            <p><b>${esc(nl.doneText)}</b></p>
          </div>
        </div>
      </div>
    </section>`;

  /* ---------- 12 · Contact ---------- */
  const co = h.contact || {};
  const cf = co.form || {};
  const contactHtml = `
    <section class="has-decor contact" id="contact" aria-labelledby="contact-title">
      <div class="decor" aria-hidden="true">${motif("bud", " motif--rose d-contact-1")}${motif("leaf", " d-contact-2")}</div>
      <div class="wrap contact__grid">
        <div class="contact__intro" data-reveal-group>
          <h2 class="contact__title" id="contact-title" data-reveal="rise">${esc(co.title)}</h2>
          ${when(co.body, () => `<p class="contact__body" data-reveal="rise">${esc(co.body)}</p>`)}

          <ul class="lines" aria-label="Reach us directly" data-reveal="rise">
            ${when(s.phone, () => `<li>
              <span class="lines__label">WhatsApp and calls</span>
              <a href="${esc(L.wa)}" target="_blank" rel="noopener">WhatsApp ${esc(s.phone)}</a>
              <a href="${esc(L.tel)}">Call ${esc(s.phone)}</a>
            </li>`)}
            ${when(s.email, () => `<li>
              <span class="lines__label">Email</span>
              <a href="${esc(L.mail())}">${esc(s.email)}</a>
            </li>`)}
            ${when(L.instagram, () => `<li>
              <span class="lines__label">Instagram</span>
              <a href="${esc(L.instagram)}" target="_blank" rel="noopener">${esc(L.handle)}</a>
            </li>`)}
          </ul>
        </div>

        <div class="form-card" data-reveal="rise">
          <form class="vform" id="contact-form" novalidate data-form="contact" aria-labelledby="cform-title">
            <h3 class="vform__title" id="cform-title">${esc(cf.title)}</h3>
            <div class="vform__row">
              <div class="field" data-field="name" data-rule="required" data-msg="Please tell us your name.">
                <label for="cf-name">${esc(cf.nameLabel)}</label>
                <input id="cf-name" name="name" type="text" autocomplete="name" aria-describedby="cf-name-err">
                <span class="err" id="cf-name-err" hidden></span>
              </div>
              <div class="field" data-field="contact" data-rule="contact" data-msg="That phone number or email doesn't look right. Please check it.">
                <label for="cf-contact">${esc(cf.contactLabel)}</label>
                <input id="cf-contact" name="contact" type="text" autocomplete="email" aria-describedby="cf-contact-err">
                <span class="err" id="cf-contact-err" hidden></span>
              </div>
            </div>
            <div class="field" data-field="message" data-rule="required" data-msg="Please write your message.">
              <label for="cf-message">${esc(cf.messageLabel)}</label>
              <textarea id="cf-message" name="message" rows="4" maxlength="1500" aria-describedby="cf-message-err"></textarea>
              <span class="err" id="cf-message-err" hidden></span>
            </div>
            <fieldset class="field choice" data-field="reply">
              <legend>${esc(cf.replyLabel)}</legend>
              <div class="choice__opts">
                <label class="chip"><input type="radio" name="reply" value="email" checked><span>Email</span></label>
                <label class="chip"><input type="radio" name="reply" value="WhatsApp"><span>WhatsApp</span></label>
                <label class="chip"><input type="radio" name="reply" value="phone"><span>Phone</span></label>
              </div>
            </fieldset>
            <div class="field consent" data-field="consent" data-rule="checked" data-msg="Please tick the box so we can reply to you.">
              <label class="check">
                <input type="checkbox" name="consent" aria-describedby="cf-consent-err">
                <span>${esc(cf.consentText)} <a href="privacy.html">Read our privacy policy</a>.</span>
              </label>
              <span class="err" id="cf-consent-err" hidden></span>
            </div>
            <div class="hp" aria-hidden="true"><label for="cf-website">Leave this empty</label><input id="cf-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
            <div class="vform__actions">
              <button class="btn btn-primary btn-lg" type="submit">${esc(cf.submitLabel)}</button>
            </div>
            <div class="form-status" role="status" aria-live="polite" data-form-status></div>
          </form>
          <div class="form-done" data-form-done="contact" hidden tabindex="-1">
            ${CHECK}
            <h3>${esc(cf.doneTitle)}</h3>
            <p>${esc(cf.doneText)}</p>
          </div>
        </div>
      </div>
    </section>`;

  /* ---------- Footer ---------- */
  const ft = s.footer || {};
  const footer = `
  <footer class="site-footer dark" id="site-footer">
    <div class="wrap">
      <div class="site-footer__top">
        <a class="site-footer__brand" href="#top" aria-label="${esc(s.orgName)}, back to top">
          <span class="site-footer__mark"><img src="media/logo-emblem.png" width="223" height="192" alt=""></span>
          <span class="site-footer__name">${esc(s.orgName)}</span>
        </a>
        ${when(ft.mission, () => `<p class="site-footer__mission">${esc(ft.mission)}</p>`)}
      </div>
      <div class="site-footer__bottom">
        <nav aria-label="Footer">
          <ul class="site-footer__links">
            <li><a href="privacy.html">${esc(content.privacy?.title || "Privacy policy")}</a></li>
            <li><a href="terms.html">${esc(content.terms?.title || "Terms of use")}</a></li>
            <li><a href="#top">Back to top</a></li>
          </ul>
        </nav>
        <p class="site-footer__copy">${esc(ft.copyright)}${when(ft.registration, () => `<br>${esc(ft.registration)}`)}</p>
      </div>
    </div>
  </footer>`;

  return `${announce}
${header}

  <main id="main">${heroHtml}
${aboutHtml}
${progHtml}
${whereHtml}
${impactHtml}
${valuesHtml}
${supportHtml}
${involvedHtml}
${donateHtml}
${outreachHtml}
${galleryHtml}
${faqHtml}
${newsletterHtml}
${contactHtml}
  </main>
${footer}

  <a class="sticky-support btn btn-primary" href="#get-support" data-sticky-support>${esc(s.supportLabel)}</a>`;
}

