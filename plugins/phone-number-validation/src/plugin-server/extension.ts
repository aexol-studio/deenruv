import { gql } from "graphql-tag";

export const APIExtension = gql`
  type PhoneNumberValidationSuccess {
    success: Boolean
  }
  type PhoneNumberValidationError {
    message: String
  }
  union PhoneNumberValidationResult = PhoneNumberValidationSuccess | PhoneNumberValidationError
  extend type Query {
    validateCurrentOrderPhoneNumber: PhoneNumberValidationResult!
  }
`;

