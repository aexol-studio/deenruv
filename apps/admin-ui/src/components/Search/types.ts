import { LogicalOperator, ModelTypes } from '@/zeus';

type FilterProps<T extends keyof ModelTypes> = {
  type: T;
  filter: ModelTypes[T] | undefined;
  setFilterField: (filterField: keyof ModelTypes[T], fieldValue: ModelTypes[T][keyof ModelTypes[T]]) => void;
  setFilter: (filter?: ModelTypes[T] | undefined) => void;
  removeFilterField: (filterField: keyof ModelTypes[T]) => void;
};

type AdministratorFilterProps = FilterProps<'AdministratorFilterParameter'>;
type AssetFilterProps = FilterProps<'AssetFilterParameter'>;
type CollectionFilterProps = FilterProps<'CollectionFilterParameter'>;
type FacetFilterProps = FilterProps<'FacetFilterParameter'>;
type OrderFilterProps = FilterProps<'OrderFilterParameter'>;
type ProductFilterProps = FilterProps<'ProductFilterParameter'>;
type RoleFilterProps = FilterProps<'RoleFilterParameter'>;
type CountriesFilterProps = FilterProps<'CountryFilterParameter'>;
type ChannelFilterProps = FilterProps<'ChannelFilterParameter'>;
type ZoneFilterProps = FilterProps<'ZoneFilterParameter'>;
type TaxCategoryFilterProps = FilterProps<'TaxCategoryFilterParameter'>;
type TaxRateFilterProps = FilterProps<'TaxRateFilterParameter'>;
type StockLocationFilterProps = FilterProps<'StockLocationFilterParameter'>;
type SellerFilterProps = FilterProps<'SellerFilterParameter'>;
type PaymentMethodFilterProps = FilterProps<'PaymentMethodFilterParameter'>;
type ShippingMethodFilterProps = FilterProps<'ShippingMethodFilterParameter'>;

type FilterLogicalOperation = {
  setFilterLogicalOperator: (to: LogicalOperator | undefined) => void;
};
export type SearchProps = (
  | OrderFilterProps
  | ProductFilterProps
  | CollectionFilterProps
  | FacetFilterProps
  | AssetFilterProps
  | CountriesFilterProps
  | AdministratorFilterProps
  | RoleFilterProps
  | ChannelFilterProps
  | ZoneFilterProps
  | TaxCategoryFilterProps
  | TaxRateFilterProps
  | StockLocationFilterProps
  | SellerFilterProps
  | PaymentMethodFilterProps
  | ShippingMethodFilterProps
) &
  FilterLogicalOperation;

type InputType = 'StringOperators' | 'IDOperators' | 'BooleanOperators' | 'DateOperators' | 'NumberOperators';

export const orderFilterFields: readonly {
  name: keyof Omit<ModelTypes['OrderFilterParameter'], 'aggregateOrderId' | 'getProforma'>;
  type: InputType;
}[] = [
  { name: 'active', type: 'BooleanOperators' },
  { name: 'additionalInformation', type: 'StringOperators' },
  { name: 'code', type: 'StringOperators' },
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'currencyCode', type: 'StringOperators' },
  { name: 'customerLastName', type: 'StringOperators' },
  { name: 'id', type: 'IDOperators' },
  { name: 'orderPlacedAt', type: 'DateOperators' },
  { name: 'shipping', type: 'NumberOperators' },
  { name: 'shippingWithTax', type: 'NumberOperators' },
  { name: 'state', type: 'StringOperators' },
  { name: 'subTotal', type: 'NumberOperators' },
  { name: 'subTotalWithTax', type: 'NumberOperators' },
  { name: 'total', type: 'NumberOperators' },
  { name: 'totalQuantity', type: 'NumberOperators' },
  { name: 'totalWithTax', type: 'NumberOperators' },
  { name: 'transactionId', type: 'StringOperators' },
  { name: 'type', type: 'StringOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'registeredOnCheckout', type: 'BooleanOperators' },
] as const;

export const productFilterFields: readonly {
  name: keyof Pick<
    ModelTypes['ProductFilterParameter'],
    'enabled' | 'id' | 'createdAt' | 'updatedAt' | 'name' | 'slug' | 'description'
  >;
  type: InputType;
}[] = [
  { name: 'enabled', type: 'BooleanOperators' },
  { name: 'id', type: 'IDOperators' },
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
  { name: 'slug', type: 'StringOperators' },
  { name: 'description', type: 'StringOperators' },
] as const;

export const collectionFilterFields: readonly {
  name: keyof Pick<
    ModelTypes['CollectionFilterParameter'],
    'isPrivate' | 'parentId' | 'position' | 'updatedAt' | 'createdAt' | 'slug' | 'name' | 'id'
  >;
  type: InputType;
}[] = [
  { name: 'id', type: 'IDOperators' },
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
  { name: 'slug', type: 'StringOperators' },
  { name: 'isPrivate', type: 'BooleanOperators' },
  { name: 'parentId', type: 'IDOperators' },
  { name: 'position', type: 'NumberOperators' },
] as const;

