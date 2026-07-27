"use client";

import { useState } from "react";
import Link from "next/link";
import { uploadLocations, type UploadResult } from "./actions";

export default function UploadPage() {
  const [result, setResult] = useState<UploadResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData(e.currentTarget);
      const r = await uploadLocations(fd);
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Bulk Upload Locations</h1>
        <Link href="/api/upload/template" className="btn btn-outline">
          Download Excel Template
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <p className="mb-4 text-gray-700">
          Upload an <code>.xlsx</code> or <code>.csv</code> file. Columns:
          <code className="block mt-2 bg-offwhite p-2 rounded text-xs">
            slug, name, email, address, phone, zip, license, metaTitle, metaDescription, noindex
          </code>
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <strong>Required:</strong> name, address, phone. If <code>slug</code> is blank,
          one is derived from <code>name</code>. Existing slugs are updated; new ones inserted.
          <code>noindex</code> defaults to <code>FALSE</code> (page indexed by Google).
        </p>

        <form onSubmit={onSubmit} className="flex gap-3 items-center">
          <input
            type="file"
            name="file"
            accept=".xlsx,.xls,.csv"
            required
            className="border rounded p-2"
          />
          <button type="submit" disabled={busy} className="btn btn-primary disabled:opacity-50">
            {busy ? "Processing..." : "Upload"}
          </button>
        </form>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-4">{error}</div>}

      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-navy mb-4">Upload Results</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded text-center">
              <div className="text-3xl font-bold text-green-700">{result.created}</div>
              <div className="text-sm text-green-700">Created</div>
            </div>
            <div className="bg-blue-50 p-4 rounded text-center">
              <div className="text-3xl font-bold text-blue-700">{result.updated}</div>
              <div className="text-sm text-blue-700">Updated</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded text-center">
              <div className="text-3xl font-bold text-yellow-700">{result.skipped.length}</div>
              <div className="text-sm text-yellow-700">Skipped</div>
            </div>
          </div>

          {result.skipped.length > 0 && (
            <div>
              <h3 className="font-bold text-navy mb-2">Skipped rows</h3>
              <table className="w-full text-sm border">
                <thead className="bg-offwhite text-left">
                  <tr><th className="p-2">Row</th><th className="p-2">Slug</th><th className="p-2">Reason</th></tr>
                </thead>
                <tbody>
                  {result.skipped.map((s, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{s.row}</td>
                      <td className="p-2 text-gray-600">{s.slug || "—"}</td>
                      <td className="p-2 text-red-700">{s.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link href="/admin" className="btn btn-primary mt-6 inline-block">Back to locations</Link>
        </div>
      )}
    </div>
  );
}
