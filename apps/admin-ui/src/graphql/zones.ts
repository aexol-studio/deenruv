import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@/zeus';

export const ZoneListSelector = Selector('Zone')({
  id: true,
  name: true,
  members: {
    id: true,
  },
  createdAt: true,
  updatedAt: true,
});

export type ZoneListType = FromSelectorWithScalars<typeof ZoneListSelector, 'Zone'>;

export const ZoneDetailsSelector = Selector('Zone')({
  id: true,
  name: true,
  members: {
    id: true,
    code: true,
    name: true,
    enabled: true,
    createdAt: true,
    updatedAt: true,
  },
  createdAt: true,
  updatedAt: true,
});

export type ZoneDetailsType = FromSelectorWithScalars<typeof ZoneDetailsSelector, 'Zone'>;
