import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const globalForPool = globalThis as unknown as { __mysqlPool?: mysql.Pool };

const pool =
  globalForPool.__mysqlPool ??
  mysql.createPool({
    uri: connectionString,
    connectionLimit: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPool.__mysqlPool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
