// Impact: figures count up once when they come into view (design system: 1400ms, standard curve).
// The HTML already holds the final figures, so without JS or with reduced motion they simply show.
// Screen readers read a hidden copy of the final figure, never the moving one.
import { gsap, ScrollTrigger, ease, reducedMotion } from "./motion.js";

const format = (n) => Math.round(n).toLocaleString("en-GB");

export function initImpact() {
  const section = document.getElementById("impact");
  if (!section || reducedMotion) return;

  section.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const counter = { value: 0 };
    el.textContent = "0";
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          value: target,
          duration: 1.4,
          delay: 0.15,
          ease: ease.standard,
          onUpdate: () => { el.textContent = format(counter.value); },
          onComplete: () => { el.textContent = format(target); },
        }),
    });
  });

}
