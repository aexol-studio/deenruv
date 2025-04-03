import { FromSelectorWithScalars, Selector } from '@deenruv/admin-types';

export const CollectionDetailsSelector = Selector('Collection')({
    id: true,
    translations: {
        description: true,
        name: true,
        slug: true,
        id: true,
        languageCode: true,
    },
    assets: {
        id: true,
    },
    filters: {
        code: true,
        args: {
            name: true,
            value: true,
        },
    },
    createdAt: true,
    updatedAt: true,
    name: true,
    isPrivate: true,
    slug: true,
    description: true,
    inheritFilters: true,
    featuredAsset: {
        id: true,
        preview: true,
    },
    parent: { slug: true, name: true },
    children: {
        id: true,
        name: true,
        slug: true,
        featuredAsset: { preview: true },
    },
});

export type CollectionDetailsType = FromSelectorWithScalars<typeof CollectionDetailsSelector, 'Collection'>;
