import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

const addressBaseSelector = Selector("Address")({
  city: true,
  company: true,
  fullName: true,
  phoneNumber: true,
  postalCode: true,
  province: true,
  streetLine1: true,
  streetLine2: true,
});

const productVariantSelector = Selector("ProductVariant")({
  id: true,
  featuredAsset: { preview: true, id: true },
  sku: true,
  productId: true,
  product: {
    name: true,
    id: true,
    slug: true,
    featuredAsset: { id: true, preview: true },
  },
  currencyCode: true,
  price: true,
  priceWithTax: true,
  name: true,
  stockLevels: { stockOnHand: true },
});

const draftOrderLineSelector = Selector("OrderLine")({
  id: true,
  quantity: true,
  discountedLinePrice: true,
  discountedLinePriceWithTax: true,
  productVariant: productVariantSelector,
  linePrice: true,
  linePriceWithTax: true,
  unitPrice: true,
  unitPriceWithTax: true,
  discountedUnitPrice: true,
  discountedUnitPriceWithTax: true,
  taxRate: true,
});

const paymentSelector = Selector("Payment")({
  id: true,
  method: true,
  amount: true,
  state: true,
  errorMessage: true,
  createdAt: true,
  metadata: true,
  transactionId: true,
  refunds: {
    id: true,
    state: true,
    total: true,
    transactionId: true,
    lines: {
      orderLineId: true,
      quantity: true,
    },
  },
});

const FulfillmentSelector = Selector("Fulfillment")({
  id: true,
  createdAt: true,
  updatedAt: true,
  method: true,
  nextStates: true,
  state: true,
  summary: { fulfillmentId: true, orderLineId: true, quantity: true },
  trackingCode: true,
  lines: {
    orderLineId: true,
    quantity: true,
  },
});

export const OrderDetailSelector = Selector("Order")({
  id: true,
  createdAt: true,
  updatedAt: true,
  currencyCode: true,
  code: true,
  state: true,
  total: true,
  totalWithTax: true,
  shipping: true,
  nextStates: true,
  subTotalWithTax: true,
  surcharges: {
    priceWithTax: true,
    sku: true,
    createdAt: true,
    description: true,
    price: true,
    taxRate: true,
  },
  couponCodes: true,
  modifications: { id: true, note: true },
  promotions: {
    id: true,
    name: true,
    couponCode: true,
  },
  discounts: {
    amount: true,
    description: true,
    adjustmentSource: true,
    amountWithTax: true,
    type: true,
  },
  fulfillments: FulfillmentSelector,
  excludedPromotionIds: true,
  taxSummary: {
    description: true,
    taxBase: true,
    taxRate: true,
    taxTotal: true,
  },
  shippingLines: {
    id: true,
    price: true,
    priceWithTax: true,
    discountedPrice: true,
    discountedPriceWithTax: true,
    shippingMethod: {
      id: true,
      name: true,
      code: true,
      fulfillmentHandlerCode: true,
    },
  },
  billingAddress: {
    countryCode: true,
    country: true,
    ...addressBaseSelector,
  },
  shippingAddress: {
    countryCode: true,
    country: true,
    ...addressBaseSelector,
  },
  customer: {
    id: true,
    title: true,
    firstName: true,
    lastName: true,
    phoneNumber: true,
    emailAddress: true,
    addresses: {
      id: true,
      defaultBillingAddress: true,
      defaultShippingAddress: true,
      country: { code: true, name: true },
      ...addressBaseSelector,
    },
  },
  lines: draftOrderLineSelector,
  payments: paymentSelector,
});

export type PaymentOrderDetailType = FromSelectorWithScalars<
  typeof paymentSelector,
  "Payment"
>;
export type FulfillmentOrderDetailType = FromSelectorWithScalars<
  typeof FulfillmentSelector,
  "Fulfillment"
>;
export type OrderLineType = FromSelectorWithScalars<
  typeof draftOrderLineSelector,
  "OrderLine"
>;
export type OrderDetailType = FromSelectorWithScalars<
  typeof OrderDetailSelector,
  "Order"
>;
