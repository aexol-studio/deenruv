import * as _ from "graphql";
import { gql } from "graphql-tag";

export const AdminExtension = gql`
  input SetInpostShippingMethodConfigInput {
    shippingMethodId: ID!
    host: String!
    apiKey: String!
    geowidgetKey: String
    inpostOrganization: Int!
    service: String!
  }

  type InpostConfig {
    shippingMethodId: ID!
    host: String!
    apiKey: String!
    geowidgetKey: String
    inpostOrganization: Int!
    service: String!
  }

  type InpostOrganization {
    id: Int!
    name: String!
    services: [String!]!
  }
  type InpostOrganizationResponse {
    items: [InpostOrganization!]!
  }

  input GetInpostOrganizationsInput {
    host: String!
    apiKey: String!
  }

  extend type Query {
    getInpostConfig: InpostConfig
    getInpostOrganizations(
      input: GetInpostOrganizationsInput
    ): InpostOrganizationResponse!
  }

  extend type Mutation {
    setInpostShippingMethodConfig(
      input: SetInpostShippingMethodConfigInput!
    ): Boolean!
  }
`;
