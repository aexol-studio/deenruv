import { scalars } from '@deenruv/admin-types';
import { typedGql } from '../zeus/typedDocumentNode.js';
import { $ } from '../zeus/index.js';

export const DO_REALIZATION = typedGql('mutation', { scalars })({
    registerRealization: [{ input: $('input', 'OrderRealizationInput!') }, { url: true }],
});
