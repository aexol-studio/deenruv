import { Permission } from '@deenruv/admin-types';
import { Table } from '@tanstack/react-table';

type ActionResult = { success: string; error?: never } | { success?: never; error: string };

type ActionBaseProps<T> = {
    table: Table<T>;
    refetch: () => void;
};

type RowActionProps<T> = ActionBaseProps<T> & {
    data: T;
};

type BulkActionProps<T> = ActionBaseProps<T> & {
    data: T[];
};

type ActionDefinition<P> = {
    label: string;
    onClick: (props: P) => Promise<ActionResult> | ActionResult;
};

type RouteConfig =
    | { list: string; new: string; route: string; to: (id: string) => string }
    | { create?: () => void; edit: (id: string, parentId?: string) => void };

export type GenericListContextType<T> = {
    route: RouteConfig;
    onRemove?: (items: T[]) => void;
    refetch: () => void;
    deletePermission: Permission;
    hideColumns?: (keyof T)[];
    rowActions?: ActionDefinition<RowActionProps<T>>[];
    bulkActions?: ActionDefinition<BulkActionProps<T>>[];
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

export const ListTypeKeys = {
    administrators: 'AdministratorFilterParameter' as const,
    jobs: 'JobFilterParameter' as const,
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
    productVariants: 'ProductVariantFilterParameter' as const,
    roles: 'RoleFilterParameter' as const,
    sellers: 'SellerFilterParameter' as const,
    shippingMethods: 'ShippingMethodFilterParameter' as const,
    stockLocations: 'StockLocationFilterParameter' as const,
    taxCategories: 'TaxCategoryFilterParameter' as const,
    taxRates: 'TaxRateFilterParameter' as const,
    zones: 'ZoneFilterParameter' as const,
    promotions: 'PromotionFilterParameter' as const,
    customers: 'CustomerFilterParameter' as const,
    customerGroups: 'CustomerGroupFilterParameter' as const,
};

export type ListType = typeof ListTypeKeys;
