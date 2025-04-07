import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const PromotionListSelector = Selector("Promotion")({
  id: true,
  name: true,
  updatedAt: true,
  enabled: true,
  createdAt: true,
});
export type PromotionListType = FromSelectorWithScalars<
  typeof PromotionListSelector,
  "Promotion"
>;
