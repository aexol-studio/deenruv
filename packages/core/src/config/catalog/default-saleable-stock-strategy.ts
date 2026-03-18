import { RequestContext } from "../../api/common/request-context";
import { ProductVariant } from "../../entity/product-variant/product-variant.entity";

import { SaleableStockStrategy } from "./saleable-stock-strategy";

/**
 * @description
 * Default implementation of the {@link SaleableStockStrategy}. It preserves the
 * historical Deenruv behavior by subtracting allocated stock and the effective
 * out-of-stock threshold from stock on hand.
 *
 * @docsCategory products & stock
 */
export class DefaultSaleableStockStrategy implements SaleableStockStrategy {
  getSaleableStockLevel(
    _ctx: RequestContext,
    _productVariant: ProductVariant,
    stockOnHand: number,
    stockAllocated: number,
    effectiveOutOfStockThreshold: number,
  ): number {
    return stockOnHand - stockAllocated - effectiveOutOfStockThreshold;
  }
}
