#!/usr/bin/env node
import {
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync,
  readdirSync,
} from "node:fs";
import { join } from "node:path";

const dir = new URL("../public/testimonials", import.meta.url).pathname;

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const favicons = [
  { url: "https://magicznyrynek.pl/favicon.ico", file: "magicznyrynek.ico" },
  { url: "https://samarite.eu/favicon.ico", file: "samarite.ico" },
];

for (const { url, file } of favicons) {
  const resp = await fetch(url);
  if (!resp.ok) {
    console.error(`Failed to fetch ${url}: ${resp.status}`);
    process.exit(1);
  }
  const buf = Buffer.from(await resp.arrayBuffer());
  writeFileSync(join(dir, file), buf);
  console.log(`Downloaded ${file}: ${buf.length} bytes`);
}

// Verify
const files = readdirSync(dir);
for (const f of files) {
  if (f === ".gitkeep") continue;
  const stat = statSync(join(dir, f));
  console.log(`✓ ${f}: ${stat.size} bytes`);
}
