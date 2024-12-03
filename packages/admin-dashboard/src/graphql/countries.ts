import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@deenruv/admin-types';

export const CountryDetailsSelector = Selector('Country')({
  id: true,
  name: true,
  code: true,
  enabled: true,
  translations: {
    languageCode: true,
    name: true,
  },
  createdAt: true,
  updatedAt: true,
});

export type CountryDetailsType = FromSelectorWithScalars<typeof CountryDetailsSelector, 'Country'>;
