"use server";

import * as XLSX from "xlsx";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugify, uniqueSlug, assertUsableSlug } from "@/lib/slug";
import { revalidatePath } from "next/cache";

export type UploadResult = {
  created: number;
  updated: number;
  skipped: { row: number; reason: string; slug?: string }[];
};

const HEADERS = [
  "slug", "name", "email", "address", "phone", "zip",
  "license", "metaTitle", "metaDescription", "heroImageUrl", "noindex",
] as const;

function normalizeKey(k: string): string {
  return k.toLowerCase().replace(/[\s_-]/g, "");
}

function coerceBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (v == null) return false;
  const s = String(v).trim().toLowerCase();
  return ["true", "1", "yes", "y"].includes(s);
}

function pickRow(raw: Record<string, unknown>): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  const map: Record<string, string> = {};
  for (const h of HEADERS) map[normalizeKey(h)] = h;
  for (const [k, v] of Object.entries(raw)) {
    const target = map[normalizeKey(k)];
    if (!target) continue;
    if (target === "noindex") out.noindex = coerceBool(v);
    else out[target] = v == null ? "" : String(v).trim();
  }
  return out;
}

async function slugExists(slug: string): Promise<boolean> {
  const rows = await db.select({ id: locations.id }).from(locations).where(eq(locations.slug, slug)).limit(1);
  return rows.length > 0;
}

export async function uploadLocations(fd: FormData): Promise<UploadResult> {
  const file = fd.get("file") as File | null;
  if (!file) throw new Error("No file uploaded");

  const buf = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });

  const result: UploadResult = { created: 0, updated: 0, skipped: [] };

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2; // header is row 1
    const data = pickRow(rows[i]);
    const name = String(data.name || "").trim();
    const address = String(data.address || "").trim();
    const phone = String(data.phone || "").trim();

    if (!name) { result.skipped.push({ row: rowNum, reason: "missing name" }); continue; }
    if (!address) { result.skipped.push({ row: rowNum, reason: "missing address" }); continue; }
    if (!phone) { result.skipped.push({ row: rowNum, reason: "missing phone" }); continue; }

    // A slug supplied in the sheet is honoured or the row is skipped with a
    // reason. A blank one is derived from the name and suffixed until free.
    const rawSlug = String(data.slug || "").trim();
    let slug: string;
    let isUpdate = false;

    if (rawSlug) {
      slug = slugify(rawSlug);
      try {
        assertUsableSlug(slug, rawSlug);
      } catch (e) {
        result.skipped.push({
          row: rowNum,
          slug: slug || rawSlug,
          reason: e instanceof Error ? e.message : "unusable slug",
        });
        continue;
      }
      isUpdate = await slugExists(slug);
    } else {
      try {
        slug = await uniqueSlug(name, slugExists);
      } catch (e) {
        result.skipped.push({
          row: rowNum,
          reason: e instanceof Error ? e.message : "could not derive slug",
        });
        continue;
      }
    }

    const values = {
      slug,
      name,
      email: String(data.email || ""),
      address,
      phone,
      zip: String(data.zip || ""),
      license: String(data.license || ""),
      metaTitle: String(data.metaTitle || ""),
      metaDescription: String(data.metaDescription || ""),
      heroImageUrl: String(data.heroImageUrl || ""),
      noindex: typeof data.noindex === "boolean" ? data.noindex : false,
    };

    try {
      if (isUpdate) {
        await db
          .update(locations)
          .set({ ...values, updatedAt: new Date() })
          .where(eq(locations.slug, slug));
        result.updated++;
      } else {
        await db.insert(locations).values(values);
        result.created++;
      }
    } catch (e) {
      result.skipped.push({ row: rowNum, slug, reason: e instanceof Error ? e.message : "db error" });
    }
  }

  revalidatePath("/", "layout");
  return result;
}
