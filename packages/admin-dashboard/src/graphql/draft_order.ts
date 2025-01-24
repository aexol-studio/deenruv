import { Selector } from '@deenruv/admin-types';
import { FromSelectorWithScalars } from './scalars.js';
import { paymentSelector } from './orders.js';

export const eligibleShippingMethodsSelector = Selector('ShippingMethodQuote')({
  id: true,
  description: true,
  name: true,
  code: true,
  price: true,
  priceWithTax: true,
});

export type EligibleShippingMethodsType = FromSelectorWithScalars<
  typeof eligibleShippingMethodsSelector,
  'ShippingMethodQuote'
>;

export const addressBaseSelector = Selector('Address')({
  city: true,
  company: true,
  fullName: true,
  phoneNumber: true,
  postalCode: true,
  province: true,
  streetLine1: true,
  streetLine2: true,
});

export type AddressBaseType = FromSelectorWithScalars<typeof addressBaseSelector, 'Address'>;

export const searchProductVariantSelector = Selector('SearchResult')({
  sku: true,
  productAsset: { id: true, preview: true, focalPoint: { x: true, y: true } },
  currencyCode: true,
  price: { __typename: true, '...on PriceRange': { max: true, min: true }, '...on SinglePrice': { value: true } },
  priceWithTax: {
    __typename: true,
    '...on PriceRange': { max: true, min: true },
    '...on SinglePrice': { value: true },
  },
  productName: true,
  productVariantName: true,
  productVariantId: true,
});
export type SearchProductVariantType = FromSelectorWithScalars<typeof searchProductVariantSelector, 'SearchResult'>;

export const productVariantSelector = Selector('ProductVariant')({
  id: true,
  featuredAsset: { preview: true, id: true },
  sku: true,
  productId: true,
  product: { name: true, id: true, slug: true, featuredAsset: { preview: true } },
  currencyCode: true,
  price: true,
  priceWithTax: true,
  name: true,
  stockLevels: { stockOnHand: true },
});

export type ProductVariantType = FromSelectorWithScalars<typeof productVariantSelector, 'ProductVariant'>;

export const searchCustomerSelector = Selector('Customer')({
  firstName: true,
  lastName: true,
  id: true,
  emailAddress: true,
  phoneNumber: true,
});

export type SearchCustomerType = FromSelectorWithScalars<typeof searchCustomerSelector, 'Customer'>;

export const draftOrderLineSelector = Selector('OrderLine')({
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
  // customFields: {
  //   modifiedListPrice: true,
  //   attributes: true,
  //   discountBy: true,
  //   selectedImage: { id: true, preview: true },
  // },
});

export type DraftOrderLineType = FromSelectorWithScalars<typeof draftOrderLineSelector, 'OrderLine'>;

export const draftOrderSelector = Selector('Order')({
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
  // getRealization: {
  //   finalPlannedAt: true,
  //   plannedAt: true,
  // },
  couponCodes: true,
  promotions: {
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
  fulfillments: {
    id: true,
    createdAt: true,
    updatedAt: true,
    method: true,
    nextStates: true,
    state: true,
    summary: { fulfillmentId: true, orderLineId: true, quantity: true },
    trackingCode: true,
  },
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

export type DraftOrderType = FromSelectorWithScalars<typeof draftOrderSelector, 'Order'>;

export const modifyOrderSelector = Selector('ModifyOrderResult')({
  __typename: true,
  '...on Order': draftOrderSelector,
  '...on CouponCodeExpiredError': {
    errorCode: true,
    message: true,
  },
  '...on CouponCodeInvalidError': {
    couponCode: true,
    errorCode: true,
    message: true,
  },
  '...on CouponCodeLimitError': {
    couponCode: true,
    limit: true,
    errorCode: true,
    message: true,
  },
  '...on InsufficientStockError': {
    order: draftOrderSelector,
    quantityAvailable: true,
    errorCode: true,
    message: true,
  },
  '...on NegativeQuantityError': {
    errorCode: true,
    message: true,
  },
  '...on NoChangesSpecifiedError': {
    errorCode: true,
    message: true,
  },
  '...on OrderLimitError': {
    maxItems: true,
    errorCode: true,
    message: true,
  },
  '...on OrderModificationStateError': {
    errorCode: true,
    message: true,
  },
  '...on PaymentMethodMissingError': {
    errorCode: true,
    message: true,
  },
  '...on RefundPaymentIdMissingError': {
    errorCode: true,
    message: true,
  },
  '...on IneligibleShippingMethodError': {
    errorCode: true,
    message: true,
  },
});
export const updateOrderItemsSelector = Selector('UpdateOrderItemsResult')({
  __typename: true,
  '...on Order': draftOrderSelector,
  '...on InsufficientStockError': {
    errorCode: true,
    message: true,
    order: draftOrderSelector,
    quantityAvailable: true,
  },
  '...on NegativeQuantityError': {
    errorCode: true,
    message: true,
  },
  '...on OrderLimitError': {
    errorCode: true,
    message: true,
    maxItems: true,
  },
  '...on OrderModificationError': {
    errorCode: true,
    message: true,
  },
});

export const updatedDraftOrderSelector = Selector('UpdateOrderItemsResult')({
  __typename: true,
  '...on Order': draftOrderSelector,
  '...on InsufficientStockError': {
    errorCode: true,
    message: true,
    order: draftOrderSelector,
    quantityAvailable: true,
  },
  '...on NegativeQuantityError': {
    errorCode: true,
    message: true,
  },
  '...on OrderLimitError': {
    errorCode: true,
    message: true,
    maxItems: true,
  },
  '...on OrderModificationError': {
    errorCode: true,
    message: true,
  },
});

export const removeOrderItemsResultSelector = Selector('RemoveOrderItemsResult')({
  __typename: true,
  '...on Order': draftOrderSelector,
  '...on OrderModificationError': {
    errorCode: true,
    message: true,
  },
});

export const orderHistoryEntrySelector = Selector('HistoryEntry')({
  id: true,
  administrator: { id: true, firstName: true, lastName: true },
  isPublic: true,
  type: true,
  data: true,
  createdAt: true,
  updatedAt: true,
});

export type OrderHistoryEntryType = FromSelectorWithScalars<typeof orderHistoryEntrySelector, 'HistoryEntry'>;

export const addFulfillmentToOrderResultSelector = Selector('AddFulfillmentToOrderResult')({
  __typename: true,
  '...on Fulfillment': {
    id: true,
  },
  '...on CreateFulfillmentError': {
    message: true,
    errorCode: true,
    fulfillmentHandlerError: true,
  },
  '...on EmptyOrderLineSelectionError': {
    message: true,
    errorCode: true,
  },
  '...on FulfillmentStateTransitionError': {
    errorCode: true,
    fromState: true,
    message: true,
    toState: true,
    transitionError: true,
  },
  '...on InsufficientStockOnHandError': {
    errorCode: true,
    message: true,
    productVariantId: true,
    productVariantName: true,
    stockOnHand: true,
  },
  '...on InvalidFulfillmentHandlerError': {
    message: true,
    errorCode: true,
  },
  '...on ItemsAlreadyFulfilledError': {
    message: true,
    errorCode: true,
  },
});
