"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Location } from "@/db/schema";

export default function LocationsTable({ rows }: { rows: Location[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((l) =>
      [l.name, l.slug, l.address, l.zip, l.email, l.phone]
        .some((f) => f?.toLowerCase().includes(q))
    );
  }, [rows, query]);

  return (
    <>
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, slug, address, zip, email, phone..."
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-navy"
        />
        {query && (
          <span className="ml-3 text-sm text-gray-500">
            {filtered.length} of {rows.length} match
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy text-white text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Address</th>
              <th className="p-3">SEO</th>
              <th className="p-3">Updated</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-gray-100 hover:bg-offwhite">
                <td className="p-3 font-semibold text-navy">{l.name}</td>
                <td className="p-3 text-gray-600">/{l.slug}</td>
                <td className="p-3 text-gray-600">{l.address}{l.zip ? `, ${l.zip}` : ""}</td>
                <td className="p-3">
                  {l.noindex ? (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">Hidden</span>
                  ) : (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Indexed</span>
                  )}
                </td>
                <td className="p-3 text-gray-500 text-xs">{new Date(l.updatedAt).toLocaleString()}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/locations/${l.id}`} className="text-navy underline font-semibold">Edit</Link>
                  <Link href={`/${l.slug}`} target="_blank" className="text-gold underline ml-3">View</Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  {rows.length === 0
                    ? "No locations yet. Create one or upload an Excel file."
                    : "No locations match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
