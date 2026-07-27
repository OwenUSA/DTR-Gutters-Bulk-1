import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

const SITE_NAME = process.env.SITE_NAME || "Dream Team Roofing & Gutters";

export const metadata: Metadata = {
  title: `Our Locations | ${SITE_NAME}`,
  description: `Find a ${SITE_NAME} office near you. Licensed, insured gutter experts serving South Florida.`,
};

export default async function LocationsIndex() {
  const rows = await db
    .select()
    .from(locations)
    .where(eq(locations.noindex, false))
    .orderBy(asc(locations.name));

  return (
    <main className="min-h-screen bg-offwhite py-16">
      <div className="container-x">
        <h1 className="section-title">Our Locations</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map((loc) => (
            <Link
              key={loc.id}
              href={`/${loc.slug}`}
              className="block bg-white p-6 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition"
            >
              <h2 className="text-[1.4rem] text-navy mb-2">{loc.name}</h2>
              {loc.address && <p className="text-[#555] text-sm">{loc.address}{loc.zip ? `, ${loc.zip}` : ""}</p>}
              {loc.phone && <p className="text-gold font-semibold mt-2 text-sm">{loc.phone}</p>}
            </Link>
          ))}
          {rows.length === 0 && <p className="text-[#555]">No locations published yet.</p>}
        </div>
      </div>
    </main>
  );
}
