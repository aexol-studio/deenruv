import { Selector } from "@deenruv/admin-types";
import type { FromSelectorWithScalars } from "@deenruv/admin-types";

export const ProductSelector = Selector("Product")({
  id: true,
  name: true,
  slug: true,
  featuredAsset: {
    id: true,
    preview: true,
  },
});

export const ProductVariantSelector = Selector("ProductVariant")({
  id: true,
  name: true,
  sku: true,
  featuredAsset: {
    id: true,
    preview: true,
  },
  product: {
    featuredAsset: {
      id: true,
      preview: true,
    },
  },
});

export const AssetSelector = Selector("Asset")({
  id: true,
  name: true,
  preview: true,
});

export const PaymentMethodSelector = Selector("PaymentMethod")({
  id: true,
  name: true,
  code: true,
});

export const customFieldSelectors = {
  Asset: AssetSelector,
  Product: ProductSelector,
  ProductVariant: ProductVariantSelector,
  PaymentMethod: PaymentMethodSelector,
};

export type CustomFieldSelectorsType = {
  [K in keyof typeof customFieldSelectors]: FromSelectorWithScalars<
    (typeof customFieldSelectors)[K],
    K
  >;
};
