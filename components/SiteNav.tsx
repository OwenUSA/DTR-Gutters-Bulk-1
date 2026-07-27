import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

const SERVICES = [
  "Seamless Gutter Installation",
  "Gutter Guards & Leaf Protection",
  "Gutter Cleaning",
  "Gutter Repair",
  "Downspout Installation & Repair",
  "Fascia & Soffit Repair",
  "Copper & Specialty Gutters",
  "Gutter Company Near Me",
  "Storm Damage Gutter Repair",
];

// The nav ships inside the layout, so whatever it renders appears on every page
// of the site. Cap the dropdown and send the long tail to /locations rather than
// putting hundreds of anchors in every page's header.
const MAX_NAV_AREAS = 12;

export default async function SiteNav({ isHome = false }: { isHome?: boolean }) {
  const allAreas = await db
    .select({ slug: locations.slug, name: locations.name })
    .from(locations)
    .where(eq(locations.noindex, false))
    .orderBy(asc(locations.name));

  const areas = allAreas.slice(0, MAX_NAV_AREAS);
  const hasMore = allAreas.length > MAX_NAV_AREAS;

  const anchor = (id: string) => (isHome ? `#${id}` : `/#${id}`);
  // services anchor: same page on home, location page on others
  const servicesHref = isHome ? "#services" : "/#services";

  return (
    <nav className="hidden md:flex gap-[30px] items-center">
      <a href="/" className="font-medium text-navy hover:text-gold">Home</a>
      <a href={anchor("about")} className="font-medium text-navy hover:text-gold">About</a>

      <div className="relative group">
        <button type="button" className="font-medium text-navy hover:text-gold flex items-center gap-1">
          Services <span className="text-[0.7rem]">▾</span>
        </button>
        <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
          <ul className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-md min-w-[260px] py-2">
            {SERVICES.map((s) => (
              <li key={s}>
                <a
                  href={servicesHref}
                  className="block px-5 py-2 text-navy hover:bg-offwhite hover:text-gold text-[0.95rem]"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative group">
        <button type="button" className="font-medium text-navy hover:text-gold flex items-center gap-1">
          Service Areas <span className="text-[0.7rem]">▾</span>
        </button>
        <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
          <ul className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-md min-w-[240px] py-2 max-h-[60vh] overflow-y-auto">
            {areas.length === 0 && (
              <li className="px-5 py-2 text-[#666] text-[0.9rem]">No locations yet</li>
            )}
            {areas.map((a) => (
              <li key={a.slug}>
                <a
                  href={`/${a.slug}`}
                  className="block px-5 py-2 text-navy hover:bg-offwhite hover:text-gold text-[0.95rem]"
                >
                  {a.name}
                </a>
              </li>
            ))}
            {hasMore && (
              <li className="border-t border-[#eee] mt-1 pt-1">
                <a
                  href="/locations"
                  className="block px-5 py-2 text-gold font-semibold hover:bg-offwhite text-[0.95rem]"
                >
                  View all service areas →
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <a href={anchor("faq")} className="font-medium text-navy hover:text-gold">FAQ</a>
    </nav>
  );
}
