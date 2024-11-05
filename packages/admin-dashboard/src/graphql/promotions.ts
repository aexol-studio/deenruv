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
