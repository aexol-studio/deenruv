import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@/zeus';

export const TaxRateListSelector = Selector('TaxRate')({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  category: {
    name: true,
  },
  enabled: true,
  zone: {
    name: true,
  },
  value: true,
  customerGroup: {
    name: true,
  },
});

export type TaxRateListType = FromSelectorWithScalars<typeof TaxRateListSelector, 'TaxRate'>;

export const TaxRateDetailsSelector = Selector('TaxRate')({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  category: {
    name: true,
    id: true,
  },
  enabled: true,
  zone: {
    name: true,
    id: true,
  },
  value: true,
  customerGroup: {
    name: true,
    id: true,
  },
});

export type TaxRateDetailsType = FromSelectorWithScalars<typeof TaxRateDetailsSelector, 'TaxRate'>;
