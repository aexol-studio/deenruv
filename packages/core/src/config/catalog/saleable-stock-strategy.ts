import { RequestContext } from "../../api/common/request-context";
import { InjectableStrategy } from "../../common/types/injectable-strategy";
import { ProductVariant } from "../../entity/product-variant/product-variant.entity";

/**
 * @description
 * Defines how the saleable stock level of a ProductVariant is calculated.
 * This is the stock level used by cart/order logic to determine whether a
 * variant can still be purchased.
 *
 * :::info
 *
 * This is configured via the `catalogOptions.saleableStockStrategy` property of
 * your DeenruvConfig.
 *
 * :::
 *
 * @docsCategory products & stock
 */
export interface SaleableStockStrategy extends InjectableStrategy {
  /**
   * @description
   * Calculates the number of saleable units for a ProductVariant.
   */
  getSaleableStockLevel(
    ctx: RequestContext,
    productVariant: ProductVariant,
    stockOnHand: number,
    stockAllocated: number,
    effectiveOutOfStockThreshold: number,
  ): number | Promise<number>;
}
