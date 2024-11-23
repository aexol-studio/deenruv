export type MetricResponse = {
    orderId: string;
    orderPlacedAt: string;
    totalWithTax: number;
    orderProducts: { id: number; name: string; quantity: number }[];
    overallQuantity: number;
};

export interface DashboardWidgetsPluginOptions {
    cacheTime: number;
}
