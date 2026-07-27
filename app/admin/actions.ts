"use server";

import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { slugify, uniqueSlug, assertUsableSlug } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function slugExists(slug: string, excludeId?: number): Promise<boolean> {
  const rows = excludeId
    ? await db
        .select({ id: locations.id })
        .from(locations)
        .where(and(eq(locations.slug, slug), ne(locations.id, excludeId)))
        .limit(1)
    : await db.select({ id: locations.id }).from(locations).where(eq(locations.slug, slug)).limit(1);
  return rows.length > 0;
}

function getStr(fd: FormData, key: string): string {
  return String(fd.get(key) || "").trim();
}

export async function createLocation(fd: FormData) {
  const name = getStr(fd, "name");
  const address = getStr(fd, "address");
  const phone = getStr(fd, "phone");
  if (!name || !address || !phone) {
    throw new Error("name, address, and phone are required");
  }

  // An explicitly typed slug is honoured or rejected outright — silently
  // renaming what someone asked for is worse than a clear error. A derived slug
  // gets suffixed automatically, since no specific value was requested.
  const slugInput = getStr(fd, "slug");
  let slug: string;
  if (slugInput) {
    slug = slugify(slugInput);
    assertUsableSlug(slug, slugInput);
    if (await slugExists(slug)) {
      throw new Error(`slug "${slug}" is already used by another location`);
    }
  } else {
    slug = await uniqueSlug(name, slugExists);
  }

  await db.insert(locations).values({
    slug,
    name,
    email: getStr(fd, "email"),
    address,
    phone,
    zip: getStr(fd, "zip"),
    license: getStr(fd, "license"),
    metaTitle: getStr(fd, "metaTitle"),
    metaDescription: getStr(fd, "metaDescription"),
    heroImageUrl: getStr(fd, "heroImageUrl"),
    noindex: fd.get("noindex") === "on",
  });

  // Layout-level: SiteNav and the home directory are baked into every cached
  // page, so a new location invalidates the whole tree, not just its own path.
  revalidatePath("/", "layout");
  redirect("/admin?created=1");
}

export async function updateLocation(id: number, fd: FormData) {
  const name = getStr(fd, "name");
  const address = getStr(fd, "address");
  const phone = getStr(fd, "phone");
  const slugInput = getStr(fd, "slug");
  if (!name || !address || !phone) {
    throw new Error("name, address, and phone are required");
  }
  if (!slugInput) {
    throw new Error("slug is required");
  }

  const cleanSlug = slugify(slugInput);
  assertUsableSlug(cleanSlug, slugInput);
  if (await slugExists(cleanSlug, id)) {
    throw new Error(`slug "${cleanSlug}" is already used by another location`);
  }

  const [current] = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
  if (!current) throw new Error("Location not found");

  await db
    .update(locations)
    .set({
      slug: cleanSlug,
      name,
      email: getStr(fd, "email"),
      address,
      phone,
      zip: getStr(fd, "zip"),
      license: getStr(fd, "license"),
      metaTitle: getStr(fd, "metaTitle"),
      metaDescription: getStr(fd, "metaDescription"),
      heroImageUrl: getStr(fd, "heroImageUrl"),
      noindex: fd.get("noindex") === "on",
      updatedAt: new Date(),
    })
    .where(eq(locations.id, id));

  revalidatePath("/", "layout");
  redirect(`/admin/locations/${id}?saved=1`);
}

export async function deleteLocation(id: number) {
  await db.delete(locations).where(eq(locations.id, id));
  revalidatePath("/", "layout");
  redirect("/admin?deleted=1");
}
