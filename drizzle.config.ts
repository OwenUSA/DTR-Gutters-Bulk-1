import type { Config } from "drizzle-kit";

// Credentials mirror db/client.ts, which holds them hardcoded. Keeping these in
// sync means `npm run db:generate` / `db:push` work without any env setup.
export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: "82.197.82.127",
    port: 3306,
    user: "u439538525_admin",
    password: ">p6qNxc3Oc#X",
    database: "u439538525_gutters",
  },
} satisfies Config;
