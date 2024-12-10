import { typedGql } from '../zeus/typedDocumentNode';
import { $ } from '../zeus';
import { scalars } from '@deenruv/admin-types';
import { ProductFacetValueSelector } from './selectors';

export const ProductFacetValuesQuery = typedGql('query', { scalars })({
    product: [{id: $('productId', 'ID!')}, ProductFacetValueSelector],
});