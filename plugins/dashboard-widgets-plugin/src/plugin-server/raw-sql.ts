export const ORDER_COUNT_QUERY_SELECT = [
    'occ."channelId" AS channel',
    'o.id AS "orderId"',
    'o."orderPlacedAt" AS "orderPlacedAt"',
];

export const ORDER_TOTAL_QUERY_SELECT = [
    'occ."channelId" AS channel',
    'o.id AS "orderId"',
    'o."orderPlacedAt" AS "orderPlacedAt"',
    'o."subTotalWithTax" + o."shippingWithTax" AS "totalWithTax"',
];

export const ORDER_TOTAL_PRODUCT_QUERY_SELECT = [
    'occ."channelId" AS channel',
    'o.id AS "orderId"',
    'o."orderPlacedAt" AS "orderPlacedAt"',
    'o."subTotalWithTax" + o."shippingWithTax" AS "totalWithTax"',
    `ARRAY_AGG(
      CASE
        WHEN ol.quantity > 0 THEN
          JSON_BUILD_OBJECT('id', p.id, 'name', pt.name, 'quantity', ol.quantity)
        ELSE NULL
      END
    ) FILTER (WHERE ol.quantity > 0) AS "orderProducts"`,
    'SUM(ol.quantity)::INTEGER AS "overallQuantity"',
];
