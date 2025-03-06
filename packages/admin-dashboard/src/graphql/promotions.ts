import { Selector } from '@deenruv/admin-types';
import { FromSelectorWithScalars } from '@/graphql/scalars';

export const PromotionsListSelector = Selector('Promotion')({
  id: true,
  name: true,
  couponCode: true,
  startsAt: true,
  endsAt: true,
  perCustomerUsageLimit: true,
  usageLimit: true,
});
export type PromotionsListType = FromSelectorWithScalars<typeof PromotionsListSelector, 'Promotion'>;

export const PromotionConditionAndActionSelector = Selector('ConfigurableOperationDefinition')({
  code: true,
  description: true,
  args: {
    defaultValue: true,
    description: true,
    name: true,
    label: true,
    list: true,
    type: true,
    required: true,
    ui: true,
  },
});
export type PromotionConditionAndActionType = FromSelectorWithScalars<
  typeof PromotionConditionAndActionSelector,
  'ConfigurableOperationDefinition'
>;
