// Sticky columns that are taller than the screen (common on 1366x768 laptops) would hide their
// bottom part for as long as they stick. For those, stick by the bottom edge instead: the column
// scrolls with the page until its last line is in view, then holds there.
const SELECTOR = ".programmes__sticky, .values__head, .support__intro, .faq__head, .involved__closing";
const BOTTOM_GAP = 24;

export function initStickyFit() {
  const els = [...document.querySelectorAll(SELECTOR)];
  if (!els.length) return;

  const fit = () => {
    for (const el of els) {
      el.style.top = "";
      const cs = getComputedStyle(el);
      if (cs.position !== "sticky") continue;
      const room = window.innerHeight - el.offsetHeight - BOTTOM_GAP;
      if (room < parseFloat(cs.top)) el.style.top = `${Math.round(room)}px`;
    }
  };

  let frame = 0;
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(fit); };
  window.addEventListener("resize", schedule, { passive: true });
  // Photos and fonts loading can change a column's height
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(schedule);
    els.forEach((el) => ro.observe(el));
  }
  fit();
}
