import gql from "graphql-tag";

export const AdminExtension = gql`
  input SetInpostShippingMethodConfigInput {
    shippingMethodId: ID!
    host: String!
    apiKey: String!
    geowidgetKey: String
    inpostOrganization: Int!
    service: String!
  }

  extend type Query {
    inpostConnected: Boolean!
  }

  extend type Mutation {
    setInpostShippingMethodConfig(
      input: SetInpostShippingMethodConfigInput!
    ): Boolean!
  }
`;
