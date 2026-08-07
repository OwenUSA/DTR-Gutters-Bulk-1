import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import LocationTemplate from "@/components/LocationTemplate";
import { autoMetaTitle, autoMetaDescription } from "@/lib/seo";
import { isValidSlug } from "@/lib/slug";
import { cityFromName } from "@/lib/city";

const SITE_URL = process.env.SITE_URL || "https://dreamteamguttersfl.com";
const SITE_NAME = process.env.SITE_NAME || "Dream Team Roofing & Gutters";

async function getLocation(slug: string) {
  // This is a root catch-all, so every unmatched path on the domain arrives
  // here — including scanner probes like /.env or /wp-login.php. Real slugs are
  // always [a-z0-9-] (see slugify), so shape-check first and keep junk traffic
  // off the connection pool entirely.
  if (!isValidSlug(slug)) return undefined;

  const [row] = await db.select().from(locations).where(eq(locations.slug, slug)).limit(1);
  return row;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const loc = await getLocation(params.slug);
  if (!loc) return { title: "Not Found" };

  const title = autoMetaTitle(loc);
  const description = autoMetaDescription(loc);
  const url = `${SITE_URL}/${loc.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: loc.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocationPage({ params }: { params: { slug: string } }) {
  const loc = await getLocation(params.slug);
  if (!loc) notFound();

  const city = cityFromName(loc.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: `${SITE_NAME} — ${loc.name}`,
    url: `${SITE_URL}/${loc.slug}`,
    telephone: loc.phone || undefined,
    email: loc.email || undefined,
    address: loc.address
      ? {
          "@type": "PostalAddress",
          streetAddress: loc.address,
          addressLocality: city || undefined,
          postalCode: loc.zip || undefined,
          addressRegion: "FL",
          addressCountry: "US",
        }
      : undefined,
    areaServed: city,
    priceRange: "$$",
    image: `${SITE_URL}/assets/hero-gutters.jpg`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LocationTemplate loc={loc} />
    </>
  );
}
