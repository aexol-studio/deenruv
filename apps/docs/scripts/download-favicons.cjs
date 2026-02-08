const {
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} = require("fs");
const { join } = require("path");

const dir = join(__dirname, "../public/testimonials");

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

async function download() {
  const favicons = [
    { url: "https://magicznyrynek.pl/favicon.ico", file: "magicznyrynek.ico" },
    { url: "https://samarite.eu/favicon.ico", file: "samarite.ico" },
  ];

  for (const { url, file } of favicons) {
    console.log(`Fetching ${url}...`);
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
    console.log(`OK ${f}: ${stat.size} bytes`);
  }
}

download().catch((err) => {
  console.error(err);
  process.exit(1);
});
