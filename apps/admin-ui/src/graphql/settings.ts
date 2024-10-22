import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@deenruv/admin-types';

export const CountrySelector = Selector('Country')({
  createdAt: true,
  updatedAt: true,
  code: true,
  enabled: true,
  id: true,
  name: true,
});
export type CountryListType = FromSelectorWithScalars<typeof CountrySelector, 'Country'>;
