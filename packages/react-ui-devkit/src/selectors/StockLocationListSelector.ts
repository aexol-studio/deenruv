import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const StockLocationListSelector = Selector('StockLocation')({
    id: true,
    name: true,
    updatedAt: true,
    createdAt: true,
    description: true
});
export type StockLocationListType = FromSelectorWithScalars<typeof StockLocationListSelector, 'Product'>;
