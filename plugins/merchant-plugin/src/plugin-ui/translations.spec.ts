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

const source = ["./pages/GooglePage.tsx", "./pages/FacebookPage.tsx"]
  .map((relativePath) =>
    readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8"),
  )
  .join("\n");

describe("merchant plugin translations", () => {
  const en = readJson("./locales/en/merchant.json");
  const pl = readJson("./locales/pl/merchant.json");

  it("keeps complete recursive EN/PL key parity", () => {
    expect(flattenKeys(pl).sort()).toEqual(flattenKeys(en).sort());
  });

  it("defines every statically referenced translation key", () => {
    const referencedKeys = Array.from(
      source.matchAll(/\bt\("([^"]+)"/g),
      (match) => match[1],
    );
    const availableKeys = new Set(flattenKeys(en));

    expect(referencedKeys.length).toBeGreaterThan(0);
    expect(referencedKeys.filter((key) => !availableKeys.has(key))).toEqual([]);
  });

  it("preserves platform brands and translates the Polish navigation group", () => {
    expect(en.nav).toMatchObject({
      googleMerchant: "Google Merchant",
      facebookCommerce: "Facebook Commerce",
    });
    expect(pl.nav).toMatchObject({
      googleMerchant: "Google Merchant",
      facebookCommerce: "Facebook Commerce",
      merchantPlatforms: "Platformy sprzedażowe",
    });
  });

  it("formats Google synchronization timestamps in the active UI language", () => {
    expect(source).toContain("toLocaleString(i18n.language)");
  });

  it("does not reintroduce audited hard-coded shell copy", () => {
    for (const literal of [
      ">Brand<",
      ">Save<",
      ">Connection status<",
      ">Remove old items<",
      'toast.success("Settings saved successfully")',
      'toast.error("Failed to save settings")',
      ">Recent synchronizations<",
      ">No synchronization history<",
    ]) {
      expect(source).not.toContain(literal);
    }
  });
});
