import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-offwhite">
      <header className="bg-navy text-white">
        <div className="container-x flex items-center justify-between py-4">
          <Link href="/admin" className="font-slab text-xl font-bold">
            Admin · Locations
          </Link>
          <nav className="flex gap-6 items-center text-sm">
            <Link href="/admin" className="hover:text-gold">All Locations</Link>
            <Link href="/admin/upload" className="hover:text-gold">Bulk Upload</Link>
            <Link href="/locations" className="hover:text-gold" target="_blank">View Site</Link>
            <form action="/admin/logout" method="post">
              <button type="submit" className="hover:text-gold">Logout</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="container-x py-8">{children}</main>
    </div>
  );
}
