import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import LocationForm from "@/components/LocationForm";
import { updateLocation, deleteLocation } from "@/app/admin/actions";

export default async function EditLocationPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { saved?: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const [loc] = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
  if (!loc) notFound();

  const update = updateLocation.bind(null, id);
  const del = deleteLocation.bind(null, id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Edit: {loc.name}</h1>
        <Link href={`/${loc.slug}`} target="_blank" className="text-gold underline font-semibold">
          View public page →
        </Link>
      </div>

      {searchParams.saved && (
        <div className="bg-green-50 text-green-800 p-3 rounded mb-4">Saved.</div>
      )}

      <LocationForm action={update} loc={loc} submitLabel="Save changes" />

      <form action={del} className="mt-12 border-t pt-6">
        <button
          type="submit"
          className="text-red-600 underline text-sm"
          formAction={del}
        >
          Delete this location
        </button>
      </form>
    </div>
  );
}
