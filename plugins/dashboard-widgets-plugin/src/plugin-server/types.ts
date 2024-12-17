export type MetricResponse = {
  orderId: string;
  orderPlacedAt: string;
  totalWithTax: number;
  orderProducts: { id: number; name: string; quantity: number }[];
  overallQuantity: number;
};

export interface DashboardWidgetsPluginOptions {
  cacheTime: number;
  /** This field is populated right now at Samarite and Minko storefronts */
  discountByCustomField?: boolean;
}
