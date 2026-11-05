// Scroll reveals for every section below the hero. Each runs once.
//
// Mark elements with data-reveal="rise | clip | line | draw".
// Wrap related elements in [data-reveal-group] and they play together, in reading order,
// when the group comes into view.
//   rise  fade and rise 20px (design system: section content)
//   clip  a photo is uncovered from the bottom up; the photo itself never moves
//   line  a hairline draws from left to right
//   draw  line icons draw themselves, then settle
//   bloom the design system's organic reveal of a photo (hero and Programmes only)
import { gsap, ScrollTrigger, ease, reducedMotion } from "./motion.js";

const STEP = 0.09; // seconds between items in a group

function tweenFor(el) {
  switch (el.dataset.reveal) {
    case "clip": {
      const r = getComputedStyle(el).borderTopLeftRadius;
      return gsap.fromTo(el,
        { clipPath: `inset(100% 0% 0% 0% round ${r})` },
        {
          clipPath: `inset(0% 0% 0% 0% round ${r})`, duration: 1.2, ease: ease.bloom,
          // Set "none" inline rather than clearing: clearing would let the hidden CSS start state return
          onComplete: () => { el.style.clipPath = "none"; },
        });
    }
    case "bloom":
      return gsap.fromTo(el, { "--bloom": "0%" }, {
        "--bloom": "340%", duration: 1.4, ease: ease.bloom,
        onComplete: () => el.classList.add("is-bloomed"),
      });
    case "motif":
      // Botanical motif: outline draws itself, then the petals and leaves fill in
      return gsap.timeline()
        .to(el, { strokeDashoffset: 0, duration: 1.6, ease: ease.gentle })
        .to(el, { fillOpacity: 1, duration: 0.8, ease: ease.standard }, 0.9);
    case "line":
      return gsap.to(el, { scaleX: 1, duration: 1.1, ease: ease.gentle });
    case "draw": {
      const strokes = el.querySelectorAll("path, circle");
      return gsap.timeline()
        .to(el, { opacity: 1, duration: 0.4, ease: ease.standard })
        .to(strokes, { strokeDashoffset: 0, duration: 0.9, ease: ease.gentle, stagger: 0.08 }, 0);
    }
    default:
      return gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: ease.gentle });
  }
}

export function initReveals() {
  if (reducedMotion) return;

  const grouped = new Set();

  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    const items = [...group.querySelectorAll("[data-reveal]")].filter((el) => el.closest("[data-reveal-group]") === group);
    items.forEach((el) => grouped.add(el));
    const tl = gsap.timeline({ paused: true });
    items.forEach((el, i) => tl.add(tweenFor(el), i * STEP));
    ScrollTrigger.create({ trigger: group, start: "top 82%", once: true, onEnter: () => tl.play() });
  });

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    if (grouped.has(el)) return;
    const tween = tweenFor(el).pause();
    ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => tween.play() });
  });
}
