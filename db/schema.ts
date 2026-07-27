import { mysqlTable, int, varchar, boolean, timestamp } from "drizzle-orm/mysql-core";

export const locations = mysqlTable("locations", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  name: varchar("name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull().default(""),
  address: varchar("address", { length: 500 }).notNull().default(""),
  phone: varchar("phone", { length: 64 }).notNull().default(""),
  zip: varchar("zip", { length: 32 }).notNull().default(""),
  license: varchar("license", { length: 64 }).notNull().default(""),
  metaTitle: varchar("meta_title", { length: 255 }).notNull().default(""),
  metaDescription: varchar("meta_description", { length: 500 }).notNull().default(""),
  heroImageUrl: varchar("hero_image_url", { length: 1024 }).notNull().default(""),
  noindex: boolean("noindex").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
