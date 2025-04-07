import gql from "graphql-tag";

export const ADMIN_API_EXTENSION = gql`
  type CopyOrderErrorResponse {
    message: String!
  }

  union CopyOrderResult = Order | CopyOrderErrorResponse

  extend type Mutation {
    copyOrder(id: ID!): CopyOrderResult!
  }
`;
