import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const ProductVariantsListSelector = Selector('ProductVariant')({
    id: true,
    name: true,
    updatedAt: true,
    enabled: true,
    createdAt: true,
});
export type ProductVariantsListType = FromSelectorWithScalars<
    typeof ProductVariantsListSelector,
    'ProductVariant'
>;
