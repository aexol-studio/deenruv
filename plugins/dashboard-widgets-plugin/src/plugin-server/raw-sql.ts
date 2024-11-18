export const ORDER_COUNT_QUERY = `
SELECT 
o.id AS "orderId",
o."orderPlacedAt" AS "orderPlacedAt"
FROM "order" o
WHERE o."orderPlacedAt" >= $1
`;
export const ORDER_TOTAL_QUERY = `
SELECT 
o.id AS "orderId",
o."orderPlacedAt" AS "orderPlacedAt",
o."subTotalWithTax" + o."shippingWithTax" AS "totalWithTax"
FROM "order" o
WHERE o."orderPlacedAt" >= $1
`;

export const ORDER_TOTAL_PRODUCT_QUERY = `
SELECT 
o.id AS "orderId",
o."orderPlacedAt" AS "orderPlacedAt",
o."subTotalWithTax" + o."shippingWithTax" AS "totalWithTax",
ARRAY_AGG(
    CASE
      WHEN ol.quantity > 0 THEN
        JSON_BUILD_OBJECT('id', pro.id, 'name', pt.name, 'quantity', ol.quantity)
      ELSE NULL
    END
)
FILTER (WHERE ol.quantity > 0) AS "orderProducts",
SUM(ol.quantity)::INTEGER AS "overallQuantity"
FROM "order" o
INNER JOIN order_line ol ON o.id = ol."orderId"
INNER JOIN product_variant pv ON ol."productVariantId" = pv.id
INNER JOIN product pro ON pv."productId" = pro.id
INNER JOIN product_translation pt ON pro.id = pt."baseId"
WHERE o."orderPlacedAt" >= $1`;
export const END_QUERY_FRAGMENT = `     
GROUP BY o.id
ORDER BY o."orderPlacedAt" 
LIMIT $2 OFFSET $3;`;
