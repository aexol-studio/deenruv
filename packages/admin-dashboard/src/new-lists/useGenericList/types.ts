import { Table } from '@tanstack/react-table';

export type GenericListContextType<T> = {
  route: { list: string; new: string; route: string; to: (id: string) => string };
  onRemove: (items: T[]) => void;
  refetch: () => void;
  rowActions?: {
    label: string;
    onClick: (props: { table: Table<T>; refetch: () => void; data: T }) => { success: string } | { error: string };
  }[];
  bulkActions?: Array<{
    label: string;
    onClick: (props: {
      data: T[];
      refetch: () => void;
      table: Table<T>;
    }) => Promise<{ success: string } | { error: string }> | { success: string } | { error: string };
  }>;
};

export type LimitKeys =
  | '10perPage'
  | '25perPage'
  | '32perPage'
  | '48perPage'
  | '50perPage'
  | '64perPage'
  | '100perPage';

export type ItemsPerPageType = { name: LimitKeys; value: number }[];

export const ITEMS_PER_PAGE: ItemsPerPageType = [
  { name: '10perPage', value: 10 },
  { name: '25perPage', value: 25 },
  { name: '50perPage', value: 50 },
  { name: '100perPage', value: 100 },
];

export const enum SearchParamKey {
  SEARCH = 'q',
  PAGE = 'page',
  PER_PAGE = 'per',
  SORT = 'sort',
  SORT_DIR = 'dir',
  FILTER = 'filter',
  FILTER_OPERATOR = 'operator',
}

export const arrayRange = (start: number, stop: number) =>
  Array.from({ length: stop - start + 1 }, (_, index) => start + index);

export type ListType = {
  administrators: 'AdministratorFilterParameter';
  assets: 'AssetFilterParameter';
  channels: 'ChannelFilterParameter';
  collections: 'CollectionFilterParameter';
  'countries-list': 'CountryFilterParameter';
  facets: 'FacetFilterParameter';
  'modal-assets-list': 'AssetFilterParameter';
  'modal-product-variants-list': 'ProductVariantFilterParameter';
  'modal-products-list': 'ProductFilterParameter';
  orders: 'OrderFilterParameter';
  paymentMethods: 'PaymentMethodFilterParameter';
  products: 'ProductFilterParameter';
  promotions: 'PromotionFilterParameter';
  roles: 'RoleFilterParameter';
  sellers: 'SellerFilterParameter';
  shippingMethods: 'ShippingMethodFilterParameter';
  stockLocations: 'StockLocationFilterParameter';
  taxCategories: 'TaxCategoryFilterParameter';
  taxRates: 'TaxRateFilterParameter';
  zones: 'ZoneFilterParameter';
};

export const ListTypeKeys = {
  administrators: 'AdministratorFilterParameter' as const,
  assets: 'AssetFilterParameter' as const,
  channels: 'ChannelFilterParameter' as const,
  collections: 'CollectionFilterParameter' as const,
  'countries-list': 'CountryFilterParameter' as const,
  facets: 'FacetFilterParameter' as const,
  'modal-assets-list': 'AssetFilterParameter' as const,
  'modal-product-variants-list': 'ProductVariantFilterParameter' as const,
  'modal-products-list': 'ProductFilterParameter' as const,
  orders: 'OrderFilterParameter' as const,
  paymentMethods: 'PaymentMethodFilterParameter' as const,
  products: 'ProductFilterParameter' as const,
  roles: 'RoleFilterParameter' as const,
  sellers: 'SellerFilterParameter' as const,
  shippingMethods: 'ShippingMethodFilterParameter' as const,
  stockLocations: 'StockLocationFilterParameter' as const,
  taxCategories: 'TaxCategoryFilterParameter' as const,
  taxRates: 'TaxRateFilterParameter' as const,
  zones: 'ZoneFilterParameter' as const,
  promotions: 'PromotionFilterParameter' as const,
};
