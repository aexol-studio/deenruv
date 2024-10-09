import { ValueTypes } from '@/zeus';

type SortOptions =
  | AdminsSortOptions
  | ChannelsSortOptions
  | CollectionsSortOptions
  | CountriesSortOptions
  | FacetsSortOptions
  | OrdersSortOptions
  | PaymentMethodsSortOptions
  | ProductsSortOptions
  | RolesSortOptions
  | ShippingMethodsSortOptions
  | TaxCategoriesSortOptions
  | TaxRatesSortOptions
  | ZonesSortOptions;

export type ParamFilterFieldTuple<TSortOptions extends SortOptions> = [TSortOptions, Record<string, string>];

export type OrdersSortOptions = keyof ValueTypes['OrderSortParameter'];
export const ordersSortOptionsArray: readonly OrdersSortOptions[] = [
  'total',
  'code',
  'id',
  'customerLastName',
  'transactionId',
  'aggregateOrderId',
  'createdAt',
  'updatedAt',
  'orderPlacedAt',
  'state',
  'totalQuantity',
  'subTotal',
  'subTotalWithTax',
  'shipping',
  'shippingWithTax',
  'totalWithTax',
] as const;

export function isOrdersSortOptions(value: string): value is OrdersSortOptions {
  return ordersSortOptionsArray.some((i) => i === value);
}

export type CollectionsSortOptions = keyof ValueTypes['CollectionSortParameter'];
export const collectionsSortOptionsArray: readonly CollectionsSortOptions[] = [
  'createdAt',
  'updatedAt',
  'slug',
  'position',
  'parentId',
  'name',
  'id',
  'description',
] as const;

export function isCollectionsSortOptions(value: string): value is CollectionsSortOptions {
  return collectionsSortOptionsArray.some((i) => i === value);
}
export type ProductsSortOptions = keyof ValueTypes['ProductSortParameter'];
export const productsSortOptionsArray: readonly ProductsSortOptions[] = [
  'createdAt',
  'updatedAt',
  'slug',
  'name',
  'id',
  'description',
] as const;

export function isProductsSortOptions(value: string): value is ProductsSortOptions {
  return productsSortOptionsArray.some((i) => i === value);
}
export type FacetsSortOptions = keyof ValueTypes['FacetSortParameter'];
export const facetsSortOptionsArray: readonly FacetsSortOptions[] = [
  'createdAt',
  'updatedAt',
  'name',
  'id',
  'code',
] as const;
export function isFacetsSortOptions(value: string): value is FacetsSortOptions {
  return facetsSortOptionsArray.some((i) => i === value);
}

export type CountriesSortOptions = keyof ValueTypes['CountrySortParameter'];
export const countriesSortOptionsArray: readonly CountriesSortOptions[] = [
  'createdAt',
  'updatedAt',
  'name',
  'code',
] as const;
export function isCountriesSortOptions(value: string): value is CountriesSortOptions {
  return countriesSortOptionsArray.some((i) => i === value);
}

export type AdminsSortOptions = keyof ValueTypes['AdministratorSortParameter'];
export const adminsSortOptionsArray: readonly AdminsSortOptions[] = [
  'createdAt',
  'updatedAt',
  'firstName',
  'id',
  'emailAddress',
] as const;
export function isAdminsSortOptions(value: string): value is AdminsSortOptions {
  return adminsSortOptionsArray.some((i) => i === value);
}

export type RolesSortOptions = keyof ValueTypes['RoleSortParameter'];
export const rolesSortOptionsArray: readonly RolesSortOptions[] = [
  'createdAt',
  'updatedAt',
  'code',
  'description',
] as const;
export function isRolesSortOptions(value: string): value is RolesSortOptions {
  return rolesSortOptionsArray.some((i) => i === value);
}

export type ChannelsSortOptions = keyof ValueTypes['ChannelSortParameter'];
export const channelsSortOptionsArray: readonly ChannelsSortOptions[] = [
  'createdAt',
  'updatedAt',
  'code',
  'token',
] as const;
export function isChannelsSortOptions(value: string): value is ChannelsSortOptions {
  return channelsSortOptionsArray.some((i) => i === value);
}

export type ZonesSortOptions = keyof ValueTypes['ZoneSortParameter'];
export const zonesSortOptionsArray: readonly ZonesSortOptions[] = ['createdAt', 'updatedAt', 'name'] as const;
export function isZonesSortOptions(value: string): value is ZonesSortOptions {
  return zonesSortOptionsArray.some((i) => i === value);
}

export type TaxCategoriesSortOptions = keyof ValueTypes['TaxCategorySortParameter'];
export const taxCategoriesSortOptionsArray: readonly TaxCategoriesSortOptions[] = [
  'createdAt',
  'updatedAt',
  'name',
] as const;
export function isTaxCategorySortOptions(value: string): value is TaxCategoriesSortOptions {
  return taxCategoriesSortOptionsArray.some((i) => i === value);
}

export type TaxRatesSortOptions = keyof ValueTypes['TaxRateSortParameter'];
export const taxRatesSortOptionsArray: readonly TaxRatesSortOptions[] = [
  'createdAt',
  'updatedAt',
  'name',
  'value',
] as const;
export function isTaxRateSortOptions(value: string): value is TaxRatesSortOptions {
  return taxRatesSortOptionsArray.some((i) => i === value);
}

export type StockLocationsSortOptions = keyof ValueTypes['StockLocationSortParameter'];
export const stockLocationsSortOptionsArray: readonly StockLocationsSortOptions[] = [
  'createdAt',
  'updatedAt',
  'name',
  'description',
] as const;
export function isStockLocationsSortOptions(value: string): value is StockLocationsSortOptions {
  return stockLocationsSortOptionsArray.some((i) => i === value);
}

export type SellersSortOptions = keyof ValueTypes['SellerSortParameter'];
export const sellersSortOptionsArray: readonly SellersSortOptions[] = ['createdAt', 'updatedAt', 'name'] as const;
export function isSellersSortOptions(value: string): value is SellersSortOptions {
  return sellersSortOptionsArray.some((i) => i === value);
}

export type PaymentMethodsSortOptions = keyof ValueTypes['PaymentMethodSortParameter'];
export const paymentMethodsSortOptionsArray: readonly PaymentMethodsSortOptions[] = [
  'createdAt',
  'updatedAt',
  'name',
  'code',
  'modalTitle',
] as const;
export function isPaymentMethodsSortOptions(value: string): value is PaymentMethodsSortOptions {
  return paymentMethodsSortOptionsArray.some((i) => i === value);
}

export type ShippingMethodsSortOptions = keyof ValueTypes['ShippingMethodSortParameter'];
export const shippingMethodsSortOptionsArray: readonly ShippingMethodsSortOptions[] = [
  'createdAt',
  'updatedAt',
  'name',
  'code',
  'modalTitle',
] as const;
export function isShippingMethodsSortOptions(value: string): value is ShippingMethodsSortOptions {
  return shippingMethodsSortOptionsArray.some((i) => i === value);
}
