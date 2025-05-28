import { Routes } from "../routes";
import type { FromSelectorWithScalars } from "@deenruv/admin-types";

import {
  CollectionListSelector,
  AdminListSelector,
  ChannelListSelector,
  CountryListSelector,
  CustomerGroupListSelector,
  CustomerListSelector,
  FacetListSelector,
  PaymentMethodListSelector,
  ProductListSelector,
  ProductVariantListSelector,
  PromotionListSelector,
  RoleListSelector,
  SellerListSelector,
  ShippingMethodListSelector,
  TaxCategoryListSelector,
  TaxRateListSelector,
  ZoneListSelector,
  FacetValueListSelector,
  OrderListSelector,
  StockLocationListSelector,
} from "@/selectors/lists/index.js";

import {
  OrderDetailSelector,
  OrderDetailType,
  TaxRateDetailsSelector,
  SellerDetailSelector,
  CountryDetailSelector,
  FacetDetailSelector,
  RoleDetailsSelector,
  PaymentMethodDetailsSelector,
  ShippingMethodDetailsSelector,
  CollectionDetailsSelector,
  CustomerGroupDetailSelector,
  TaxCategoryDetailSelector,
  StockLocationDetailSelector,
  PromotionDetailSelector,
  AdminDetailSelector,
  ChannelDetailsSelector,
  ZoneDetailsSelector,
  ProductDetailSelector,
  GlobalSettingsDetailSelector,
  CustomerDetailSelector,
} from "@/selectors/details/index.js";
import { AssetListSelector } from "@/selectors/lists/AssetListSelector.js";

type NotAvailablePages = "dashboard";
type RouteKeys = keyof Omit<typeof Routes, NotAvailablePages>;
export type ListLocationID = `${RouteKeys}-list-view`;

/** LISTS */
export const ListLocations = {
  "assets-list-view": {
    type: "Asset" as const,
    selector: AssetListSelector,
  },
  "admins-list-view": {
    type: "Administrator" as const,
    selector: AdminListSelector,
  },
  "channels-list-view": {
    type: "Channel" as const,
    selector: ChannelListSelector,
  },
  "collections-list-view": {
    type: "Collection" as const,
    selector: CollectionListSelector,
  },
  "countries-list-view": {
    type: "Country" as const,
    selector: CountryListSelector,
  },
  "customerGroups-list-view": {
    type: "CustomerGroup" as const,
    selector: CustomerGroupListSelector,
  },
  "customers-list-view": {
    type: "Customer" as const,
    selector: CustomerListSelector,
  },
  "facets-list-view": {
    type: "Facet" as const,
    selector: FacetListSelector,
  },
  "paymentMethods-list-view": {
    type: "PaymentMethod" as const,
    selector: PaymentMethodListSelector,
  },
  "products-list-view": {
    type: "Product" as const,
    selector: ProductListSelector,
  },
  "productVariants-list-view": {
    type: "ProductVariant" as const,
    selector: ProductVariantListSelector,
  },
  "promotions-list-view": {
    type: "Promotion" as const,
    selector: PromotionListSelector,
  },
  "roles-list-view": {
    type: "Role" as const,
    selector: RoleListSelector,
  },
  "sellers-list-view": {
    type: "Seller" as const,
    selector: SellerListSelector,
  },
  "shippingMethods-list-view": {
    type: "ShippingMethod" as const,
    selector: ShippingMethodListSelector,
  },
  "stockLocations-list": {
    type: "StockLocation" as const,
    selector: StockLocationListSelector,
  },
  "taxCategories-list-view": {
    type: "TaxCategory" as const,
    selector: TaxCategoryListSelector,
  },
  "taxRates-list-view": {
    type: "TaxRate" as const,
    selector: TaxRateListSelector,
  },
  "zones-list-view": {
    type: "Zone" as const,
    selector: ZoneListSelector,
  },
  "facet-values-list": {
    type: "FacetValue" as const,
    selector: FacetValueListSelector,
  },
  "orders-list-view": {
    type: "Order" as const,
    selector: OrderListSelector,
  },
  "stockLocations-list-view": {
    type: "StockLocation" as const,
    selector: StockLocationListSelector,
  },
};
type ListLocationType = typeof ListLocations;
export type LocationKeys = keyof ListLocationType;
export type ListLocationsType<KEY extends keyof typeof ListLocations> =
  FromSelectorWithScalars<
    (typeof ListLocations)[KEY]["selector"],
    (typeof ListLocations)[KEY]["type"]
  >;
