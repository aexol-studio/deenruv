import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const GlobalSettingsDetailSelector = Selector("GlobalSettings")({
  id: true,
  createdAt: true,
  updatedAt: true,
  availableLanguages: true,
  outOfStockThreshold: true,
  trackInventory: true,
});

export type GlobalSettingsType = FromSelectorWithScalars<
  typeof GlobalSettingsDetailSelector,
  "GlobalSettings"
>;
