import {
  Order,
  OrderLine,
  RequestContext,
  ShippingLine,
  ShippingLineAssignmentStrategy,
} from "@deenruv/core";

/**
 * @description
 * This ShippingLineAssignmentStrategy ensures that digital products are assigned to a
 * ShippingLine which has the `isDigital` flag set to true.
 */
export class DigitalShippingLineAssignmentStrategy
  implements ShippingLineAssignmentStrategy
{
  assignShippingLineToOrderLines(
    ctx: RequestContext,
    shippingLine: ShippingLine,
    order: Order,
  ): OrderLine[] | Promise<OrderLine[]> {
    if ((shippingLine.shippingMethod.customFields as any).isDigital) {
      return order.lines.filter(
        (l) => (l.productVariant.customFields as any).isDigital,
      );
    } else {
      return order.lines.filter(
        (l) => !(l.productVariant.customFields as any).isDigital,
      );
    }
  }
}
