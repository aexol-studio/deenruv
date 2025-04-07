import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const ZoneListSelector = Selector("Zone")({
  id: true,
  name: true,
  members: { id: true },
  createdAt: true,
  updatedAt: true,
});

export type ZoneListType = FromSelectorWithScalars<
  typeof ZoneListSelector,
  "Zone"
>;
