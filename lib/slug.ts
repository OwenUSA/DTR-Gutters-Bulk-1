// Location pages live at the site root (`/<slug>`), so a slug occupies the same
// namespace as every real route and static asset. Next.js gives static routes
// precedence, which means a location slugged "admin" would save fine and then be
// silently unreachable forever. Reserve those names instead.
export const RESERVED_SLUGS = new Set([
  "admin",
  "locations",
  "api",
  "assets",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  // Bare forms too, so a slug can never shadow the generated metadata routes.
  "robots",
  "sitemap",
]);

// slugify() can only ever emit this character set. The root catch-all relies on
// that guarantee to reject junk paths without a database round-trip.
export const SLUG_PATTERN = /^[a-z0-9-]+$/;

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}

/** Safe to route: correct shape and not shadowed by a real route. */
export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && !RESERVED_SLUGS.has(slug);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Validate a slug the user typed explicitly. Throws with a readable reason —
 * silently renaming a slug someone asked for by name is worse than rejecting it.
 */
export function assertUsableSlug(slug: string, original: string): void {
  if (!slug) {
    throw new Error(
      `"${original}" has no letters or numbers to build a URL from — enter a slug like "boca-raton".`
    );
  }
  if (isReservedSlug(slug)) {
    throw new Error(
      `"${slug}" is a reserved path on this site and can't be used as a location slug. Try "${slug}-fl" or similar.`
    );
  }
}

/**
 * Derive a free slug from `base`, suffixing until it's unused and unreserved.
 * Used only when no explicit slug was supplied, so silent suffixing is fine.
 */
export async function uniqueSlug(
  base: string,
  exists: (s: string) => Promise<boolean>
): Promise<string> {
  const root = slugify(base);
  if (!root) {
    throw new Error(
      `Could not build a URL slug from "${base}" — it has no letters or numbers. Set a slug manually.`
    );
  }
  let candidate = root;
  let i = 2;
  while (isReservedSlug(candidate) || (await exists(candidate))) {
    candidate = `${root}-${i++}`;
  }
  return candidate;
}
