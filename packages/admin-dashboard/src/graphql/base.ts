import { CollectionTileProductVariantType, CollectionTileType } from '@/graphql/collections';
import { productVariantTileSelector } from '@/graphql/products';
import { FromSelectorWithScalars } from '@/graphql/scalars';
import { CustomFieldConfigSelector, Selector, SortOrder } from '@deenruv/admin-types';

export enum ORDER_STATE {
  CREATED = 'Created',
  DRAFT = 'Draft',
  ADDING_ITEMS = 'AddingItems',
  ARRANGING_PAYMENT = 'ArrangingPayment',
  PAYMENT_AUTHORIZED = 'PaymentAuthorized',
  PAYMENT_SETTLED = 'PaymentSettled',
  PARTIALLY_SHIPPED = 'PartiallyShipped',
  SHIPPED = 'Shipped',
  PARTIALLY_DELIVERED = 'PartiallyDelivered',
  DELIVERED = 'Delivered',
  MODIFYING = 'Modifying',
  ARRANGING_ADDITIONAL_PAYMENT = 'ArrangingAdditionalPayment',
  CANCELLED = 'Cancelled',
}

export enum PAYMENT_STATE {
  AUTHORIZED = 'Authorized',
  SETTLED = 'Settled',
  CANCELLED = 'Cancelled',
}

export type OrderStateType = `${ORDER_STATE}`;
export enum ORDER_TYPE {
  REGULAR = 'Regular',
  AGGREGATE = 'Aggregate',
  SELLER = 'Seller',
}

export type OrderType = `${ORDER_TYPE}`;

export type NavigationType = CollectionTileType & {
  productVariants?: {
    items: CollectionTileProductVariantType[];
    totalItems: number;
  };
};

export const assetsSelector = Selector('Asset')({
  id: true,
  createdAt: true,
  fileSize: true,
  focalPoint: { x: true, y: true },
  width: true,
  height: true,
  mimeType: true,
  preview: true,
  source: true,
  name: true,
});

export type AssetType = FromSelectorWithScalars<typeof assetsSelector, 'Asset'>;

export type CustomFieldConfigType = FromSelectorWithScalars<typeof CustomFieldConfigSelector, 'CustomFieldConfig'>;

export const AvailableCountriesSelector = Selector('Country')({
  code: true,
  name: true,
  languageCode: true,
});
export type AvailableCountriesType = FromSelectorWithScalars<typeof AvailableCountriesSelector, 'Country'>;

export const OrderAddressSelector = Selector('OrderAddress')({
  fullName: true,
  company: true,
  streetLine1: true,
  streetLine2: true,
  city: true,
  province: true,
  postalCode: true,
  phoneNumber: true,
});

export type OrderAddressType = FromSelectorWithScalars<typeof OrderAddressSelector, 'OrderAddress'>;

export const ActiveAddressSelector = Selector('Address')({
  ...OrderAddressSelector,
  id: true,
  country: AvailableCountriesSelector,
  defaultShippingAddress: true,
  defaultBillingAddress: true,
});

export type ActiveAddressType = FromSelectorWithScalars<typeof ActiveAddressSelector, 'Address'>;

export const CurrentUserSelector = Selector('CurrentUser')({
  id: true,
  identifier: true,
});

export type CurrentUserType = FromSelectorWithScalars<typeof CurrentUserSelector, 'CurrentUser'>;

export const ActiveCustomerSelector = Selector('Customer')({
  id: true,
  lastName: true,
  firstName: true,
  emailAddress: true,
  phoneNumber: true,
  addresses: ActiveAddressSelector,
  user: CurrentUserSelector,
});

export type ActiveCustomerType = FromSelectorWithScalars<typeof ActiveCustomerSelector, 'Customer'>;

export type LoginCustomerInputType = {
  emailAddress: string;
  password: string;
  rememberMe: boolean;
};

export const homePageSlidersSelector = Selector('Collection')({
  name: true,
  slug: true,
  parent: { slug: true },
  productVariants: [
    { options: { take: 8, sort: { priceWithTax: SortOrder.DESC } } },
    {
      totalItems: true,
      items: productVariantTileSelector,
    },
  ],
});

export type HomePageSlidersType = FromSelectorWithScalars<typeof homePageSlidersSelector, 'Collection'>;

export const AdminSettingsSelector = Selector('GlobalSettings')({
  availableLanguages: true,
});
