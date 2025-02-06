import { typedGql } from '../zeus/typedDocumentNode';
import { $ } from '../zeus';
import { scalars } from '@deenruv/admin-types';
import { PredictionSelector } from './selectors';

export const getPredictionQuery = typedGql('query', { scalars })({
    getPrediction: [
        {
            input: {
                prediction_id: $('prediction_id', 'String!'),
            },
        },
        PredictionSelector,
    ],
});
export const getPredictionIDQuery = typedGql('query', { scalars })({
    getPredictionID: [
        {
            input: {
                prediction_entity_id: $('prediction_entity_id', 'String!'),
            },
        },
        true,
    ],
});
