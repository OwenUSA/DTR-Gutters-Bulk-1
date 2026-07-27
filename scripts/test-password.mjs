import pkg from "@next/env";
import bcrypt from "bcryptjs";

const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

const pw = process.argv[2];
if (!pw) {
  console.error("Usage: node scripts/test-password.mjs <password>");
  process.exit(1);
}

const hash = process.env.ADMIN_PASSWORD_HASH || "";
console.log("Hash loaded length:", hash.length);
console.log("Hash prefix:", hash.slice(0, 7));
console.log("Hash matches password:", bcrypt.compareSync(pw, hash));
