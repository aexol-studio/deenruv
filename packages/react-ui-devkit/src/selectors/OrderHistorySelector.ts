import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const orderHistoryEntrySelector = Selector("HistoryEntry")({
  id: true,
  administrator: { id: true, firstName: true, lastName: true },
  isPublic: true,
  type: true,
  data: true,
  createdAt: true,
  updatedAt: true,
});

export type OrderHistoryEntryType = FromSelectorWithScalars<
  typeof orderHistoryEntrySelector,
  "HistoryEntry"
>;
