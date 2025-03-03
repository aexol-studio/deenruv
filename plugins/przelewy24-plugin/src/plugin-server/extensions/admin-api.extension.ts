import gql from "graphql-tag";

export const AdminAPIExtension = gql`
  extend type Query {
    remindPrzelewy24(orderId: ID!): Boolean
  }
`;
