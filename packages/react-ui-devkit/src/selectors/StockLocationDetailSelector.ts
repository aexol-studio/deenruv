import { Selector } from '@deenruv/admin-types';
import type { FromSelectorWithScalars } from '@deenruv/admin-types';
import { COMMON_FIELDS } from './commonFields'

export const StockLocationDetailSelector = Selector('StockLocation')({
    ...COMMON_FIELDS,
    description: true,
});

export type StockLocationDetailType = FromSelectorWithScalars<typeof StockLocationDetailSelector, 'StockLocation'>;
