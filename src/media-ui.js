// Outreach: the click-to-play video and the sideways photo rail.

/** Video: nothing downloads until someone presses play; then the native controls take over. */
function initVideo() {
  document.querySelectorAll("[data-video]").forEach((fig) => {
    const video = fig.querySelector("[data-video-el]");
    const play = fig.querySelector("[data-video-play]");
    if (!video || !play) return;
    // The custom button replaces the native controls until playback starts
    video.controls = false;
    play.addEventListener("click", () => {
      fig.classList.add("is-playing");
      video.controls = true;
      video.play().catch(() => {}); // if the browser refuses, the controls are still there
      video.focus();
    });
    video.addEventListener("play", () => fig.classList.add("is-playing"));
  });
}

/** Rail: native sideways scrolling; the buttons move one photo at a time. */
function initRail() {
  document.querySelectorAll("[data-rail]").forEach((rail) => {
    const track = rail.querySelector("[data-rail-track]");
    const prev = rail.querySelector("[data-rail-prev]");
    const next = rail.querySelector("[data-rail-next]");
    const step = () => {
      const item = track.querySelector(".rail__item");
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return item ? item.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    };
    const update = () => {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });
}

export function initMediaUI() {
  initVideo();
  initRail();
}
