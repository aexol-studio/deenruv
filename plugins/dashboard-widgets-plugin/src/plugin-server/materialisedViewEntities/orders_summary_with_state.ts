import { Index, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: true,
  expression: `
    WITH order_line_summary AS  (
		  SELECT
		    "orderId",
	      SUM("orderPlacedQuantity") as "orderPlacedQuantity",
	      SUM(quantity) as "quantity"
	      FROM public.order_line
	      GROUP BY "orderId"		   
	   )
        SELECT
            date_trunc('hour', o."orderPlacedAt") AS hour,
		        occ."channelId" AS "channelId",
            o.state,
            COUNT(*) AS "orderCount",
            SUM(o."subTotalWithTax" + o."shippingWithTax") AS "totalWithTax",
            SUM(o."subTotal" + o."shipping") AS "total",
            SUM(ols."orderPlacedQuantity") as "productPlacedCount",
            SUM(ols."quantity") as "productCount"
        FROM "order" o
        INNER JOIN "order_channels_channel" occ ON occ."orderId" = o."id"
        INNER JOIN "order_line_summary" ols ON ols."orderId" = o.id
        WHERE o."orderPlacedAt" >= '2020-01-01T00:00:00.000Z'
        GROUP BY hour, occ."channelId",o.state
        ORDER BY hour ASC
  `,
})
@Index(['hour', 'channelId', 'state'], { unique: true })
export class OrderSummaryWithStateViewEntity {
  @ViewColumn()
  hour: Date;

  @ViewColumn()
  orderCount: number;

  @ViewColumn()
  totalWithTax: number;

  @ViewColumn()
  total: number;

  @ViewColumn()
  productPlacedCount: number;

  @ViewColumn()
  productCount: number;

  @ViewColumn()
  channelId: number;

  @ViewColumn()
  state: string;
}
