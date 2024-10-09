import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@/zeus';

export const SellerListSelector = Selector('Seller')({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

export type SellerListType = FromSelectorWithScalars<typeof SellerListSelector, 'Seller'>;
