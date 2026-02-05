import { gql } from "graphql-tag";

export const Przelewy24ShopExtension = gql`
  enum BlikStatus {
    pending
    success
    failed
    timeout
  }

  type BlikStatusResponse {
    status: BlikStatus!
    orderState: String
    message: String
  }

  extend type Query {
    przelewy24BlikStatus(code: String!, blik: String): BlikStatusResponse!
  }

  extend type Mutation {
    """
    Mark a BLIK payment attempt as failed.
    Use when user switches from BLIK to standard P24 payment.
    """
    przelewy24BlikFail(code: String!, blik: String): BlikStatusResponse!
  }
`;
