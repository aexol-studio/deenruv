import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@deenruv/admin-types';

export const CustomerGroupListSelector = Selector('CustomerGroup')({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

export type CustomerGroupListType = FromSelectorWithScalars<typeof CustomerGroupListSelector, 'CustomerGroup'>;
