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
// {"event_ts":"2025-07-09 17:37:17 +0200","event":"shipment_confirmed","organization_id":5430,"payload":{"shipment_id":13476345,"tracking_number":"615365018500839032767942"}}
export type InpostWebhookEvent = {
  event_ts: string;
  event: string;
  organization_id: number;
  payload: {
    shipment_id: number;
    tracking_number?: string;
    status?:
      | "delivered"
      | "taken_by_courier"
      | "taken_by_courier_from_pok"
      | "canceled";
  };
};
