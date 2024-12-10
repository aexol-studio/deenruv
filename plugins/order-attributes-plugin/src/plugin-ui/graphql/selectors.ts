import { FromSelector, Selector } from '../zeus';

const FacetSelector = Selector('Facet')({
  id: true,
  name: true,
  code: true,
  customFields: {
    usedForProductCreations: true,
  }
  });

const FacetValueSelector = Selector('FacetValue')({
    id: true,
    name: true,
    code: true,
    customFields: {
      hexColor: true,
      image: {
        preview: true,
      }
    },
    facet: FacetSelector
  });

  export const ProductFacetValueSelector = Selector('Product')({
    slug: true,
    facetValues: FacetValueSelector
  });

export type ProductFacetValueType = FromSelector<typeof ProductFacetValueSelector, 'Product'>;
export type FacetValueType = FromSelector<typeof FacetValueSelector, 'FacetValue'>;
export type FacetType = FromSelector<typeof FacetSelector, 'Facet'>;
