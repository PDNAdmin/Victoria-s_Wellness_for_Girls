// Launch announcement bar: closes on request and stays closed on later visits (this browser only).
const KEY = "vw-announce-closed";

export function initAnnouncement() {
  const bar = document.querySelector("[data-announce]");
  if (!bar) return;
  try { if (localStorage.getItem(KEY) === "1") bar.remove(); } catch { /* storage blocked: just show it */ }
  bar.querySelector("[data-announce-close]")?.addEventListener("click", () => {
    bar.remove();
    try { localStorage.setItem(KEY, "1"); } catch { /* fine */ }
  });
}
