// Hero: words rise through a mask, the bloom opens the photograph, the arc and sprig draw in.
// Calm by design: it plays once on load and nothing drifts on scroll.
import { gsap, ease, reducedMotion } from "./motion.js";

/** Wrap each word in .w > span so it can rise through a mask. Keeps <em> and spacing. */
function splitWords(root) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(" "));
          } else {
            const outer = document.createElement("span");
            outer.className = "w";
            const inner = document.createElement("span");
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(root);
  root.classList.add("is-split");
  return root.querySelectorAll(".w > span");
}

function intro(hero) {
  const title = hero.querySelector("[data-split]");
  const words = splitWords(title);
  const rise = hero.querySelectorAll("[data-rise]");
  const photo = hero.querySelector("[data-bloom]");
  const blobs = hero.querySelectorAll(".hero__blob");
  const arc = hero.querySelector(".hero__arc path");
  const stem = hero.querySelector(".sprig__stem");
  const leaves = hero.querySelectorAll(".sprig__leaf");

  gsap.set(words, { yPercent: 112 });

  const tl = gsap.timeline({ defaults: { ease: ease.gentle } });

  tl.to(words, { yPercent: 0, duration: 0.9, stagger: 0.06 }, 0)
    .fromTo(blobs, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.4, ease: ease.bloom, stagger: 0.15 }, 0.05)
    .fromTo(photo, { "--bloom": "0%" }, {
      "--bloom": "340%",
      duration: 1.4,
      ease: ease.bloom,
      onComplete: () => photo.classList.add("is-bloomed"),
    }, 0.2)
    .to(rise, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.5)
    .to(arc, { strokeDashoffset: 0, duration: 1.6 }, 0.55)
    .to(stem, { strokeDashoffset: 0, duration: 1.1 }, 0.75)
    .fromTo(leaves,
      {
        opacity: 0, scale: 0.4, rotate: -8,
        // each leaf unfurls from where it meets the stem
        transformOrigin: (i) => (i % 2 === 0 ? "100% 100%" : "0% 100%"),
      },
      { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: ease.spring, stagger: 0.12 }, 1.0);

  return tl;
}

export async function initHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero || reducedMotion) return;

  // Start once fonts are ready so words do not reflow mid-rise (never wait more than 800ms)
  await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 800))]);

  intro(hero);
}
