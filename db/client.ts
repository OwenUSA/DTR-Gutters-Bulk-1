import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * Hostinger MySQL credentials, fully hardcoded and committed intentionally.
 *
 * Nothing here reads from the environment: the hosting panel's environment
 * variables were not persisting, so the connection is defined entirely in code.
 * Passing discrete fields rather than a DATABASE_URL also means the password
 * needs no percent-encoding — `>` and `#` are ordinary characters in a string
 * literal, whereas in a URI they break parsing outright.
 *
 * Why the public IP and not `localhost`: with no env var to vary it, one value
 * has to serve both local development and the server. The public address works
 * from both, because this database's Remote MySQL access host is `%`.
 *
 * SECURITY / OPERATIONAL NOTE: this repository is public, so these credentials
 * are public, and the `%` rule lets any IP on the internet connect with them.
 * If you lock that down (Hostinger -> Databases -> Remote MySQL), this file must
 * change `host` to "localhost" in the same step, or the app loses its database.
 * The safer end state is to rotate this password and restrict remote access.
 */
const DB_CONFIG = {
  host: "82.197.82.127",
  port: 3306,
  user: "u439538525_admin",
  password: ">p6qNxc3Oc#X",
  database: "u439538525_gutters",
  connectionLimit: 5,
};

const globalForPool = globalThis as unknown as { __mysqlPool?: mysql.Pool };

const pool = globalForPool.__mysqlPool ?? mysql.createPool(DB_CONFIG);

if (process.env.NODE_ENV !== "production") {
  globalForPool.__mysqlPool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
