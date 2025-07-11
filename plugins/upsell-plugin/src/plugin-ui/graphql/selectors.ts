import { FromSelector, Selector } from "../zeus";
import { scalars } from "./scalars";

export const upsellSelector = Selector("Product")({
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  featuredAsset: { preview: true },
});

export type UpsellType = FromSelector<
  typeof upsellSelector,
  "Product",
  typeof scalars
>;
