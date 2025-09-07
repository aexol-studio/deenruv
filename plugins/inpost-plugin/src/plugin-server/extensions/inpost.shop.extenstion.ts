import * as _ from "graphql";
import { gql } from "graphql-tag";

export const ShopExtension = gql`
  extend type Query {
    inPostGeowidgetKey: String
  }
`;
