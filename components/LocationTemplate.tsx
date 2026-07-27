import type { CSSProperties } from "react";
import type { Location } from "@/db/schema";
import { getThemeForSlug } from "@/lib/theme";
import { getVariantsForSlug, type SectionKey } from "@/lib/variants";
import { REVIEW_POOL } from "@/lib/reviewPool";
import SiteNav from "@/components/SiteNav";
import ServiceAreas from "@/components/ServiceAreas";
import { HeroSplit, HeroCentered, HeroImageRight } from "@/components/sections/Hero";
import { ServicesGrid, ServicesList, ServicesAlternating } from "@/components/sections/Services";
import { AboutImageLeft, AboutImageRight, AboutStacked } from "@/components/sections/About";
import { ProcessCards, ProcessTimeline, ProcessStepper } from "@/components/sections/Process";
import { WhyGrid, WhyStacked, WhyIconLed } from "@/components/sections/Why";

// Until real photography is supplied, every imagery slot uses a single
// branded SVG placeholder. Drop real files into /public/assets and update
// these constants (or the per-service paths in components/sections/Services.tsx).
const DEFAULT_HERO = "/assets/placeholder.svg";
const FINANCING_IMG = "/assets/placeholder.svg";
// The service-area image now lives in components/ServiceAreas.tsx.

// Keep slug-hashed accent system; gutters site shifts the base hue to a
// deeper / cooler navy so it feels distinct from the roofing brand.
const ORIGINAL_THEME = {
  navy: "#102a43",
  navyDark: "#0a1c2e",
  navyLight: "#1f4a7a",
  navyRgb: "16, 42, 67",
};

// Home page keeps the original look — first variant of every section, original copy.
const HOME_VARIANTS = {
  hero: "split" as const,
  services: "grid" as const,
  about: "imageRight" as const,
  process: "cards" as const,
  why: "grid" as const,
  sectionOrder: ["services", "about", "process", "why"] as SectionKey[],
  reviewPicks: [0, 1, 2, 3],
  copy: {
    heroH1: "Florida's Trusted Gutter Experts.",
    heroSub:
      "Dream Team delivers seamless gutters, leaf guards, repair, and cleaning across South Florida.",
    finalCta: "Get Your Free Gutter Estimate in 24 Hours!",
  },
};

