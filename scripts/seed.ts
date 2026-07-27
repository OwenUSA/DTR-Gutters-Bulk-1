import "dotenv/config";
import { db } from "../db/client";
import { locations, type NewLocation } from "../db/schema";

// Seed is intentionally empty for the gutters site.
// Add location rows here and run `npm run db:seed` to upsert them by slug.
const sample: NewLocation[] = [];

async function main() {
  if (sample.length === 0) {
    console.log("No seed rows defined — skipping.");
    process.exit(0);
  }
  for (const row of sample) {
    await db
      .insert(locations)
      .values(row)
      .onDuplicateKeyUpdate({ set: row });
    console.log(`Upserted: ${row.slug}`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
