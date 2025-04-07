import {
  CustomProductVariantFields,
  CustomFulfillmentFields,
  CustomShippingMethodFields,
} from "@deenruv/core/dist/entity/custom-entity-fields";

declare module "@deenruv/core/dist/entity/custom-entity-fields" {
  interface CustomProductVariantFields {
    isDigital: boolean;
  }
  interface CustomShippingMethodFields {
    isDigital: boolean;
  }
  interface CustomFulfillmentFields {
    downloadUrls: string[] | null;
  }
}
