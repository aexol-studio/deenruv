import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = path.resolve(__dirname, '../../');
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md');
const DOCS_DIR = path.join(ROOT, 'apps/docs/content/docs/guides/getting-started');

const EN_FRONTMATTER = `---
title: "Changelog"
description: "Release history and changes for each version of Deenruv"
---

{/* This page is auto-generated from the root CHANGELOG.md — do not edit manually. */}
{/* Run: pnpm changelog:sync-docs */}

`;

const PL_FRONTMATTER = `---
title: "Historia zmian"
description: "Historia wydań i zmiany w każdej wersji Deenruv"
---

{/* Ta strona jest generowana automatycznie z głównego pliku CHANGELOG.md — nie edytuj ręcznie. */}
{/* Uruchom: pnpm changelog:sync-docs */}

`;

/**
 * Escape angle-bracket tokens that MDX would parse as JSX components.
 *
 * Targets `<UpperCase…>` / `</UpperCase…>` that appear **outside** of:
 *   - inline code (`…`)
 *   - fenced code blocks (``` … ```)
 *   - MDX comments ({/* … *\/})
 *
 * Lowercase tags like `<small>`, `<a>`, `<div>` are left untouched
 * because they are valid HTML elements that MDX handles natively.
 */
function escapeJsxLikeTokens(md: string): string {
  const lines = md.split('\n');
  let inFencedBlock = false;
  const result: string[] = [];

  for (const line of lines) {
    // Track fenced code blocks (``` or ~~~)
    if (/^(`{3,}|~{3,})/.test(line.trimStart())) {
      inFencedBlock = !inFencedBlock;
      result.push(line);
      continue;
    }

    if (inFencedBlock) {
      result.push(line);
      continue;
    }

    // Process the line: split into code-spans vs. prose segments.
    // We only escape tokens that live in prose (outside backtick spans).
    const segments = line.split(/(`[^`]*`)/);
    const escaped = segments
      .map((seg, i) => {
        // Odd-indexed segments are inside backticks — leave them alone
        if (i % 2 === 1) return seg;
        // In prose: escape <Uppercase…> and </Uppercase…>
        return seg.replace(/<(\/?)([A-Z][A-Za-z0-9.]*)/g, '\\<$1$2');
      })
      .join('');

    result.push(escaped);
  }

  return result.join('\n');
}

function main() {
  if (!fs.existsSync(CHANGELOG_PATH)) {
    console.error('Error: CHANGELOG.md not found at', CHANGELOG_PATH);
    process.exit(1);
  }

  const rawContent = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  const changelogContent = escapeJsxLikeTokens(rawContent);

  // EN page
  const enPath = path.join(DOCS_DIR, 'changelog.mdx');
  fs.writeFileSync(enPath, EN_FRONTMATTER + changelogContent, 'utf-8');
  console.log(`✓ Written ${enPath}`);

  // PL page — same content (changelog is in English), just different frontmatter
  const plPath = path.join(DOCS_DIR, 'changelog.pl.mdx');
  fs.writeFileSync(plPath, PL_FRONTMATTER + changelogContent, 'utf-8');
  console.log(`✓ Written ${plPath}`);
}

main();
