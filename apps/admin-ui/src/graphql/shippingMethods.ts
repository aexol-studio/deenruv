import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@/zeus';

export const ShippingMethodListSelector = Selector('ShippingMethod')({
  id: true,
  name: true,
  code: true,
  // customFields: {
  //   modalTitle: true,
  // },
  createdAt: true,
  updatedAt: true,
});

export type ShippingMethodListType = FromSelectorWithScalars<typeof ShippingMethodListSelector, 'ShippingMethod'>;

export const ShippingMethodDetailsSelector = Selector('ShippingMethod')({
  id: true,
  name: true,
  code: true,
  description: true,
  checker: {
    code: true,
    args: {
      name: true,
      value: true,
    },
  },
  // customFields: {
  //   modalTitle: true,
  //   modalAdditionalDescription: true,
  //   modalDescription: true,
  // },
  calculator: {
    args: {
      name: true,
      value: true,
    },
    code: true,
  },
  fulfillmentHandlerCode: true,
  createdAt: true,
  updatedAt: true,
  translations: {
    name: true,
    description: true,
    languageCode: true,
    // customFields: {
    //   modalTitle: true,
    //   modalDescription: true,
    //   modalAdditionalDescription: true,
    // },
  },
});

export type ShippingMethodDetailsType = FromSelectorWithScalars<typeof ShippingMethodDetailsSelector, 'ShippingMethod'>;
