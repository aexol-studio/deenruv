import gql from 'graphql-tag';
// dont remove this import otherwise plugin will crash
import type { DocumentNode } from 'graphql';

const base = gql`
    type OrderRealization {
        orderID: ID!
        assetID: ID!
        plannedAt: String!
        finalPlannedAt: String
        note: String
        color: String!
        key: String
        url: String
    }

    type DiscountedPriceMetadata {
        price: Int
        name: String
        description: String
        isCustomerGroup: Boolean
    }

    type DiscountedPrice {
        value: Int
        metadata: [DiscountedPriceMetadata]
    }

    type ShopOrderRealization {
        note: String
        plannedAt: String
        finalPlannedAt: String
    }

    input RealizationAssetInput {
        id: String!
        orderLineID: String!
        preview: String!
    }

    input OrderRealizationInput {
        orderID: String!
        assets: [RealizationAssetInput!]!
        plannedAt: String!
        finalPlannedAt: String!
        note: String!
        color: String!
    }

    input RegisterProformaInput {
        orderID: String!
    }
`;

export const ShopExtension = gql`
    ${base}

    extend type ProductVariant {
        groupDiscountedPrice: Int
        discountedPrice: DiscountedPrice
    }

    extend type SearchResult {
        discountedPrice: DiscountedPrice
    }

    extend type Order {
        realization: ShopOrderRealization
    }
`;

export const AdminExtension = gql`
    ${base}

    extend type Order {
        getRealization: OrderRealization
        getProforma: String
    }

    extend type Query {
        getRealizationURL(orderID: ID!): String
        getProformaURL(orderID: ID!): String
    }

    extend type Mutation {
        registerRealization(input: OrderRealizationInput!): OrderRealization
        registerProforma(input: RegisterProformaInput!): String
    }
`;
