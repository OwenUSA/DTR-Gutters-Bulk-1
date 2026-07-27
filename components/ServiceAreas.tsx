import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

const SERVICE_AREA_IMG = "/assets/placeholder.svg";

/**
 * Home renders the full linked directory — this is the crawler's entry point to
 * every location page, so it deliberately lists all of them.
 *
 * Location pages only link out to /locations. Repeating the full list on all of
 * them would put hundreds of identical links on every page and undercut the
 * per-slug variation in lib/variants.ts that keeps the pages distinct.
 */
export default async function ServiceAreas({
  isHome = false,
  name,
}: {
  isHome?: boolean;
  name: string;
}) {
  if (!isHome) {
    return (
      <section className="py-20 bg-offwhite" id="areas">
        <div className="container-x">
          <h2 className="section-title">
            Gutter Services Near You — {name} &amp; Surrounding Coverage
          </h2>
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-10 items-center">
            <img
              src={SERVICE_AREA_IMG}
              alt={`${name} service area`}
              className="rounded-[10px] shadow-[0_6px_20px_rgba(0,0,0,0.1)]"
            />
            <div>
              <p className="text-[#555] text-[1.05rem] mb-6">
                We serve homeowners across South Florida with seamless gutters, leaf
                protection, cleaning, and repair.
              </p>
              <a href="/locations" className="btn btn-primary">
                View all service areas
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const areas = await db
    .select({ slug: locations.slug, name: locations.name })
    .from(locations)
    .where(eq(locations.noindex, false))
    .orderBy(asc(locations.name));

  return (
    <section className="py-20 bg-offwhite" id="areas">
      <div className="container-x">
        <h2 className="section-title">Gutter Services Across South Florida</h2>

        {areas.length === 0 ? (
          <p className="text-center text-[#666]">
            Service areas are being added — call us to check coverage near you.
          </p>
        ) : (
          <>
            <ul className="columns-2 md:columns-3 lg:columns-4 gap-6">
              {areas.map((a) => (
                <li key={a.slug} className="break-inside-avoid py-2 border-b border-[#ddd]">
                  <a
                    href={`/${a.slug}`}
                    className="font-medium text-navy hover:text-gold"
                  >
                    📍 {a.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="text-center mt-10">
              <a href="/locations" className="btn btn-outline">
                Browse all {areas.length} service areas
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
