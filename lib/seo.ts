import type { Location } from "@/db/schema";
import { cityFromName } from "@/lib/city";

const SITE_NAME = process.env.SITE_NAME || "Dream Team Roofing & Gutters";

export function autoMetaTitle(loc: Pick<Location, "name" | "metaTitle">): string {
  if (loc.metaTitle && loc.metaTitle.trim().length > 0) return loc.metaTitle;
  return `Gutter Installation & Repair in ${cityFromName(loc.name)} | ${SITE_NAME}`;
}

export function autoMetaDescription(
  loc: Pick<Location, "name" | "address" | "metaDescription">
): string {
  if (loc.metaDescription && loc.metaDescription.trim().length > 0) return loc.metaDescription;
  const city = cityFromName(loc.name);
  const where = loc.address ? `${city} — ${loc.address}` : city;
  return `Seamless gutters, gutter guards, cleaning, and repair in ${where}. Free estimates, fast turnaround, licensed and insured.`;
}
