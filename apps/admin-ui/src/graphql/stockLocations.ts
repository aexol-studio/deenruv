import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@/zeus';

export const StockLocationListSelector = Selector('StockLocation')({
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
});

export type StockLocationListType = FromSelectorWithScalars<typeof StockLocationListSelector, 'StockLocation'>;
