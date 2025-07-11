import { gql } from "graphql-tag";

export const shopApiExtension = gql`
  enum NewsletterErrorCode {
    InvalidEmail
  }
  type AddToNewsletterSuccessResult {
    success: Boolean!
  }
  type AddToNewsletterErrorResult {
    errorCode: NewsletterErrorCode!
  }
  union AddToNewsletterResult =
    | AddToNewsletterSuccessResult
    | AddToNewsletterErrorResult

  extend type Mutation {
    addToNewsletter(email: String!): AddToNewsletterResult!
  }
`;
