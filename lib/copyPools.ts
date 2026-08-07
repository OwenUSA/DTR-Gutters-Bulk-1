import type { Location } from "@/db/schema";
import { cityFromName } from "@/lib/city";

export const HERO_H1_POOL = [
  "Sagging Gutters in {city}? The Dream Team Fix Is Here.",
  "{city}'s Trusted Gutter Experts",
  "Seamless Gutters & Guards Across {city} — Backed by the Dream Team",
  "Your {city} Gutter Specialists, On Call Today",
  "Reliable Gutter Installation & Repair in {city}",
];

export const HERO_SUB_POOL = [
  "Protect your home with {city}'s most trusted gutter experts. Serving {city} and surrounding South Florida areas.",
  "From clog-free guards to full seamless installs — Dream Team delivers gutters built for Florida storms in {city}.",
  "Family-owned, licensed, and insured. We've helped hundreds of {city} families keep water away from their foundations.",
  "Fast estimates, honest quotes, and expert workmanship for every home in {city}.",
  "Overflowing gutters, leaks, or pulling fasteners — {city}'s Dream Team has you covered with proven gutter solutions.",
];

export const FINAL_CTA_POOL = [
  "Get Your Free Gutter Estimate in 24 Hours!",
  "Ready for Gutters You Can Trust? Let's Talk.",
  "Schedule Your Free {city} Gutter Inspection Today",
  "Don't Wait on a Clogged Gutter — Call the Dream Team",
  "Protect Your Foundation — Free Estimate Within 24 Hours",
];

export function fillTemplate(tpl: string, loc: Location): string {
  // `city` is derived, not a column — the pools above want a place name, and
  // `name` holds "Service - City, FL". Other tokens still map to columns.
  const derived: Record<string, string> = { city: cityFromName(loc.name) };

  return tpl.replace(/\{(\w+)\}/g, (_, key) => {
    if (key in derived) return derived[key];
    const v = (loc as unknown as Record<string, unknown>)[key];
    return typeof v === "string" && v ? v : "";
  });
}
