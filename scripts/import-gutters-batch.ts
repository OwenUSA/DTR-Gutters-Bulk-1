/**
 * One-off importer for the GUTTERS sheet of "AP+GBP Project.xlsx".
 *
 * Reads a JSON payload exported from the sheet and inserts each location that
 * does not already exist, matched by slug. Rows already present are skipped
 * rather than updated, so re-running is safe and never rewrites a live page.
 */
import { readFileSync } from "node:fs";
import { db } from "../db/client";
import { locations, type NewLocation } from "../db/schema";
import { inArray } from "drizzle-orm";

type SheetRow = NewLocation & { row: number; phoneRaw?: unknown };

const payloadPath = process.argv[2];
if (!payloadPath) {
  console.error("usage: tsx scripts/import-gutters-batch.ts <rows.json> [--apply]");
  process.exit(1);
}
const APPLY = process.argv.includes("--apply");

const all: SheetRow[] = JSON.parse(readFileSync(payloadPath, "utf-8"));

// Only rows that carry a phone number are real listings.
const withPhone = all.filter((r) => r.phone && r.phone.trim() !== "");
// The first such row already has a page built; leave it untouched.
const [skippedFirst, ...candidates] = withPhone;

console.log(`rows in sheet:        ${all.length}`);
console.log(`rows with a phone:    ${withPhone.length}`);
console.log(`skipped (first/built): row ${skippedFirst.row} ${skippedFirst.slug}`);
console.log(`candidates:           ${candidates.length}\n`);

async function main() {
  const slugs = candidates.map((r) => r.slug);
  const existing = await db
    .select({ slug: locations.slug })
    .from(locations)
    .where(inArray(locations.slug, slugs));
  const existingSlugs = new Set(existing.map((e) => e.slug));

  const toInsert = candidates.filter((r) => !existingSlugs.has(r.slug));
  for (const s of existingSlugs) console.log(`already in db, skipping: ${s}`);

  if (!APPLY) {
    console.log(`\nDRY RUN — would insert ${toInsert.length} rows:`);
    for (const r of toInsert) console.log(`  ${r.slug}  |  ${r.name}  |  ${r.phone}`);
    process.exit(0);
  }

  for (const r of toInsert) {
    const { row: _row, phoneRaw: _phoneRaw, ...values } = r;
    await db.insert(locations).values(values);
    console.log(`inserted: ${values.slug}`);
  }
  console.log(`\ndone — ${toInsert.length} inserted`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
