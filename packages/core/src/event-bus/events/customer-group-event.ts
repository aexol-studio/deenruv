import {
  CreateCustomerGroupInput,
  UpdateCustomerGroupInput,
} from "@deenruv/common/src/generated-types";
import type { ID } from "@deenruv/common/src/shared-types";

import { RequestContext } from "../../api";
import { CustomerGroup } from "../../entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type CustomerGroupInputTypes =
  | CreateCustomerGroupInput
  | UpdateCustomerGroupInput
  | ID;

/**
 * @description
 * This event is fired whenever a {@link CustomerGroup} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class CustomerGroupEvent extends DeenruvEntityEvent<
  CustomerGroup,
  CustomerGroupInputTypes
> {
  constructor(
    ctx: RequestContext,
    entity: CustomerGroup,
    type: "created" | "updated" | "deleted",
    input?: CustomerGroupInputTypes,
  ) {
    super(entity, type, ctx, input);
  }
}
