import { typedGql } from '../zeus/typedDocumentNode';
import { $ } from '../zeus';
import { scalars } from '@deenruv/admin-types';
import { BadgeSelector } from './selectors';

export const ProductBadgesQuery = typedGql('query', { scalars })({
    getProductBadges: [
        {
            input: {
                productId: $('productId', 'ID!'),
            },
        },
        BadgeSelector,
    ],
});
