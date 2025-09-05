import type { ID } from "@deenruv/common/shared-types";

import { RequestContext } from "../../api/common/request-context";
import { Product } from "../../entity";
import { DeenruvEvent } from "../deenruv-event";

/**
 * @description
 * This event is fired whenever a {@link ProductOptionGroup} is assigned or removed from a {@link Product}.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class ProductOptionGroupChangeEvent extends DeenruvEvent {
  constructor(
    public ctx: RequestContext,
    public product: Product,
    public optionGroupId: ID,
    public type: "assigned" | "removed",
  ) {
    super();
  }
}