export const facetFilterFields: readonly {
  name: keyof Pick<
    ModelTypes['FacetFilterParameter'],
    | 'code'
    | 'usedForColors'
    | 'usedForProductCreations'
    | 'colorsCollection'
    | 'createdAt'
    | 'name'
    | 'id'
    | 'isPrivate'
    | 'updatedAt'
  >;
  type: InputType;
}[] = [
  { name: 'id', type: 'IDOperators' },
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
  { name: 'code', type: 'StringOperators' },
  { name: 'isPrivate', type: 'BooleanOperators' },
  { name: 'usedForProductCreations', type: 'BooleanOperators' },
  { name: 'usedForColors', type: 'BooleanOperators' },
  { name: 'colorsCollection', type: 'BooleanOperators' },
] as const;

export const countriesFilterFields: readonly {
  name: keyof Pick<
    ModelTypes['CountryFilterParameter'],
    'code' | 'enabled' | 'id' | 'name' | 'createdAt' | 'updatedAt'
  >;
  type: InputType;
}[] = [
  { name: 'id', type: 'IDOperators' },
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
  { name: 'code', type: 'StringOperators' },
  { name: 'enabled', type: 'BooleanOperators' },
] as const;

export const adminsFilterFields: readonly {
  name: keyof Pick<
    ModelTypes['AdministratorFilterParameter'],
    'createdAt' | 'updatedAt' | 'emailAddress' | 'firstName'
  >;
  type: InputType;
}[] = [
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'firstName', type: 'StringOperators' },
  { name: 'emailAddress', type: 'StringOperators' },
] as const;

export const roleFilterFields: readonly {
  name: keyof Pick<ModelTypes['RoleFilterParameter'], 'createdAt' | 'description' | 'updatedAt' | 'code'>;
  type: InputType;
}[] = [
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'description', type: 'StringOperators' },
  { name: 'code', type: 'StringOperators' },
] as const;

export const channelFilterFields: readonly {
  name: keyof Pick<ModelTypes['ChannelFilterParameter'], 'createdAt' | 'code' | 'updatedAt' | 'token'>;
  type: InputType;
}[] = [
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'token', type: 'StringOperators' },
  { name: 'code', type: 'StringOperators' },
] as const;

export const zoneFilterFields: readonly {
  name: keyof Pick<ModelTypes['ZoneFilterParameter'], 'createdAt' | 'name' | 'updatedAt'>;
  type: InputType;
}[] = [
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
] as const;

export const taxCategoryFilterFields: readonly {
  name: keyof Pick<ModelTypes['TaxCategoryFilterParameter'], 'createdAt' | 'name' | 'updatedAt'>;
  type: InputType;
}[] = [
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
] as const;

export const taxRateFilterFields: readonly {
  name: keyof Pick<ModelTypes['TaxRateFilterParameter'], 'createdAt' | 'name' | 'updatedAt' | 'value' | 'enabled'>;
  type: InputType;
}[] = [
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
  { name: 'value', type: 'NumberOperators' },
  { name: 'enabled', type: 'BooleanOperators' },
] as const;

export const stockLocationFilterFields: readonly {
  name: keyof Pick<ModelTypes['StockLocationFilterParameter'], 'createdAt' | 'name' | 'updatedAt' | 'description'>;
  type: InputType;
}[] = [
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
  { name: 'description', type: 'StringOperators' },
] as const;

export const sellerFilterFields: readonly {
  name: keyof Pick<ModelTypes['SellerFilterParameter'], 'createdAt' | 'name' | 'updatedAt'>;
  type: InputType;
}[] = [
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
] as const;

export const paymentMethodFilterFields: readonly {
  name: keyof Pick<
    ModelTypes['PaymentMethodFilterParameter'],
    'createdAt' | 'name' | 'updatedAt' | 'enabled' | 'code' | 'modalTitle'
  >;
  type: InputType;
}[] = [
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
  { name: 'code', type: 'StringOperators' },
  { name: 'enabled', type: 'BooleanOperators' },
  { name: 'modalTitle', type: 'StringOperators' },
] as const;

export const shippingMethodFilterFields: readonly {
  name: keyof Pick<
    ModelTypes['ShippingMethodFilterParameter'],
    'createdAt' | 'name' | 'updatedAt' | 'code' | 'modalTitle'
  >;
  type: InputType;
}[] = [
  { name: 'createdAt', type: 'DateOperators' },
  { name: 'updatedAt', type: 'DateOperators' },
  { name: 'name', type: 'StringOperators' },
  { name: 'code', type: 'StringOperators' },
  { name: 'modalTitle', type: 'StringOperators' },
] as const;
