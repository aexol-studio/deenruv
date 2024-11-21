import { FromSelector, Selector } from '../zeus';

const FacetValueOptionsSelector = Selector('FacetValue')({
    id: true,
    name: true,
    code: true,
    customFields: {
      hexColor: true,
      image: {
        preview: true,
      },
      isNew: true,
    },
  });

export const FacetListOptionsSelector = Selector('FacetList')({
    items: {
      id: true,
      code: true,
      name: true,
      customFields: {
        colorsCollection: true,
        usedForProductCreations: true,
      },
      values: FacetValueOptionsSelector,
    },
  });

export type FacetValueOptionsType = FromSelector<typeof FacetValueOptionsSelector, 'FacetValue'>;
export type FacetListOptionsType = FromSelector<typeof FacetListOptionsSelector, 'FacetList'>;

