import type { Metadata } from "next";
import type { Location } from "@/db/schema";
import LocationTemplate from "@/components/LocationTemplate";

const SITE_URL = process.env.SITE_URL || "https://dreamteamguttersfl.com";
const SITE_NAME = process.env.SITE_NAME || "Dream Team Roofing & Gutters";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Florida's Trusted Gutter Experts`,
  description: `${SITE_NAME} delivers seamless gutters, leaf protection, repair, and cleaning across South Florida.`,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — Florida's Trusted Gutter Experts`,
    description: `${SITE_NAME} delivers seamless gutters, leaf protection, repair, and cleaning across South Florida.`,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};

const homeLoc: Location = {
  id: 0,
  slug: "",
  name: SITE_NAME,
  email: "",
  address: "",
  phone: "(954) 699-0090",
  zip: "",
  license: "CCC1334317",
  metaTitle: "",
  metaDescription: "",
  heroImageUrl: "",
  noindex: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Home() {
  return <LocationTemplate loc={homeLoc} isHome />;
}
