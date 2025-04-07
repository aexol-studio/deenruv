import { RequestContext } from "../../api/common/request-context";
import { InjectableStrategy } from "../../common/types/injectable-strategy";
import {
  CustomOrderLineFields,
  Order,
  OrderLine,
  ProductVariant,
} from "../../entity/index";
export interface ShouldAddItemToOrderInput {
  productVariant: ProductVariant;
  quantity: number;
  customFields?: CustomOrderLineFields;
}
export interface ShouldAdjustOrderLineInput {
  orderLine: OrderLine;
  quantity: number;
  customFields?: CustomOrderLineFields;
}
export interface OrderMiddleware extends InjectableStrategy {
  shouldAddItemToOrder?(
    ctx: RequestContext,
    order: Order,
    input: ShouldAddItemToOrderInput,
  ): Promise<void | string>;
  shouldAdjustOrderLine?(
    ctx: RequestContext,
    order: Order,
    input: ShouldAdjustOrderLineInput,
  ): Promise<void | string>;
  shouldRemoveItemFromOrder?(
    ctx: RequestContext,
    order: Order,
    orderLine: OrderLine,
  ): Promise<void | string>;
  shouldAddCouponCode?(
    ctx: RequestContext,
    order: Order,
    couponCode: string,
  ): Promise<void | string>;
  shouldRemoveCouponCode?(
    ctx: RequestContext,
    order: Order,
    couponCode: string,
  ): Promise<void | string>;
}
