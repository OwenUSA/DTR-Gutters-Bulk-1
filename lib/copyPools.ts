import type { Location } from "@/db/schema";

export const HERO_H1_POOL = [
  "Sagging Gutters in {name}? The Dream Team Fix Is Here.",
  "{name}'s Trusted Gutter Experts",
  "Seamless Gutters & Guards Across {name} — Backed by the Dream Team",
  "Your {name} Gutter Specialists, On Call Today",
  "Reliable Gutter Installation & Repair in {name}",
];

export const HERO_SUB_POOL = [
  "Protect your home with {name}'s most trusted gutter experts. Serving {name} and surrounding South Florida areas.",
  "From clog-free guards to full seamless installs — Dream Team delivers gutters built for Florida storms in {name}.",
  "Family-owned, licensed, and insured. We've helped hundreds of {name} families keep water away from their foundations.",
  "Fast estimates, honest quotes, and expert workmanship for every home in {name}.",
  "Overflowing gutters, leaks, or pulling fasteners — {name}'s Dream Team has you covered with proven gutter solutions.",
];

export const FINAL_CTA_POOL = [
  "Get Your Free Gutter Estimate in 24 Hours!",
  "Ready for Gutters You Can Trust? Let's Talk.",
  "Schedule Your Free {name} Gutter Inspection Today",
  "Don't Wait on a Clogged Gutter — Call the Dream Team",
  "Protect Your Foundation — Free Estimate Within 24 Hours",
];

export function fillTemplate(tpl: string, loc: Location): string {
  return tpl.replace(/\{(\w+)\}/g, (_, key) => {
    const v = (loc as unknown as Record<string, unknown>)[key];
    return typeof v === "string" && v ? v : "";
  });
}
