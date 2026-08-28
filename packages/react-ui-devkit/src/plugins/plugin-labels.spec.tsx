import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { createRequire } from "node:module";
import { URL } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./default-input-components.js", () => ({
  defaultInputComponents: {},
}));

import { PluginStore } from "./plugin-store.js";
import {
  type DeenruvUIPlugin,
  type PluginLabelDefinition,
  translatePluginLabel,
} from "./types.js";
import { useTranslation } from "../hooks/useTranslation.js";

const translations: Record<"en" | "pl", Record<string, string>> = {
  en: { "tab.extra": "Extras", "widget.orders": "Orders" },
  pl: { "tab.extra": "Dodatki", "widget.orders": "Zamówienia" },
};

type TestI18nextInstance = {
  init: (options: object) => Promise<unknown>;
  changeLanguage: (language: string) => Promise<unknown>;
};

type TestI18nextModule = {
  createInstance: () => TestI18nextInstance;
};

const runtimeRequire = createRequire(
  new URL("../../../admin-dashboard/package.json", import.meta.url),
);
const { createInstance } = runtimeRequire("i18next") as TestI18nextModule;

describe("declarative plugin labels", () => {
  let renderer: ReactTestRenderer | undefined;

  afterEach(async () => {
    if (renderer) {
      await act(() => renderer?.unmount());
      renderer = undefined;
    }
    vi.unstubAllGlobals();
  });

  it("resolves PluginStore metadata and reacts to an actual language change", async () => {
    const plugin: DeenruvUIPlugin = {
      name: "Labels plugin",
      version: "test",
      translations: { ns: "labels", data: { en: [], pl: [] } },
      tabs: [
        {
          id: "products-detail-view",
          name: "extra",
          label: "Legacy extras",
          labelId: "tab.extra",
          component: null,
        },
      ],
      widgets: [
        {
          id: "orders",
          name: "Legacy orders",
          labelId: "widget.orders",
          component: <div />,
          visible: true,
          size: { width: 1, height: 1 },
          sizes: [{ width: 1, height: 1 }],
        },
      ],
    };
    const store = new PluginStore();
    store.install([plugin], { addResourceBundle: vi.fn() });

    const tab = store.getDetailViewTabs("products-detail-view")[0];
    const widget = store.widgets[0];
    const i18n = createInstance();
    await i18n.init({
      lng: "en",
      fallbackLng: "en",
      resources: {
        en: { labels: translations.en },
        pl: { labels: translations.pl },
      },
    });
    vi.stubGlobal("window", { __DEENRUV_SETTINGS__: { i18n } });
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const Labels = ({
      tabDefinition,
      tabFallback,
      widgetDefinition,
      widgetFallback,
    }: {
      tabDefinition: PluginLabelDefinition;
      tabFallback: string;
      widgetDefinition: PluginLabelDefinition;
      widgetFallback: string;
    }) => {
      const { t } = useTranslation();
      const labels = React.useMemo(
        () => [
          translatePluginLabel(tabDefinition, tabFallback, t),
          translatePluginLabel(widgetDefinition, widgetFallback, t),
        ],
        [t, tabDefinition, tabFallback, widgetDefinition, widgetFallback],
      );

      return (
        <>
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </>
      );
    };

    expect(tab).toMatchObject({
      labelId: "tab.extra",
      translationNamespace: "labels",
      fullLabelId: "labels.tab.extra",
    });
    expect(widget).toMatchObject({
      labelId: "widget.orders",
      translationNamespace: "labels",
      fullLabelId: "labels.widget.orders",
    });
    await act(() => {
      renderer = create(
        <Labels
          tabDefinition={tab}
          tabFallback={tab.label}
          widgetDefinition={widget}
          widgetFallback={widget.name}
        />,
      );
    });
    if (!renderer) {
      throw new Error("Expected the plugin label consumer to mount");
    }
    const mountedRenderer = renderer;
    expect(renderer.toJSON()).toEqual([
      { type: "span", props: {}, children: ["Extras"] },
      { type: "span", props: {}, children: ["Orders"] },
    ]);

    await act(async () => {
      await i18n.changeLanguage("pl");
    });
    expect(renderer).toBe(mountedRenderer);
    expect(renderer.toJSON()).toEqual([
      { type: "span", props: {}, children: ["Dodatki"] },
      { type: "span", props: {}, children: ["Zamówienia"] },
    ]);
  });

  it("preserves legacy labels and imports without a browser global", () => {
    const store = new PluginStore();
    store.install(
      [
        {
          name: "Legacy plugin",
          version: "test",
          tabs: [
            {
              id: "products-detail-view",
              name: "legacy",
              label: "Legacy label",
              component: null,
            },
          ],
        },
      ],
      { addResourceBundle: vi.fn() },
    );
    const tab = store.getDetailViewTabs("products-detail-view")[0];

    expect(globalThis.window).toBeUndefined();
    expect(translatePluginLabel(tab, tab.label, vi.fn())).toBe("Legacy label");
  });

  it("renders the shared consumer contract during SSR without window", () => {
    const warning = vi
      .spyOn(globalThis.console, "warn")
      .mockImplementation(() => undefined);
    const Label = () => {
      const { t } = useTranslation();
      return (
        <span>
          {translatePluginLabel(
            {
              labelId: "tab.extra",
              translationNamespace: "labels",
              fullLabelId: "labels.tab.extra",
            },
            "SSR fallback",
            t,
          )}
        </span>
      );
    };

    expect(globalThis.window).toBeUndefined();
    expect(renderToStaticMarkup(<Label />)).toBe("<span>SSR fallback</span>");
    warning.mockRestore();
  });
});
