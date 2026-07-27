import Link from "next/link";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { desc } from "drizzle-orm";
import LocationsTable from "@/components/LocationsTable";

export default async function AdminHome({
  searchParams,
}: {
  searchParams: { created?: string; deleted?: string };
}) {
  const rows = await db.select().from(locations).orderBy(desc(locations.updatedAt));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">All Locations ({rows.length})</h1>
        <div className="flex gap-3">
          <a href="/api/locations/export" className="btn btn-outline">Download Excel</a>
          <Link href="/admin/upload" className="btn btn-outline">Bulk Upload</Link>
          <Link href="/admin/locations/new" className="btn btn-primary">+ New Location</Link>
        </div>
      </div>

      {(searchParams.created || searchParams.deleted) && (
        <div className="bg-green-50 text-green-800 p-3 rounded mb-4">
          {searchParams.created ? "Location created." : "Location deleted."}
        </div>
      )}

      <LocationsTable rows={rows} />
    </div>
  );
}
