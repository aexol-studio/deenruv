import { promises as fs } from "node:fs";
import path from "node:path";
import {
  type FileObject,
  printErrors,
  scanURLs,
  validateFiles,
} from "next-validate-link";

const CONTENT_ROOT = path.resolve(process.cwd(), "content/docs");

type DocsPage = {
  lang: "en" | "pl";
  slug: string[];
  url: string;
  absolutePath: string;
  content: string;
  hashes: string[];
};

function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/`/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractHeadings(content: string): string[] {
  const regex = /^#{1,6}\s+(.+)$/gm;
  const counts = new Map<string, number>();
  const hashes: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const base = slugifyHeading(match[1]);
    if (!base) continue;

    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);

    hashes.push(count === 0 ? base : `${base}-${count}`);
  }

  return hashes;
}

async function collectMdxFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectMdxFiles(fullPath);
      if (entry.isFile() && entry.name.endsWith(".mdx")) return [fullPath];
      return [] as string[];
    }),
  );

  return files.flat();
}

function toPage(filePath: string, content: string): DocsPage {
  const relative = path
    .relative(CONTENT_ROOT, filePath)
    .split(path.sep)
    .join("/");

  const lang: "en" | "pl" = relative.endsWith(".pl.mdx") ? "pl" : "en";
  const noExt = relative.replace(/(\.pl)?\.mdx$/, "");

  const slug = noExt.split("/").filter(Boolean);
  if (slug[slug.length - 1] === "index") {
    slug.pop();
  }

  const suffix = slug.length > 0 ? `/${slug.join("/")}` : "";
  const url = `/${lang}/docs${suffix}`;

  return {
    lang,
    slug,
    url,
    absolutePath: filePath,
    content,
    hashes: extractHeadings(content),
  };
}

async function getPages(): Promise<DocsPage[]> {
  const files = await collectMdxFiles(CONTENT_ROOT);
  const pages = await Promise.all(
    files.map(async (filePath) => {
      const content = await fs.readFile(filePath, "utf8");
      return toPage(filePath, content);
    }),
  );

  return pages;
}

async function checkLinks() {
  const pages = await getPages();

  const scanned = await scanURLs({
    preset: "next",
    populate: {
      "[lang]/docs/[[...slug]]": pages.map((page) => ({
        value: {
          lang: page.lang,
          slug: page.slug,
        },
        hashes: page.hashes,
      })),
      "docs/[[...slug]]": pages
        .filter((page) => page.lang === "en")
        .map((page) => ({
          value: {
            slug: page.slug,
          },
          hashes: page.hashes,
        })),
    },
  });

  const files: FileObject[] = pages.map((page) => ({
    path: page.absolutePath,
    content: page.content,
    url: page.url,
    data: {
      lang: page.lang,
    },
  }));

  printErrors(
    await validateFiles(files, {
      scanned,
      markdown: {
        components: {
          Card: { attributes: ["href"] },
        },
      },
      checkRelativePaths: "as-url",
    }),
    true,
  );
}

void checkLinks();
