import { RequestContext, DeenruvEvent, Order } from "@deenruv/core";

export class Przelewy24RegularPaymentEvent extends DeenruvEvent {
  constructor(
    public ctx: RequestContext,
    public order: Order,
  ) {
    super();
  }
}
