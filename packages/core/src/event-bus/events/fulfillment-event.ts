import {
  ConfigurableOperationInput,
  OrderLineInput,
} from "@deenruv/common/src/generated-types";

import { RequestContext } from "../../api";
import { Order } from "../../entity";
import { Fulfillment } from "../../entity/fulfillment/fulfillment.entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

/**
 * @description
 * The inputs used to create a new fulfillment
 * @since 1.4
 */
type CreateFulfillmentInput = {
  orders: Order[];
  lines: OrderLineInput[];
  handler: ConfigurableOperationInput;
};

/**
 * @description
 * This event is fired whenever a {@link Fulfillment} is added. The type is always `created`.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class FulfillmentEvent extends DeenruvEntityEvent<
  Fulfillment,
  CreateFulfillmentInput
> {
  constructor(
    ctx: RequestContext,
    entity: Fulfillment,
    input?: CreateFulfillmentInput,
  ) {
    super(entity, "created", ctx, input);
  }
}
