// Gallery viewer: tap a photo to see it full screen. Previous and next by button, arrow keys
// or swipe; Escape or the close button returns focus to the photo you opened.
import { getLenis } from "./motion.js";

export function initGallery() {
  const grid = document.querySelector("[data-gallery]");
  const box = document.querySelector("[data-lightbox]");
  if (!grid || !box || typeof box.showModal !== "function") return; // no <dialog>: photos stay as they are

  const items = [...grid.querySelectorAll(".g-item__btn")];
  // The largest file is listed in each photo's own srcset (so the build copies it); never downloaded for thumbnails
  const fullOf = (item) => {
    const img = item.querySelector("img");
    const entries = (img.getAttribute("srcset") || "").split(",").map((s) => s.trim().split(/\s+/));
    const best = entries.sort((x, y) => parseInt(y[1]) - parseInt(x[1]))[0];
    return best?.[0] || img.currentSrc || img.src;
  };
  const img = box.querySelector("[data-lightbox-img]");
  const cap = box.querySelector("[data-lightbox-cap]");
  const count = box.querySelector("[data-lightbox-count]");
  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    img.src = fullOf(item);
    img.alt = item.querySelector("img")?.alt || "";
    cap.textContent = item.dataset.caption;
    count.textContent = `${index + 1} of ${items.length}`;
    // Warm the neighbours so next and previous feel instant
    [index + 1, index - 1].forEach((n) => { new Image().src = fullOf(items[(n + items.length) % items.length]); });
  };

  const open = (i, trigger) => {
    opener = trigger;
    show(i);
    box.showModal();
    getLenis()?.stop();
  };

  items.forEach((item, i) => item.addEventListener("click", () => open(i, item)));
  box.querySelector("[data-lightbox-prev]").addEventListener("click", () => show(index - 1));
  box.querySelector("[data-lightbox-next]").addEventListener("click", () => show(index + 1));
  box.querySelector("[data-lightbox-close]").addEventListener("click", () => box.close());

  box.addEventListener("close", () => {
    getLenis()?.start();
    opener?.focus();
  });
  // Clicking the dark backdrop closes it
  box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
  });

  // Swipe on touch screens
  let startX = null;
  box.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") startX = e.clientX; });
  box.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });
}
