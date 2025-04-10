import { Selector } from "@deenruv/admin-types";
import { OrderDetailSelector } from "./details/OrderDetailSelector.js";

export const modifyOrderSelector = Selector("ModifyOrderResult")({
  __typename: true,
  "...on Order": OrderDetailSelector,
  "...on CouponCodeExpiredError": {
    errorCode: true,
    message: true,
  },
  "...on CouponCodeInvalidError": {
    couponCode: true,
    errorCode: true,
    message: true,
  },
  "...on CouponCodeLimitError": {
    couponCode: true,
    limit: true,
    errorCode: true,
    message: true,
  },
  "...on InsufficientStockError": {
    order: OrderDetailSelector,
    quantityAvailable: true,
    errorCode: true,
    message: true,
  },
  "...on NegativeQuantityError": {
    errorCode: true,
    message: true,
  },
  "...on NoChangesSpecifiedError": {
    errorCode: true,
    message: true,
  },
  "...on OrderLimitError": {
    maxItems: true,
    errorCode: true,
    message: true,
  },
  "...on OrderModificationStateError": {
    errorCode: true,
    message: true,
  },
  "...on PaymentMethodMissingError": {
    errorCode: true,
    message: true,
  },
  "...on RefundPaymentIdMissingError": {
    errorCode: true,
    message: true,
  },
  "...on IneligibleShippingMethodError": {
    errorCode: true,
    message: true,
  },
});
