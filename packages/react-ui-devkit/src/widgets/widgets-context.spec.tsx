import React from "react";
import { describe, expect, it } from "vitest";

import type { Widget } from "../plugins/types.js";
import { mergePersistedWidgets } from "./widgets-context.js";

describe("widget persistence hydration", () => {
  it("restores mutable layout while retaining current widget metadata", () => {
    const component = <div>Current component</div>;
    const current: Widget[] = [
      {
        id: "orders",
        name: "Orders Widget",
        labelId: "widgets.orders",
        translationNamespace: "dashboard-widgets-plugin",
        fullLabelId: "dashboard-widgets-plugin.widgets.orders",
        component,
        visible: true,
        size: { width: 12, height: 8 },
        sizes: [{ width: 12, height: 8 }],
      },
    ];
    const legacyPersisted = [
      {
        id: "orders",
        name: "Stale name",
        labelId: "stale.label",
        translationNamespace: "stale-namespace",
        fullLabelId: "stale-namespace.stale.label",
        component: "stale component",
        visible: false,
        size: { width: 6, height: 4 },
        sizes: [{ width: 1, height: 1 }],
      },
    ];

    expect(mergePersistedWidgets(current, legacyPersisted)).toEqual([
      {
        ...current[0],
        visible: false,
        size: { width: 6, height: 4 },
      },
    ]);
    expect(mergePersistedWidgets(current, legacyPersisted)[0].component).toBe(
      component,
    );
  });
});
