import { Selector } from "../zeus";

export const ProductsSelector = Selector("Product")({
  name: true,
  slug: true,
  id: true,
  description: true,
});