export default function LocationTemplate({
  loc,
  isHome = false,
}: {
  loc: Location;
  isHome?: boolean;
}) {
  const phone = loc.phone || "(954) 699-0090";
  const phoneHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const email = loc.email || "";
  const emailHref = email ? `mailto:${email}` : "";
  // TODO: confirm license number for the gutters business — using a placeholder.
  const license = loc.license || "CCC1334317";
  const name = loc.name;

  const theme = isHome ? ORIGINAL_THEME : getThemeForSlug(loc.slug);
  const themeStyle = {
    "--navy": theme.navy,
    "--navy-dark": theme.navyDark,
    "--navy-light": theme.navyLight,
    "--navy-rgb": theme.navyRgb,
  } as CSSProperties;

  const heroImage = loc.heroImageUrl?.trim() || DEFAULT_HERO;
  const v = isHome ? HOME_VARIANTS : getVariantsForSlug(loc);

  const heroNode =
    v.hero === "split" ? <HeroSplit heroImage={heroImage} heroH1={v.copy.heroH1} heroSub={v.copy.heroSub} /> :
    v.hero === "centered" ? <HeroCentered heroImage={heroImage} heroH1={v.copy.heroH1} heroSub={v.copy.heroSub} /> :
    <HeroImageRight heroImage={heroImage} heroH1={v.copy.heroH1} heroSub={v.copy.heroSub} />;

  const sectionNodes: Record<SectionKey, React.ReactNode> = {
    services:
      v.services === "grid" ? <ServicesGrid /> :
      v.services === "list" ? <ServicesList /> :
      <ServicesAlternating />,
    about:
      v.about === "imageLeft" ? <AboutImageLeft name={name} isHome={isHome} /> :
      v.about === "imageRight" ? <AboutImageRight name={name} isHome={isHome} /> :
      <AboutStacked name={name} isHome={isHome} />,
    process:
      v.process === "cards" ? <ProcessCards /> :
      v.process === "timeline" ? <ProcessTimeline /> :
      <ProcessStepper />,
    why:
      v.why === "grid" ? <WhyGrid /> :
      v.why === "stacked" ? <WhyStacked /> :
      <WhyIconLed />,
  };

  const reviews = v.reviewPicks.map((i) => REVIEW_POOL[i]).filter(Boolean);

  return (
    <div style={themeStyle}>
      {/* Top bar */}
      <div className="bg-navy text-white text-[0.85rem] py-2">
        <div className="container-x flex justify-between items-center flex-wrap gap-x-4 gap-y-1">
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
            <span>Licensed & Insured · {license}</span>
            {loc.address && (
              <span>📍 {loc.address}{loc.zip ? `, ${loc.zip}` : ""}</span>
            )}
          </div>
          <div className="flex gap-4 items-center">
            {email && (
              <a href={emailHref} className="font-bold text-gold hover:underline">
                ✉ {email}
              </a>
            )}
            <a href={phoneHref} className="font-bold text-gold hover:underline">
              📞 {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] sticky top-0 z-[100]">
        <div className="container-x flex items-center justify-between py-3">
          <a href="#" className="block">
            <img src="/assets/cropped-New-Logo-scaled-1.png" alt="Dream Team Roofing & Gutters" className="h-[60px] w-auto" />
          </a>
          <SiteNav isHome={isHome} />
          <a href="#quote" className="btn btn-primary">GET STARTED</a>
        </div>
      </header>

      {/* Hero — variant */}
      {heroNode}

      {/* Trust strip */}
      <section className="bg-offwhite py-10">
        <div className="container-x flex justify-center gap-[60px] flex-wrap">
          <div className="flex items-center gap-3">
            <img src="/assets/Google_Favicon_2025.svg.webp" alt="Google" className="w-10 h-10 object-contain" />
            <div><strong className="text-[1.5rem] text-navy block">5.0</strong><span className="text-[0.85rem] text-[#666]">Google Reviews</span></div>
          </div>
          <div className="flex items-center gap-3">
            <img src="/assets/Facebook_Logo_2019.png" alt="Facebook" className="w-10 h-10 object-contain" />
            <div><strong className="text-[1.5rem] text-navy block">5.0</strong><span className="text-[0.85rem] text-[#666]">Facebook Reviews</span></div>
          </div>
          <div className="flex items-center gap-3">
            <img src="/assets/images-2.png" alt="BBB" className="w-10 h-10 object-contain" />
            <div><strong className="text-[1.5rem] text-navy block">A+</strong><span className="text-[0.85rem] text-[#666]">BBB Rating</span></div>
          </div>
        </div>
      </section>

      {/* Media strip */}
      <section className="py-10 bg-offwhite border-t border-[#eee]">
        <div className="container-x">
          <p className="text-center uppercase tracking-[2px] text-[0.85rem] text-[#666] mb-5">As Seen On</p>
          <div className="flex justify-center gap-[35px] flex-wrap font-bold text-[#888] font-slab">
            <span>Benzinga</span><span>Bloomberg</span><span>FOX 40</span><span>Google News</span>
            <span>Reuters</span><span>Yahoo Finance</span><span>MarketWatch</span><span>Business Insider</span>
            <span>Apple News</span><span>Associated Press</span>
          </div>
        </div>
      </section>

      {/* Suppliers */}
      <section className="py-10 bg-white border-t border-[#eee]">
        <div className="container-x">
          <p className="text-center uppercase tracking-[2px] text-[0.85rem] text-[#666] mb-5">Trusted Material Partners</p>
          <div className="flex justify-center gap-[35px] flex-wrap font-bold text-[#888] font-slab">
            <span>Spectra Metals</span><span>Berger Building Products</span><span>Englert</span><span>LeafFilter</span><span>Amerimax</span>
          </div>
        </div>
      </section>

      {/* Reviews — seeded picks */}
      <section className="py-20 bg-offwhite">
        <div className="container-x">
          <h2 className="section-title">5.0 Out of 5 Stars — Verified Reviews</h2>
          <div className="grid gap-[25px] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white p-[25px] rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <div className="text-gold text-[1.2rem] mb-2.5">★★★★★</div>
                <p className="italic text-[#444] mb-[15px]">&ldquo;{r.q}&rdquo;</p>
                <cite className="font-bold text-navy not-italic">— {r.a}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid band — variant sections in seeded order */}
      {v.sectionOrder.map((key) => (
        <div key={key}>{sectionNodes[key]}</div>
      ))}

      {/* Map */}
      {loc.address && (
        <section className="py-20 bg-offwhite">
          <div className="container-x">
            <h2 className="section-title">Find Us in {name}</h2>
            <div className="rounded-[10px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] w-full h-[400px]">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${loc.address}${loc.zip ? ` ${loc.zip}` : ""}`)}&output=embed`}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${name} location map`}
                className="border-0 w-full h-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* Financing */}
      <section className="py-20">
        <div className="container-x grid md:grid-cols-2 gap-[50px] items-center">
          <div>
            <h2 className="text-[2rem] mb-5">Flexible Financing, Tailored to Your Needs</h2>
            <p className="mb-[25px] text-[#555] text-[1.05rem]">We partner with multiple financing companies to offer $0 down, no credit check options, 0% interest financing, and flexible monthly payment plans so you can protect your home without compromise.</p>
            <a href="#quote" className="btn btn-primary">Explore Financing</a>
          </div>
          <img src={FINANCING_IMG} alt="Gutter financing" className="rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.15)]" />
        </div>
      </section>

      {/* Service area — home lists every location; inner pages link to /locations */}
      <ServiceAreas isHome={isHome} name={name} />

      {/* FAQ */}
      <section className="py-20 bg-offwhite" id="faq">
        <div className="container-x">
          <h2 className="section-title">Frequently Asked Questions</h2>
          {[
            ["How do I choose the right gutter company?", "Look for licensing, insurance, verified reviews, transparent pricing, and a written warranty on both labor and materials. Dream Team checks every box."],
            ["What's the difference between seamless and sectional gutters?", "Seamless gutters are cut on-site from one continuous coil — fewer joints means fewer leaks. Sectional gutters are pre-cut pieces joined with seams that can separate over time."],
            ["Do I really need gutter guards?", "If your home is near trees or you don't want to clean gutters twice a year, yes. Quality micro-mesh guards keep leaves, pine needles, and shingle grit out while letting water through."],
            ["How often should gutters be cleaned?", "Twice a year is typical — once in late spring and once in fall. Homes near heavy tree cover may need it more often. With guards installed you can usually go years between cleanings."],
            ["Can clogged gutters really damage my home?", "Yes. Overflowing water erodes landscaping, rots fascia and soffit boards, stains siding, and can pool against the foundation — leading to basement leaks and cracking."],
            ["What gutter materials do you install?", "Seamless aluminum (most common), copper, galvanized steel, and half-round profiles. We can match almost any color or custom-finish to your trim."],
            ["How long does a typical gutter installation take?", "Most single-family homes are completed in a single day. Larger or multi-story homes may take two days."],
            ["Are you licensed and insured?", `Yes — License Number ${license}, with full liability and workers' compensation.`],
            ["Do you fix sagging or pulling-away gutters?", "Yes — most of the time we replace damaged hangers with hidden hardened-steel fasteners and re-pitch the run. If the fascia underneath has rotted, we can repair that too."],
            ["What warranty do you offer?", "A workmanship warranty on every installation, plus full manufacturer warranties on the materials. Specific terms are confirmed in writing before work begins."],
          ].map(([q, a]) => (
            <details key={q} className="faq-item bg-white mb-3 px-[22px] py-[18px] rounded-md shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
              <summary>{q}</summary>
              <p className="mt-3 text-[#555]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA — variant copy */}
      <section className="py-20 text-white text-center bg-gradient-to-br from-navy to-navy-light">
        <div className="container-x">
          <h2 className="!text-white text-[2.3rem] mb-4">{v.copy.finalCta}</h2>
          <p className="text-[1.15rem] mb-[30px] opacity-95">Free Gutter Inspection — call now or request your free estimate online.</p>
          <div className="flex justify-center gap-[15px] flex-wrap">
            <a href={phoneHref} className="btn btn-cta">📞 {phone}</a>
            <a href="#quote" className="btn btn-outline-light">Request Estimate</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark text-[#cfd8e3] pt-[60px]">
        <div className="container-x grid md:grid-cols-[1.2fr_1fr_1fr_1.5fr] gap-10">
          <div>
            <img src="/assets/cropped-New-Logo-scaled-1.png" alt="Dream Team Roofing & Gutters" className="h-[70px] w-auto bg-white p-2 rounded-md mb-4" />
            <p className="text-[0.92rem] mb-2.5">South Florida&apos;s trusted gutter experts. Licensed, insured, and family-owned.</p>
            <p className="text-[0.92rem] mb-2.5"><strong>License #:</strong> {license}</p>
            {email && <p className="text-[0.92rem] mb-2.5"><strong>Email:</strong> <a href={emailHref} className="text-gold font-semibold">{email}</a></p>}
            <p className="text-[0.92rem] mb-2.5"><strong>Phone:</strong> <a href={phoneHref} className="text-gold font-semibold">{phone}</a></p>
            <div className="mt-4">
              <a href="#" className="text-gold font-semibold">Facebook</a> · <a href="#" className="text-gold font-semibold">LinkedIn</a> · <a href="#" className="text-gold font-semibold">YouTube</a>
            </div>
          </div>
          <div>
            <h4 className="text-white mb-4 text-[1.1rem]">Services</h4>
            <ul>
              {["Seamless Gutter Installation","Gutter Guards / Leaf Protection","Gutter Cleaning","Gutter Repair","Downspout Installation & Repair","Fascia & Soffit Repair","Copper & Specialty Gutters"].map((s) => (
                <li key={s} className="py-1 text-[0.92rem]">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4 text-[1.1rem]">Resources</h4>
            <ul>
              {["Blog","Instant Gutter Quote","Financing","FAQ","Products & Materials","About Us","Contact"].map((s) => (
                <li key={s} className="py-1 text-[0.92rem]">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4 text-[1.1rem]">Our Office</h4>
            <ul>
              <li className="text-[0.95rem] leading-[1.6]"><strong className="text-white">{name}</strong></li>
              {loc.address && <li className="text-[0.9rem] leading-[1.6]">{loc.address}{loc.zip ? `, ${loc.zip}` : ""}</li>}
              {loc.phone && <li className="text-[0.9rem] leading-[1.6]">📞 <a href={phoneHref} className="text-gold">{loc.phone}</a></li>}
              {loc.email && <li className="text-[0.9rem] leading-[1.6]">✉ <a href={emailHref} className="text-gold">{loc.email}</a></li>}
            </ul>
          </div>
        </div>
        <div className="mt-10 py-5 border-t border-[#1a3454] text-center text-[0.85rem] text-[#8a9bb0]">
          <div className="container-x">
            <p>© {new Date().getFullYear()} Dream Team Roofing & Gutters · All Rights Reserved · Privacy Policy · Secured by Google reCAPTCHA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
