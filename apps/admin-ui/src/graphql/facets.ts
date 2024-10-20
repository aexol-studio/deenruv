import { FromSelectorWithScalars } from '@/graphql/scalars';
import { Selector } from '@/zeus';

const FacetValueSelector = Selector('FacetValue')({
  name: true,
  code: true,
  // customFields: {
  //   hexColor: true,
  //   image: {
  //     source: true,
  //     id: true,
  //     preview: true,
  //   },
  //   isNew: true,
  //   isHidden: true,
  // },
  createdAt: true,
  updatedAt: true,
  id: true,
});

const FacetValueOptionsSelector = Selector('FacetValue')({
  id: true,
  name: true,
  code: true,
  // customFields: {
  //   hexColor: true,
  //   image: {
  //     preview: true,
  //   },
  //   isNew: true,
  // },
});

export const FacetListSelector = Selector('Facet')({
  id: true,
  createdAt: true,
  updatedAt: true,
  code: true,
  // customFields: {
  //   usedForColors: true,
  //   colorsCollection: true,
  // },
  isPrivate: true,
  name: true,
  values: {
    id: true,
  },
});

export const FacetDetailsSelector = Selector('Facet')({
  id: true,
  createdAt: true,
  updatedAt: true,
  code: true,
  // customFields: {
  //   usedForColors: true,
  //   colorsCollection: true,
  //   usedForProductCreations: true,
  // },
  isPrivate: true,
  languageCode: true,
  name: true,
  translations: {
    name: true,
  },
  values: FacetValueSelector,
});

export const FacetListOptionsSelector = Selector('FacetList')({
  items: {
    id: true,
    code: true,
    name: true,
    // customFields: {
    //   colorsCollection: true,
    //   usedForProductCreations: true,
    // },
    values: FacetValueOptionsSelector,
  },
});

export type FacetListType = FromSelectorWithScalars<typeof FacetListSelector, 'Facet'>;
export type FacetDetailsType = FromSelectorWithScalars<typeof FacetDetailsSelector, 'Facet'>;
export type FacetValueType = FromSelectorWithScalars<typeof FacetValueSelector, 'FacetValue'>;
export type FacetValueOptionsType = FromSelectorWithScalars<typeof FacetValueOptionsSelector, 'FacetValue'>;
export type FacetListOptionsType = FromSelectorWithScalars<typeof FacetListOptionsSelector, 'FacetList'>;
