import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * Connection settings come from discrete DB_* variables when they are present,
 * and fall back to DATABASE_URL otherwise.
 *
 * Why both: DATABASE_URL is parsed as a URI, so any of > # ? & / @ : in the
 * password has to be percent-encoded or the string breaks — either silently
 * truncating (dotenv treats # as a comment) or throwing a bare "Invalid URL"
 * from inside a bundled chunk with no indication of which variable is at fault.
 * The discrete form hands the password to the driver untouched, so no encoding
 * is ever needed and the value can be pasted exactly as the host shows it.
 */
function buildPoolOptions(): mysql.PoolOptions {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DATABASE_URL } = process.env;

  // Discrete config wins when any part of it is supplied.
  if (DB_HOST || DB_USER || DB_NAME) {
    const missing = (["DB_HOST", "DB_USER", "DB_NAME"] as const).filter(
      (k) => !process.env[k]
    );
    if (missing.length > 0) {
      throw new Error(
        `Incomplete database configuration: ${missing.join(", ")} not set. ` +
          `When using discrete variables, DB_HOST, DB_USER and DB_NAME are all required ` +
          `(DB_PASSWORD may be empty, DB_PORT defaults to 3306).`
      );
    }
    return {
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD ?? "",
      database: DB_NAME,
      port: DB_PORT ? Number(DB_PORT) : 3306,
      connectionLimit: 5,
    };
  }

  if (!DATABASE_URL) {
    throw new Error(
      "No database configuration found. Set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME " +
        "(recommended — no character escaping needed), or set DATABASE_URL."
    );
  }

  // Fail with something actionable rather than a bare "Invalid URL".
  // The URL itself is never logged: it contains the password.
  try {
    new URL(DATABASE_URL);
  } catch {
    throw new Error(
      "DATABASE_URL is not a valid URI. Reserved characters in the password " +
        "(> # ? & / @ :) must be percent-encoded — for example > becomes %3E and # becomes %23. " +
        "Alternatively set DB_HOST, DB_USER, DB_PASSWORD and DB_NAME instead, which require no encoding."
    );
  }

  return { uri: DATABASE_URL, connectionLimit: 5 };
}

const globalForPool = globalThis as unknown as { __mysqlPool?: mysql.Pool };

const pool = globalForPool.__mysqlPool ?? mysql.createPool(buildPoolOptions());

if (process.env.NODE_ENV !== "production") {
  globalForPool.__mysqlPool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
