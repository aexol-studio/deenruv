import { Selector } from "@deenruv/admin-types";
import type { FromSelectorWithScalars } from "@deenruv/admin-types";

export const CustomerGroupDetailSelector = Selector("CustomerGroup")({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

export type CustomerGroupDetailType = FromSelectorWithScalars<
  typeof CustomerGroupDetailSelector,
  "CustomerGroup"
>;
