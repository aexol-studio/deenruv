import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@deenruv/admin-types';

export const PaymentMethodListSelector = Selector('PaymentMethod')({
  id: true,
  name: true,
  enabled: true,
  code: true,
  // customFields: {
  //   modalTitle: true,
  // },
  createdAt: true,
  updatedAt: true,
});

export type PaymentMethodListType = FromSelectorWithScalars<typeof PaymentMethodListSelector, 'PaymentMethod'>;

export const PaymentMethodDetailsSelector = Selector('PaymentMethod')({
  id: true,
  name: true,
  enabled: true,
  code: true,
  handler: {
    code: true,
    args: {
      name: true,
      value: true,
    },
  },
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
  createdAt: true,
  updatedAt: true,
  translations: {
    name: true,
    languageCode: true,
    description: true,
    // customFields: {
    //   modalTitle: true,
    //   modalDescription: true,
    //   modalAdditionalDescription: true,
    // },
  },
});

export type PaymentMethodDetailsType = FromSelectorWithScalars<typeof PaymentMethodDetailsSelector, 'PaymentMethod'>;

export const PaymentMethodHandlerSelector = Selector('ConfigurableOperationDefinition')({
  code: true,
  description: true,
  args: {
    name: true,
    defaultValue: true,
    label: true,
    type: true,
    description: true,
    list: true,
    ui: true,
    required: true,
  },
});

export type PaymentMethodHandlerType = FromSelectorWithScalars<
  typeof PaymentMethodHandlerSelector,
  'ConfigurableOperationDefinition'
>;
