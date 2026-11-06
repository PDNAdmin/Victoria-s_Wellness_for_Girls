// Line icons editors can pick in the Studio (names must match studio/schemaTypes/objects.js).
// 24×24, stroked by CSS.
export const ICONS = {
  book: '<path d="M3 6.5c3-1.5 6-1.5 9 0v13c-3-1.5-6-1.5-9 0z"/><path d="M21 6.5c-3-1.5-6-1.5-9 0v13c3-1.5 6-1.5 9 0z"/>',
  "book-light": '<path d="M3 7c3-1.5 6-1.5 9 0v12c-3-1.5-6-1.5-9 0z"/><path d="M21 7c-3-1.5-6-1.5-9 0v12c3-1.5 6-1.5 9 0z"/><path d="M12 2v2M8.5 3l.8 1.6M15.5 3l-.8 1.6"/>',
  stethoscope: '<path d="M5 3H4v6a5 5 0 0 0 10 0V3h-1"/><path d="M9 14v1.5a5.5 5.5 0 0 0 11 0V13"/><circle cx="20" cy="11" r="2"/>',
  "shield-plus": '<path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z"/><path d="M12 9v6M9 12h6"/>',
  "shield-check": '<path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  net: '<path d="M4 20v-8a8 8 0 0 1 16 0v8"/><path d="M2 20h20"/><path d="M8 20V6.2M12 20V4M16 20V6.2"/>',
  "chat-heart": '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/><path d="M12 15s-3-1.8-3-4a1.6 1.6 0 0 1 3-.9 1.6 1.6 0 0 1 3 .9c0 2.2-3 4-3 4z"/>',
  girl: '<circle cx="12" cy="5.5" r="2.2"/><path d="M12 8.5V16"/><path d="M5.5 4.5l6.5 5 6.5-5"/><path d="M9 21l3-5 3 5"/>',
  "phone-plus": '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M12 7.5v6M9 10.5h6"/><path d="M10 18.5h4"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  "heart-plus": '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M12 9.5v5M9.5 12h5"/>',
  sprout: '<path d="M12 21v-9"/><path d="M12 15c0-3.2-2.6-5.2-6.2-5.2 0 3.2 2.6 5.2 6.2 5.2z"/><path d="M12 12c0-3.4 2.6-6.6 7.2-6.6 0 3.6-2.6 6.6-7.2 6.6z"/>',
  "sprout-ground": '<path d="M12 21v-9"/><path d="M12 15c0-3.2-2.6-5.2-6.2-5.2 0 3.2 2.6 5.2 6.2 5.2z"/><path d="M12 12c0-3.4 2.6-6.6 7.2-6.6 0 3.6-2.6 6.6-7.2 6.6z"/><path d="M6 21h12"/>',
  rings: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
  "rings-plus": '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/><path d="M12 9.6v4.8"/>',
  scales: '<path d="M12 4v16M7.5 20h9M5 7h14"/><path d="M5 7l-3 6.2a3 3 0 0 0 6 0z"/><path d="M19 7l-3 6.2a3 3 0 0 0 6 0z"/>',
  "hand-heart": '<path d="M12 11.5s-3.2-1.9-3.2-4.2a1.7 1.7 0 0 1 3.2-1 1.7 1.7 0 0 1 3.2 1c0 2.3-3.2 4.2-3.2 4.2z"/><path d="M2.5 14.5h3l3 2h4.2a1.5 1.5 0 0 1 0 3H9"/><path d="M2.5 20.5h5.5l7-1.2 5-3.2a1.5 1.5 0 0 0-2-2.3l-4 2.4"/>',
  group: '<circle cx="6" cy="9" r="2.2"/><circle cx="12" cy="7.5" r="2.4"/><circle cx="18" cy="9" r="2.2"/><path d="M2.5 18c0-2.2 1.6-4 3.5-4M21.5 18c0-2.2-1.6-4-3.5-4M7.5 19c0-2.9 2-5.2 4.5-5.2s4.5 2.3 4.5 5.2"/>',
  "home-heart": '<path d="M3.5 11L12 4.5l8.5 6.5V20h-17z"/><path d="M12 17.5s-2.6-1.6-2.6-3.4a1.3 1.3 0 0 1 2.6-.8 1.3 1.3 0 0 1 2.6.8c0 1.8-2.6 3.4-2.6 3.4z"/>',
  medal: '<circle cx="12" cy="9.5" r="6"/><path d="M8.6 14.5L7 21l5-2.6 5 2.6-1.6-6.5"/><path d="M9.4 9.6l1.8 1.8 3.4-3.6"/>',
  gift: '<path d="M4 9h16v11H4z"/><path d="M3 6h18v3H3z"/><path d="M12 6v14"/><path d="M12 6c-1.5-2.5-5-3-5-1s3.5 1 5 1c1.5 0 5 1 5-1s-3.5-1.5-5 1z"/>',
};

/** The icon's SVG. `draw: true` adds pathLength="1" so the reveal animation can draw it in. */
export function iconSvg(name, { draw = false } = {}) {
  let inner = ICONS[name] || ICONS.heart;
  if (draw) inner = inner.replace(/<(path|circle|rect)\b/g, '<$1 pathLength="1"');
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
}
