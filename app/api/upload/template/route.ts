import * as XLSX from "xlsx";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const headers = [
    "slug", "name", "email", "address", "phone", "zip",
    "license", "metaTitle", "metaDescription", "heroImageUrl", "noindex",
  ];
  const sample = [
    {
      slug: "hollywood",
      name: "Hollywood",
      email: "hollywood@example.com",
      address: "3100 Stirling Rd, Hollywood, FL",
      phone: "(954) 699-0090",
      zip: "33021",
      license: "CCC1334317",
      metaTitle: "",
      metaDescription: "",
      heroImageUrl: "",
      noindex: "FALSE",
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sample, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "locations");
  const buf: Buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const body = new Uint8Array(buf);

  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="locations-template.xlsx"',
    },
  });
}
