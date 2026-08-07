import type { MetadataRoute } from "next";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";

const SITE_URL = process.env.SITE_URL || "https://dreamteamguttersfl.com";

// Built at deploy time by default, which silently omits every location added
// since. Generate per request so newly published pages are crawlable at once.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await db
    .select()
    .from(locations)
    .where(eq(locations.noindex, false));

  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/locations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...rows.map((l) => ({
      url: `${SITE_URL}/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
