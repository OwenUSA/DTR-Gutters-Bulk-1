import * as XLSX from "xlsx";
import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await db.select().from(locations).orderBy(desc(locations.updatedAt));

  const headers = [
    "id", "slug", "name", "email", "address", "phone", "zip",
    "license", "metaTitle", "metaDescription", "heroImageUrl", "noindex",
    "createdAt", "updatedAt",
  ];

  const data = rows.map((l) => ({
    id: l.id,
    slug: l.slug,
    name: l.name,
    email: l.email,
    address: l.address,
    phone: l.phone,
    zip: l.zip,
    license: l.license,
    metaTitle: l.metaTitle,
    metaDescription: l.metaDescription,
    heroImageUrl: l.heroImageUrl,
    noindex: l.noindex ? "TRUE" : "FALSE",
    createdAt: new Date(l.createdAt).toISOString(),
    updatedAt: new Date(l.updatedAt).toISOString(),
  }));

  const ws = XLSX.utils.json_to_sheet(data, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "locations");
  const buf: Buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const body = new Uint8Array(buf);

  const date = new Date().toISOString().slice(0, 10);

  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="locations-${date}.xlsx"`,
    },
  });
}
