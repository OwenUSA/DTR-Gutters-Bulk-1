import fs from "node:fs";
const path = ".env";
const src = fs.readFileSync(path, "utf8");
const out = src.split(/\r?\n/).map((line) => {
  const m = line.match(/^(\w+)=(.*)$/);
  if (!m) return line;
  const [, k, v] = m;
  if (v === "" || v.startsWith("'") || v.startsWith('"')) return line;
  return `${k}='${v.replace(/'/g, "'\\''")}'`;
}).join("\n");
fs.writeFileSync(path, out);
console.log("Quoted unquoted .env values.");