export interface AdditionalListLocationSelector {}
export type ExternalListLocationSelector = AdditionalListLocationSelector & {
  [K in LocationKeys]: FromSelectorWithScalars<
    ListLocationType[K]["selector"],
    ListLocationType[K]["type"]
  >;
};

type CustomDetailLocations = "orders-summary" | string;
export type DetailLocationID =
  | `${RouteKeys}-detail-view`
  | CustomDetailLocations;
export type DetailLocationSidebarID = `${DetailLocationID}-sidebar`;
/** DETAILS */
export const DetailLocations = {
  "admins-detail-view": {
    type: "Administrator" as const,
    selector: AdminDetailSelector,
  },
  "products-detail-view": {
    type: "Product" as const,
    selector: ProductDetailSelector,
  },
  "paymentMethods-detail-view": {
    type: "PaymentMethod" as const,
    selector: PaymentMethodDetailsSelector,
  },
  "promotions-detail-view": {
    type: "Promotion" as const,
    selector: PromotionDetailSelector,
  },
  "channels-detail-view": {
    type: "Channel" as const,
    selector: ChannelDetailsSelector,
  },
  "collections-detail-view": {
    type: "Collection" as const,
    selector: CollectionDetailsSelector,
  },
  "countries-detail-view": {
    type: "Country" as const,
    selector: CountryDetailSelector,
  },
  "facets-detail-view": {
    type: "Facet" as const,
    selector: FacetDetailSelector,
  },
  "taxCategories-detail-view": {
    type: "TaxCategory" as const,
    selector: TaxCategoryDetailSelector,
  },
  "taxRates-detail-view": {
    type: "TaxRate" as const,
    selector: TaxRateDetailsSelector,
  },
  "shippingMethods-detail-view": {
    type: "ShippingMethod" as const,
    selector: ShippingMethodDetailsSelector,
  },
  "stockLocations-detail-view": {
    type: "StockLocation" as const,
    selector: StockLocationDetailSelector,
  },
  "customers-detail-view": {
    type: "Customer" as const,
    selector: CustomerDetailSelector,
  },
  "customerGroups-detail-view": {
    type: "CustomerGroup" as const,
    selector: CustomerGroupDetailSelector,
  },
  "orders-detail-view": {
    type: "Order" as const,
    selector: OrderDetailSelector,
  },
  "orders-summary": {
    type: "Order" as const,
    selector: OrderDetailSelector,
  },
  "globalSettings-detail-view": {
    type: "GlobalSettings" as const,
    selector: GlobalSettingsDetailSelector,
  },
  "zones-detail-view": {
    type: "Zone" as const,
    selector: ZoneDetailsSelector,
  },
  "roles-detail-view": {
    type: "Role" as const,
    selector: RoleDetailsSelector,
  },
  "sellers-detail-view": {
    type: "Seller" as const,
    selector: SellerDetailSelector,
  },
};
export type DetailLocationType = typeof DetailLocations;
export type DetailKeys = keyof DetailLocationType;
export type DetailLocationsType<KEY extends keyof typeof DetailLocations> =
  FromSelectorWithScalars<
    (typeof DetailLocations)[KEY]["selector"],
    (typeof DetailLocations)[KEY]["type"]
  >;
export interface AdditionalDetailLocationSelector {}
export type ExternalDetailLocationSelector =
  AdditionalDetailLocationSelector & {
    [K in DetailKeys]: FromSelectorWithScalars<
      DetailLocationType[K]["selector"],
      DetailLocationType[K]["type"]
    >;
  };

/** MODALS */
export const ModalLocations = {
  "manual-order-state": {
    type: "Order" as const,
    selector: OrderDetailSelector,
  },
};
export type ModalLocationsTypes = {
  "manual-order-state": {
    state: string;
    setState: (value: string) => void;
    beforeSubmit: React.MutableRefObject<
      (() => Promise<void> | undefined) | undefined
    >;
    order: OrderDetailType;
  };
};
export type ModalLocationType<KEY extends keyof typeof ModalLocations> =
  ModalLocationsTypes[KEY];
export type ModalLocationsKeys = keyof typeof ModalLocations;

export enum BASE_GROUP_ID {
  SHOP = "shop-group",
  ASSORTMENT = "assortment-group",
  USERS = "users-group",
  PROMOTIONS = "promotions-group",
  SHIPPING = "shipping-group",
  SETTINGS = "settings-group",
}
