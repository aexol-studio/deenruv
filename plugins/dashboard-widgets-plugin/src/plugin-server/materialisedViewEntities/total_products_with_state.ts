import { Order, OrderState } from '@deenruv/core';
import { Index, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: true,
  expression: `
    SELECT
        date_trunc('hour', o."orderPlacedAt") AS hour,
	  	  o.state,
        ol."productVariantId" AS "productVariantId",
        occ."channelId" AS "channelId",
        SUM(ol."orderPlacedQuantity") as "orderPlacedQuantitySum",
	      SUM(ol."quantity") as "quantitySum"
    FROM "public"."order" o
    INNER JOIN "public"."order_channels_channel" occ ON occ."orderId" = o."id"
    INNER JOIN "public"."order_line" ol ON ol."orderId" = o."id"
    INNER JOIN "public"."product_variant" pv ON pv.id = ol."productVariantId"
    WHERE o."orderPlacedAt"::timestamptz >= '2020-01-01T00:00:00.000Z'
    GROUP BY "hour", ol."productVariantId",occ."channelId",o.state
	  ORDER BY "hour" DESC
  `,
})
@Index(['hour', 'productVariantId', 'channelId', 'state'], { unique: true })
export class TotalProductsWithStateViewEntity {
  @ViewColumn()
  hour: Date;

  @ViewColumn()
  productVariantId: string;

  @ViewColumn()
  quantitySum: number;

  @ViewColumn()
  orderPlacedQuantitySum: number;

  @ViewColumn()
  channelId: string;
  @ViewColumn()
  state: OrderState;
}
