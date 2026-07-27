import type { Location } from "@/db/schema";

type Props = {
  action: (fd: FormData) => Promise<void>;
  loc?: Location;
  submitLabel?: string;
};

export default function LocationForm({ action, loc, submitLabel = "Save" }: Props) {
  return (
    <form action={action} className="grid gap-4 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Name *" name="name" defaultValue={loc?.name} required />
        <Field
          label="Slug (URL)"
          name="slug"
          defaultValue={loc?.slug}
          placeholder="auto-generated from name"
          hint="Page lives at /slug. Reserved: admin, locations, api, assets."
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Phone *" name="phone" defaultValue={loc?.phone} required />
        <Field label="Email" name="email" type="email" defaultValue={loc?.email} />
      </div>
      <div className="grid md:grid-cols-[2fr_1fr] gap-4">
        <Field label="Address *" name="address" defaultValue={loc?.address} required />
        <Field label="ZIP" name="zip" defaultValue={loc?.zip} />
      </div>
      <Field label="License #" name="license" defaultValue={loc?.license} />

      <Field
        label="Hero image URL"
        name="heroImageUrl"
        defaultValue={loc?.heroImageUrl}
        placeholder="https://… (leave blank to use default)"
      />
      {loc?.heroImageUrl ? (
        <img
          src={loc.heroImageUrl}
          alt="Hero preview"
          className="max-h-40 w-auto rounded border"
        />
      ) : null}

      <fieldset className="border-t pt-4 mt-2">
        <legend className="font-semibold text-navy px-2">SEO</legend>
        <div className="grid gap-4 mt-2">
          <Field label="Meta Title" name="metaTitle" defaultValue={loc?.metaTitle} placeholder="auto-generated if blank" />
          <Field label="Meta Description" name="metaDescription" defaultValue={loc?.metaDescription} placeholder="auto-generated if blank" textarea />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="noindex" defaultChecked={loc?.noindex} />
            <span>Hide from search engines (noindex)</span>
          </label>
        </div>
      </fieldset>

      <div className="flex gap-3 mt-4">
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        <a href="/admin" className="btn btn-outline">Cancel</a>
      </div>
    </form>
  );
}

function Field({
  label, name, defaultValue, type = "text", required, placeholder, textarea, hint,
}: {
  label: string; name: string; defaultValue?: string; type?: string; required?: boolean; placeholder?: string; textarea?: boolean; hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-navy">{label}</span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue || ""} placeholder={placeholder} rows={3} className="border rounded p-2" />
      ) : (
        <input type={type} name={name} defaultValue={defaultValue || ""} placeholder={placeholder} required={required} className="border rounded p-2" />
      )}
      {hint && <span className="text-xs text-gray-500">{hint}</span>}
    </label>
  );
}
