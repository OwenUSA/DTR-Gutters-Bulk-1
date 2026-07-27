import Link from "next/link";

// With location pages served from the root, this is what every mistyped URL on
// the domain renders — worth keeping on-brand rather than using Next's default.
export default function NotFound() {
  return (
    <main className="min-h-screen bg-offwhite flex items-center justify-center p-6">
      <div className="container-x max-w-xl text-center">
        <img
          src="/assets/dream-team-gutters-logo.jpg"
          alt="Dream Team Gutters"
          className="h-[70px] w-auto mx-auto mb-8"
        />
        <p className="text-gold font-bold tracking-[2px] text-[0.85rem] uppercase mb-3">
          Page not found
        </p>
        <h1 className="text-navy text-[2.2rem] mb-4">
          We couldn&apos;t find that page.
        </h1>
        <p className="text-[#555] text-[1.05rem] mb-8">
          The link may be out of date, or the address might have a typo. Try our
          service areas, or head back to the homepage.
        </p>
        <div className="flex justify-center gap-[15px] flex-wrap">
          <Link href="/" className="btn btn-primary">
            Back to homepage
          </Link>
          <Link href="/locations" className="btn btn-outline">
            View service areas
          </Link>
        </div>
      </div>
    </main>
  );
}
