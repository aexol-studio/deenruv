export type OrderLineActions = 'quantity-price' | 'attributes';
export interface OnPriceQuantityChangeApproveInput {
  lineID: string;
  priceChange?: number;
  pricewithTaxChange?: number;
  quantityChange?: number;
  isNettoPrice?: boolean;
}
