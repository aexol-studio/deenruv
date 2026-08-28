import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { describe, expect, it } from "vitest";

type TranslationTree = { [key: string]: string | TranslationTree };

const readJson = (relativePath: string): TranslationTree =>
  JSON.parse(
    readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8"),
  ) as TranslationTree;

const flattenKeys = (tree: TranslationTree, prefix = ""): string[] =>
  Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : flattenKeys(value, path);
  });

const componentSource = readFileSync(
  fileURLToPath(new URL("./components/UpsellSelect.tsx", import.meta.url)),
  "utf8",
);
const pluginSource = readFileSync(
  fileURLToPath(new URL("./index.tsx", import.meta.url)),
  "utf8",
);

describe("upsell plugin translations", () => {
  const en = readJson("./locales/en/upsell.json");
  const pl = readJson("./locales/pl/upsell.json");

  it("keeps complete recursive EN/PL key parity", () => {
    expect(flattenKeys(pl).sort()).toEqual(flattenKeys(en).sort());
  });

  it("defines every statically referenced translation key", () => {
    const referencedKeys = Array.from(
      componentSource.matchAll(/\bt\("([^"]+)"/g),
      (match) => match[1],
    );
    const availableKeys = new Set(flattenKeys(en));

    expect(referencedKeys.length).toBeGreaterThan(0);
    expect(referencedKeys.filter((key) => !availableKeys.has(key))).toEqual([]);
  });

  it("declares an SSR-safe product-detail tab translation key", () => {
    expect(pluginSource).toContain('labelId: "tab.extras"');
    expect(pluginSource).toContain('label: "Extras"');
    expect(pluginSource).not.toContain("get label()");
    expect(pluginSource).not.toContain("globalThis.window");
    expect(en.tab).toEqual({ extras: "Extras" });
    expect(pl.tab).toEqual({ extras: "Dodatki" });
  });

  it("does not reintroduce audited hard-coded shell copy", () => {
    for (const literal of [
      ">Upsell Products<",
      ">No image<",
      'aria-label="Remove upsell product"',
      ">View Product<",
      ">No upsell products<",
      "Add upsell products to increase average order value",
      'toast.error("No product selected")',
      'toast.success("Upsell product removed")',
    ]) {
      expect(componentSource).not.toContain(literal);
    }
  });
});
