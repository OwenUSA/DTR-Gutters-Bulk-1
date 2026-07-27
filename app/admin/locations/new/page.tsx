import LocationForm from "@/components/LocationForm";
import { createLocation } from "@/app/admin/actions";

export default function NewLocationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">New Location</h1>
      <LocationForm action={createLocation} submitLabel="Create" />
    </div>
  );
}
