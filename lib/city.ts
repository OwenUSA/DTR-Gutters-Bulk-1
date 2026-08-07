/**
 * A location's `name` column holds a marketing label, not a place:
 * "Gutter Services - Wellington, FL". Page copy almost always wants the bare
 * city ("Wellington") — "Your Local Gutter Partner in Wellington" rather than
 * "in Gutter Services - Wellington, FL".
 *
 * Anything that reads as a place name goes through here instead of using
 * `name` directly. Names that don't follow the convention (the home page passes
 * the brand name) fall through unchanged.
 */
export function cityFromName(name: string): string {
  if (!name) return "";
  // Drop the leading service label — everything up to the first " - ".
  const sep = name.indexOf(" - ");
  const place = sep === -1 ? name : name.slice(sep + 3);
  // Drop a trailing state suffix, e.g. ", FL".
  return place.replace(/,\s*[A-Za-z]{2}\s*$/, "").trim();
}
