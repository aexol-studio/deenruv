import { FromSelector, Selector } from '../zeus';

const FacetValueSelector = Selector('FacetValue')({
    id: true,
    name: true,
    code: true,
    customFields: {
        hexColor: true,
        image: { id: true, preview: true },
        isHidden: true,
        isNew: true,
    },
});

const FacetSelector = Selector('Facet')({
    id: true,
    name: true,
    code: true,
    customFields: { colorsCollection: true, usedForColors: true, usedForProductCreations: true },
    values: FacetValueSelector,
});

export const FacetListOptionsSelector = Selector('FacetList')({
    items: FacetSelector,
    totalItems: true,
});

export type FacetValue = FromSelector<typeof FacetValueSelector, 'FacetValue'>;
export type Facet = FromSelector<typeof FacetSelector, 'Facet'>;
