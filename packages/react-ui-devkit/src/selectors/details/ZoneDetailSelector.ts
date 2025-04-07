import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const ZoneDetailsSelector = Selector("Zone")({
  id: true,
  name: true,
  members: {
    id: true,
    code: true,
    name: true,
    enabled: true,
    createdAt: true,
    updatedAt: true,
  },
  createdAt: true,
  updatedAt: true,
});

export type ZoneDetailsType = FromSelectorWithScalars<
  typeof ZoneDetailsSelector,
  "Zone"
>;
