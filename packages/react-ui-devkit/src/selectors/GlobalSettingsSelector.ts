import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const globalSettingsSelector = Selector('GlobalSettings')({
    id: true,
    createdAt: true,
    updatedAt: true,
    availableLanguages: true,
    outOfStockThreshold: true,
    trackInventory: true,
});

export type GlobalSettingsType = FromSelectorWithScalars<typeof globalSettingsSelector, 'GlobalSettings'>;
