import gql from 'graphql-tag';

export const ADMIN_API_EXTENSION = gql`
    type CopyOrderSuccessResponse {
        success: Boolean!
        order: Order!
    }
    type CopyOrderErrorResponse {
        success: Boolean!
        message: String!
    }
    union CopyOrderResponse = CopyOrderSuccessResponse | CopyOrderErrorResponse

    extend type Mutation {
        copyOrder(id: ID!): CopyOrderResponse!
    }
`;
