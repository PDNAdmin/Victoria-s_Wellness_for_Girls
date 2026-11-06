import { startSmoothScroll, getLenis, reducedMotion, ScrollTrigger } from "./motion.js";
import { initHero } from "./hero.js";
import { initReveals } from "./reveal.js";
import { initRoute } from "./route.js";
import { initImpact } from "./impact.js";
import { initSupportForm } from "./support-form.js";
import { initForms } from "./forms.js";
import { initMediaUI } from "./media-ui.js";
import { initGallery } from "./gallery.js";
import { initAnnouncement } from "./announcement.js";

// Scripts are running: cancel the "show everything" fallback from index.html
clearTimeout(window.__motionFallback);

const header = document.querySelector("[data-header]");
const nav = document.getElementById("site-nav");
const menuBtn = document.querySelector("[data-menu-btn]");

/* ---------- Header: hairline once scrolled ---------- */
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.querySelector(".menu-btn__label").textContent = open ? "Close" : "Menu";
  const lenis = getLenis();
  if (lenis) open ? lenis.stop() : lenis.start();
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) {
    setMenu(false);
    menuBtn.focus();
  }
});
window.matchMedia("(min-width: 1100px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

/* ---------- In-page links: smooth, offset for the header, focus moves too ---------- */
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute("href").slice(1);
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  e.preventDefault();
  if (nav.classList.contains("is-open")) setMenu(false);

  const offset = -(header.offsetHeight + 8);
  const lenis = getLenis();
  if (id === "top") {
    lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  } else if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.2 });
  } else {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reducedMotion ? "auto" : "smooth" });
  }
  // Move keyboard and screen reader focus to the section
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
});

/* ---------- Sticky Get Support: after the hero, never over the form ---------- */
const sticky = document.querySelector("[data-sticky-support]");
// Appears as soon as the hero's own buttons have scrolled above the screen
const heroActions = document.querySelector(".hero__actions");
const supportSection = document.getElementById("get-support");
if (sticky && heroActions && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    sticky.classList.toggle("is-visible", past);
  }).observe(heroActions);
  if (supportSection) {
    new IntersectionObserver(([entry]) => {
      sticky.classList.toggle("is-hidden-near-form", entry.isIntersecting);
    }, { rootMargin: "0px 0px -30% 0px" }).observe(supportSection);
  }
}

/* ---------- FAQ: opening an answer changes the page height, so re-measure scroll effects ---------- */
document.addEventListener("toggle", (e) => {
  if (e.target.matches?.(".faq__item")) ScrollTrigger.refresh();
}, true);

/* ---------- Forms and media first: they must work even if an animation fails ---------- */
initSupportForm();
initForms();
initMediaUI();
initGallery();
initAnnouncement();

/* ---------- Motion ---------- */
startSmoothScroll();
initReveals();
initRoute();
initImpact();
initHero()
  .catch(() => document.documentElement.classList.remove("motion"))
  .finally(() => {
    // Re-measure every scroll trigger in page order once fonts and the hero have settled
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
