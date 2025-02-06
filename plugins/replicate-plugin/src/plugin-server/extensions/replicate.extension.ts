import { gql } from 'graphql-tag';

export const AdminExtension = gql`
    enum PredictionType {
        RFM_SCORE
        SEGMENTATION
    }
    input StartOrderExportToReplicateInput {
        numLastOrder: Int
        startDate: DateTime
        endDate: DateTime
        predictType: PredictionType
        showMetrics: Boolean
    }
    input startModelTrainingInput {
        numLastOrder: Int
        startDate: DateTime
        endDate: DateTime
    }

    extend type Mutation {
        startOrderExportToReplicate(input: StartOrderExportToReplicateInput!): String!
    }

    extend type Mutation {
        startModelTraining(input: startModelTrainingInput!): String!
    }

    input GetPredictionInput {
        prediction_id: String!
    }

    input GetPredictionEntityInput {
        prediction_entity_id: String!
    }

    enum PredictionStatus {
        starting
        succeeded
        failed
    }

    type PredictionResult {
        status: PredictionStatus!
        predictions: [Prediction!]
    }

    extend type Query {
        getPrediction(input: GetPredictionInput!): PredictionResult!
        getPredictionID(input: GetPredictionEntityInput!): String
    }

    type Prediction {
        id: String!
        score: Float!
        email: String!
    }
`;
