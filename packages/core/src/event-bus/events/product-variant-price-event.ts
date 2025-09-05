import {
  CreateProductVariantInput,
  UpdateProductVariantInput,
} from "@deenruv/common/src/generated-types";

import { RequestContext } from "../../api/common/request-context";
import { ProductVariantPrice } from "../../entity";
import { DeenruvEntityEvent } from "../deenruv-entity-event";

type ProductVariantInputTypes = undefined;

/**
 * @description
 * This event is fired whenever a {@link ProductVariantPrice} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 2.2.0
 */
export class ProductVariantPriceEvent extends DeenruvEntityEvent<
  ProductVariantPrice[],
  ProductVariantInputTypes
> {
  constructor(
    ctx: RequestContext,
    entity: ProductVariantPrice[],
    type: "created" | "updated" | "deleted",
    input?: ProductVariantInputTypes,
  ) {
    super(entity, type, ctx, input);
  }
}
