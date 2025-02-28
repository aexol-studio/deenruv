import gql from 'graphql-tag';

export const WFirmaAdminExtension = gql`
    type WFirmaResponse {
        url: String!
    }
    input SendInvoiceToWFirmaInput {
        orderID: String!
        invoiceType: String!
    }
    extend type Mutation {
        sendInvoiceToWFirma(input: SendInvoiceToWFirmaInput!): WFirmaResponse
    }
`;
