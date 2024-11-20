import { typedGql } from '../zeus/typedDocumentNode';
import { $ } from '../zeus';
import { scalars } from '@deenruv/admin-types';
import { ProductsSelector } from './selectors';

export const ProductsQuery = typedGql('query', { scalars })({
    products: [
        {
            options: {
                take: $('take', 'Int'),
            },
        },
        { items: ProductsSelector },
    ],
});
