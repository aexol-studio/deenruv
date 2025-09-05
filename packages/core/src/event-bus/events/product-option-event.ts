import {
  CreateGroupOptionInput,
  CreateProductOptionInput,
  UpdateProductOptionInput,
} from "@deenruv/common/src/generated-types";
import type { ID } from "@deenruv/common/src/shared-types";

import { RequestContext } from "../../api/common/request-context";
import { ProductOption, ProductOptionGroup } from "../../entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type ProductOptionInputTypes =
  | CreateGroupOptionInput
  | CreateProductOptionInput
  | UpdateProductOptionInput
  | ID;

/**
 * @description
 * This event is fired whenever a {@link ProductOption} is added or updated.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class ProductOptionEvent extends DeenruvEntityEvent<
  ProductOption,
  ProductOptionInputTypes
> {
  constructor(
    ctx: RequestContext,
    entity: ProductOption,
    type: "created" | "updated" | "deleted",
    input?: ProductOptionInputTypes,
  ) {
    super(entity, type, ctx, input);
  }
}
