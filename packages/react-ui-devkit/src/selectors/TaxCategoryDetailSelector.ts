import { Selector } from '@deenruv/admin-types';
import type { FromSelectorWithScalars } from '@deenruv/admin-types';
import { COMMON_FIELDS } from './commonFields'

export const TaxCategoryDetailSelector = Selector('TaxCategory')({
    ...COMMON_FIELDS,
    isDefault: true
});

export type TaxCategoryDetailType = FromSelectorWithScalars<typeof TaxCategoryDetailSelector, 'TaxCategory'>;
