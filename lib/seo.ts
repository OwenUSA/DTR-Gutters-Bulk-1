import type { Location } from "@/db/schema";

const SITE_NAME = process.env.SITE_NAME || "Dream Team Roofing & Gutters";

export function autoMetaTitle(loc: Pick<Location, "name" | "metaTitle">): string {
  if (loc.metaTitle && loc.metaTitle.trim().length > 0) return loc.metaTitle;
  return `Gutter Installation & Repair in ${loc.name} | ${SITE_NAME}`;
}

export function autoMetaDescription(
  loc: Pick<Location, "name" | "address" | "metaDescription">
): string {
  if (loc.metaDescription && loc.metaDescription.trim().length > 0) return loc.metaDescription;
  const where = loc.address ? `${loc.name} — ${loc.address}` : loc.name;
  return `Seamless gutters, gutter guards, cleaning, and repair in ${where}. Free estimates, fast turnaround, licensed and insured.`;
}
