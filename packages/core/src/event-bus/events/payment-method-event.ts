import {
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
} from "@deenruv/common/src/generated-types";
import type { ID } from "@deenruv/common/src/shared-types";

import { RequestContext } from "../../api/common/request-context";
import { PaymentMethod } from "../../entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type PaymentMethodInputTypes =
  | CreatePaymentMethodInput
  | UpdatePaymentMethodInput
  | ID;

/**
 * @description
 * This event is fired whenever a {@link PaymentMethod} is added, updated
 * or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class PaymentMethodEvent extends DeenruvEntityEvent<
  PaymentMethod,
  PaymentMethodInputTypes
> {
  constructor(
    ctx: RequestContext,
    entity: PaymentMethod,
    type: "created" | "updated" | "deleted",
    input?: PaymentMethodInputTypes,
  ) {
    super(entity, type, ctx, input);
  }
}
