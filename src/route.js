// Where we work: a route through the communities.
// The rail is measured to run from the first dot to the "your community" circle.
// With motion, the filled part follows a fixed line on screen (65% down), and each
// stop fills in as the line reaches it. Scrolling back up reverses it.
import { gsap, ScrollTrigger, reducedMotion } from "./motion.js";

const LINE = 0.65; // where on screen the route "arrives", as a fraction of the height

export function initRoute() {
  const route = document.querySelector("[data-route]");
  if (!route) return;
  const fill = route.querySelector("[data-route-fill]");
  const stops = [...route.querySelectorAll("[data-route-stop]")];
  const next = route.querySelector(".route__next");

  // Centre of each dot, in px from the top of .route
  const dotY = (el) => {
    if (el === next) {
      const dot = parseFloat(getComputedStyle(route).getPropertyValue("--dot")) || 18;
      return el.offsetTop + parseFloat(getComputedStyle(el).paddingTop) + (dot + 8) / 2;
    }
    const cs = getComputedStyle(el);
    return el.offsetTop + parseFloat(cs.paddingTop) + 0.62 * parseFloat(cs.fontSize);
  };

  const measure = () => {
    const top = dotY(stops[0]);
    const end = dotY(next);
    route.style.setProperty("--rail-top", `${top}px`);
    route.style.setProperty("--rail-h", `${end - top}px`);
    return { top, end };
  };
  measure();
  window.addEventListener("resize", measure);
  document.fonts?.ready.then(() => { measure(); ScrollTrigger.refresh(); });

  if (reducedMotion) return;

  ScrollTrigger.addEventListener("refreshInit", measure);

  gsap.fromTo(fill, { scaleY: 0 }, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: route,
      start: () => `top+=${dotY(stops[0])} ${LINE * 100}%`,
      end: () => `top+=${dotY(next)} ${LINE * 100}%`,
      scrub: 0.4,
      invalidateOnRefresh: true,
    },
  });

  stops.forEach((stop) => {
    ScrollTrigger.create({
      trigger: route,
      start: () => `top+=${dotY(stop)} ${LINE * 100}%`,
      onEnter: () => stop.classList.add("is-reached"),
      onLeaveBack: () => stop.classList.remove("is-reached"),
      invalidateOnRefresh: true,
    });
  });
}
