import { SerializedRequestContext, type ID } from "@deenruv/core";
import { Service } from "@deenruv/inpost";

export type InpostPluginOptions = object;

export interface SetInpostShippingMethodConfigInput {
  shippingMethodId: ID;
  host: string;
  apiKey: string;
  geowidgetKey?: string;
  inpostOrganization: number;
  service: Service;
}

export type OrderProgressStep = "buy" | "label";
export interface OrderProgressJob {
  context: SerializedRequestContext;
  inpostConfigId: ID;
  shipmentId: number;
  nextStep: OrderProgressStep;
  delay?: number;
}
