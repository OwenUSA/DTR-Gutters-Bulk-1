// Deterministic per-location accent theme.
// Hashes the slug to a stable hue offset in [-20°, +20°] around the base navy hue,
// preserving saturation/lightness so every page stays on-brand.

// Gutters site: cooler, deeper blue centered around #102a43 — water/metal vibe.
const BASE = { h: 209, s: 62, l: 17 };
const DARK_DELTA_L = -5;
const LIGHT_DELTA_L = 13;
const HUE_RANGE = 18;                         // ±18° — slightly tighter than roofing site

export type Theme = {
  navy: string;
  navyDark: string;
  navyLight: string;
  navyRgb: string;   // "r, g, b" — for use in rgba(var(--navy-rgb), α)
};

export function hashSlug(slug: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return [f(0), f(8), f(4)];
}

function hsl(h: number, s: number, l: number): { hex: string; rgb: string } {
  const [r, g, b] = hslToRgb(((h % 360) + 360) % 360, s, l);
  const hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  return { hex, rgb: `${r}, ${g}, ${b}` };
}

export function getThemeForSlug(slug: string): Theme {
  const hash = hashSlug(slug || "");
  // map hash → [-HUE_RANGE, +HUE_RANGE]
  const offset = ((hash % (HUE_RANGE * 2 + 1)) - HUE_RANGE);
  const h = BASE.h + offset;
  const base = hsl(h, BASE.s, BASE.l);
  const dark = hsl(h, BASE.s, BASE.l + DARK_DELTA_L);
  const light = hsl(h, BASE.s, BASE.l + LIGHT_DELTA_L);
  return {
    navy: base.hex,
    navyDark: dark.hex,
    navyLight: light.hex,
    navyRgb: base.rgb,
  };
}
