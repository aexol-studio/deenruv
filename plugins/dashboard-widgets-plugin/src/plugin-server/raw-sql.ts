export const RANKED_TRANSLATIONS_SELECT = [
  'pvt.baseId AS "baseId"',
  'pvt.name AS name',
  'pvt.languageCode AS "languageCode"',
  `ROW_NUMBER() OVER (
        PARTITION BY pvt."baseId" 
        ORDER BY CASE WHEN pvt."languageCode" = :languageCode THEN 1 ELSE 2 END
    ) AS rank`,
];
export const TOTAL_PRODUCT_VIEW_SELECT = [
  'tpv."productVariantId" AS "productVariantId"',
  'SUM(tpv."orderPlacedQuantitySum") AS "orderPlacedQuantitySum"',
  'tpv."channelId" AS "channelId"',
  'rt.name AS name',
];

export const ORDER_TOTAL_DAILY_SELECT = [
  'extract(epoch from osv.hour - :startDate)::integer/86400 + 1 as "intervalTick"',
  'SUM(osv."total") as value',
];
export const ORDER_TOTAL_HOURLY_SELECT = [
  'extract(epoch from osv.hour - :startDate)::integer/3600  as "intervalTick"',
  'SUM(osv."total") as value',
];
export const ORDER_COUNT_DAILY_SELECT = [
  'extract(epoch from osv.hour - :startDate)::integer/86400 + 1 as "intervalTick"',
  'SUM(osv."orderCount") as value',
];
export const ORDER_COUNT_HOURLY_SELECT = [
  'extract(epoch from osv.hour - :startDate)::integer/3600 as "intervalTick"',
  'SUM(osv."orderCount") as value',
];
export const ORDER_AVERAGE_DAILY_SELECT = [
  'extract(epoch from osv.hour - :startDate)::integer/86400 + 1 as "intervalTick"',
  'SUM(osv."orderCount") as orderCount',
  'SUM(osv."total") as value',
];

export const ORDER_AVERAGE_HOURLY_SELECT = [
  'extract(epoch from osv.hour - :startDate)::integer/3600 as "intervalTick"',
  'SUM(osv."orderCount") as orderCount',
  'SUM(osv."total") as value',
];
