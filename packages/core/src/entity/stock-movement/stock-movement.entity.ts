import { StockMovementType } from "@deenruv/common/src/generated-types";
import type { ID } from "@deenruv/common/src/shared-types";
import {
  type Relation,
  Column,
  Entity,
  Index,
  ManyToOne,
  TableInheritance,
} from "typeorm";

import { DeenruvEntity } from "../base/base.entity";
import { EntityId } from "../entity-id.decorator";
import { ProductVariant } from "../product-variant/product-variant.entity";
import { StockLocation } from "../stock-location/stock-location.entity";

/**
 * @description
 * A StockMovement is created whenever stock of a particular ProductVariant goes in
 * or out.
 *
 * @docsCategory entities
 * @docsPage StockMovement
 * @docsWeight 0
 */
@Entity()
@TableInheritance({ column: { type: "varchar", name: "discriminator" } })
export abstract class StockMovement extends DeenruvEntity {
  @Column({ nullable: false, type: "varchar" })
  readonly type: StockMovementType;

  @Index()
  @ManyToOne((type) => ProductVariant, (variant) => variant.stockMovements)
  productVariant: Relation<ProductVariant>;

  @Index()
  @ManyToOne(
    (type) => StockLocation,
    (stockLocation) => stockLocation.stockMovements,
    { onDelete: "CASCADE" },
  )
  stockLocation: StockLocation;

  @EntityId()
  stockLocationId: ID;

  @Column()
  quantity: number;
}
