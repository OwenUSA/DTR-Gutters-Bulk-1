import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL || "https://dreamteamguttersfl.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Location pages now live at the root, so a blanket allow covers them.
      { userAgent: "*", allow: ["/"], disallow: ["/admin", "/admin/", "/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
