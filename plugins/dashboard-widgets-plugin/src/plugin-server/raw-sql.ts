export const CHART_ORDER_COUNT_QUERY_SELECT = [
    'extract(epoch from o."orderPlacedAt" - :startDate)::integer/86400 + 1 as day',
    'COUNT(*) as value',
];

export const CHART_ORDER_TOTAL_QUERY_SELECT = [
    'extract(epoch from o."orderPlacedAt" - :startDate)::integer/86400 + 1 as day',
    'SUM(o."subTotalWithTax" + o."shippingWithTax") as value',
];

export const CHART_DATA_AVERAGE_VALUE_QUERY_SELECT = [
    'extract(epoch from o."orderPlacedAt" - :startDate)::integer/86400 + 1 as day',
    'COUNT(*) as orderCount',
    'SUM(o."subTotalWithTax" + o."shippingWithTax") as value',
];

export const ORDERS_SUMMARY_QUERY_SELECT = [
    'extract(epoch from o."orderPlacedAt" - :startDate)::integer/86400 + 1 as day',
    'COUNT(*) as orderCount',
    'SUM(o."subTotalWithTax" + o."shippingWithTax") as totalWithTax',
    'SUM(o."subTotal" + o."shipping") as total',
    'AVG(o."subTotalWithTax" + o."shippingWithTax") as averageWithTax', // Średnia wartość z taxem
    'AVG(o."subTotal" + o."shipping") as averageTotal', // Średnia wartość bez taxu
];
