import { type DeepPartial, type ID } from "@deenruv/common/shared-types";
import { type Relation, Column, Entity, Index, ManyToOne } from "typeorm";

import { DeenruvEntity } from "../base/base.entity";
import { EntityId } from "../entity-id.decorator";
import { ProductVariant } from "../product-variant/product-variant.entity";
import { StockLocation } from "../stock-location/stock-location.entity";

/**
 * @description
 * A StockLevel represents the number of a particular {@link ProductVariant} which are available
 * at a particular {@link StockLocation}.
 *
 * @docsCategory entities
 */
@Entity()
@Index(["productVariantId", "stockLocationId"], { unique: true })
export class StockLevel extends DeenruvEntity {
  constructor(input: DeepPartial<StockLevel>) {
    super(input);
  }

  @Index()
  @ManyToOne(
    (type) => ProductVariant,
    (productVariant) => productVariant.stockLevels,
    { onDelete: "CASCADE" },
  )
  productVariant: Relation<ProductVariant>;

  @EntityId()
  productVariantId: ID;

  @Index()
  @ManyToOne((type) => StockLocation, { onDelete: "CASCADE" })
  stockLocation: StockLocation;

  @EntityId()
  stockLocationId: ID;

  @Column()
  stockOnHand: number;

  @Column()
  stockAllocated: number;
}
