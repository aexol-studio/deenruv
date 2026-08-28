import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import en from "./locales/en/test.json";
import pl from "./locales/pl/test.json";
import { widgets } from "./widgets";
import {
  formatCustomMetricDate,
  formatVariantId,
} from "./translation-formatters";

const leafKeys = (value: object, prefix = ""): string[] =>
  Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object"
      ? leafKeys(child as object, path)
      : [path];
  });

describe("Dashboard Widgets admin translations", () => {
  it("keeps English and Polish locale keys in recursive parity", () => {
    expect(leafKeys(en).sort()).toEqual(leafKeys(pl).sort());
  });

  it("uses the runtime lastYear key casing", () => {
    expect(en.lastYear).toBe("Last year");
    expect(en).not.toHaveProperty("LastYear");
  });

  it("formats custom dates and variant IDs in the active language", () => {
    const date = new Date(2024, 0, 2);

    expect(formatCustomMetricDate(date, "en")).toBe("2 January 2024");
    expect(formatCustomMetricDate(date, "pl")).toBe("2 stycznia 2024");
    expect(formatVariantId(en.variantID, "42")).toBe("(Variant ID: 42)");
    expect(formatVariantId(pl.variantID, "42")).toBe("(ID wariantu: 42)");
  });

  it("declares relative chooser label keys without browser getters", () => {
    expect(
      widgets.map(({ id, name, labelId }) => ({ id, name, labelId })),
    ).toEqual([
      { id: "2", name: "Orders Widget", labelId: "widgets.orders" },
      { id: "3", name: "Products Widget", labelId: "widgets.products" },
      { id: "4", name: "Categories Widget", labelId: "widgets.categories" },
      {
        id: "5",
        name: "Latest Orders Widget",
        labelId: "widgets.latestOrders",
      },
    ]);
    expect(globalThis.window).toBeUndefined();
  });

  it("uses the UI translation language and the devkit translation wrapper", () => {
    const latestOrders = readFileSync(
      fileURLToPath(
        new URL("./components/LatestOrdersWidget/index.tsx", import.meta.url),
      ),
      "utf8",
    );
    const wrappedComponents = [
      "./components/OrdersWidget/GroupBySelect.tsx",
      "./components/ProductsChartWidget/CustomBarChartTooltip.tsx",
    ].map((path) =>
      readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8"),
    );

    expect(latestOrders).toContain("i18n.resolvedLanguage ?? i18n.language");
    expect(latestOrders).not.toContain("context?.translationsLanguage");
    expect(latestOrders).not.toContain("context?.language");
    for (const source of wrappedComponents) {
      expect(source).toContain('from "@deenruv/react-ui-devkit"');
      expect(source).not.toContain('from "react-i18next"');
      expect(source).not.toContain("window.__DEENRUV_SETTINGS__");
    }
  });
});
