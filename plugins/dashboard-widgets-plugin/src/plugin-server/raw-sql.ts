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
];

export const formatTotalProductsCountQuery = (args: {
    discountByCustomField?: boolean;
    endDate?: string;
}) => `
    WITH base_data AS (
      SELECT 
        extract(epoch from o."orderPlacedAt" - $1)::integer / 86400 + 1 AS "day",
        ol."productVariantId" AS "productVariantId",
        pt."languageCode" AS "languageCode",
        pt."name" AS "name",
        SUM(ol."orderPlacedQuantity") AS "quantitySum",
        SUM(
            (ol."listPrice" * ol."orderPlacedQuantity"  ${args.discountByCustomField ? '- ol."orderPlacedQuantity" * COALESCE(ol."customFieldsDiscountby", 0)' : ''} ) - COALESCE(
              (SELECT SUM((adj->>'amount')::numeric)
              FROM jsonb_array_elements(ol."adjustments"::jsonb) adj),
              0
            )
          ) AS "adjustedPriceSum"
      FROM "public"."order" o
      INNER JOIN "public"."order_channels_channel" occ ON occ."orderId" = o."id"
      INNER JOIN "public"."order_line" ol ON ol."orderId" = o."id"
      INNER JOIN "public"."product_variant" pv ON pv.id = ol."productVariantId"
      INNER JOIN "public"."product_translation" pt ON pt."baseId" = pv."productId"
      WHERE o."orderPlacedAt"::timestamptz >= $1
      AND occ."channelId" = $2
      ${args.endDate ? 'AND o."orderPlacedAt"::timestamptz <= $4' : ''}
      GROUP BY "day", ol."productVariantId", pt."languageCode", pt."name"
    )
    SELECT DISTINCT ON (base_data."day", base_data."productVariantId")
      base_data."day",
      base_data."productVariantId",
      base_data."name",
      base_data."quantitySum",
      base_data."adjustedPriceSum"
      FROM base_data
    ORDER BY base_data."day" ASC, base_data."productVariantId" ASC, 
    CASE WHEN base_data."languageCode" = $3 THEN 1 ELSE 2 END ASC, 
    base_data."languageCode" ASC;
  `;
