import { describe, expect, it } from "vitest";
import en from "./locales/en/reviews.json";
import pl from "./locales/pl/reviews.json";
import { getReviewStateLabel } from "./components/ReviewOrder";
import { ReviewState } from "./zeus";
import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

const leafKeys = (value: object, prefix = ""): string[] =>
  Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object"
      ? leafKeys(child as object, path)
      : [path];
  });

describe("Reviews admin translations", () => {
  it("keeps English and Polish locale keys in parity", () => {
    expect(leafKeys(en).sort()).toEqual(leafKeys(pl).sort());
  });

  it("localizes every backend review state without changing enum values", () => {
    const translate = (key: string) => `translated:${key}`;

    expect(getReviewStateLabel(ReviewState.PENDING, translate)).toBe(
      "translated:state.pending",
    );
    expect(getReviewStateLabel(ReviewState.ACCEPTED, translate)).toBe(
      "translated:state.accepted",
    );
    expect(getReviewStateLabel(ReviewState.DECLINED, translate)).toBe(
      "translated:state.declined",
    );
  });

  it("declares an SSR-safe customer tab translation key", async () => {
    const { ReviewsUIPlugin } = await import("./index");
    expect(ReviewsUIPlugin.tabs?.[0]).toMatchObject({
      name: "reviews",
      label: "Reviews",
      labelId: "nav.reviews",
    });
    expect(globalThis.window).toBeUndefined();
  });

  it("formats every visible review date in the active UI language", () => {
    const sources = [
      "./pages/Review.tsx",
      "./pages/Reviews.tsx",
      "./components/ReviewCustomer.tsx",
      "./components/ReviewOrder.tsx",
    ].map((path) =>
      readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8"),
    );

    expect(
      sources.reduce(
        (count, source) => count + (source.match(/formatDate\(/g)?.length ?? 0),
        0,
      ),
    ).toBe(7);
    for (const source of sources) {
      expect(
        source.match(/locale: i18n\.(?:resolvedLanguage|language)/g),
      ).toHaveLength(source.match(/formatDate\(/g)?.length ?? 0);
    }
  });
});
