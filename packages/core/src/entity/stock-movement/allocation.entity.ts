import { StockMovementType } from "@deenruv/common/src/generated-types";
import { type DeepPartial } from "@deenruv/common/src/shared-types";
import { type Relation, ChildEntity, Index, ManyToOne } from "typeorm";

import { OrderLine } from "../order-line/order-line.entity";

import { StockMovement } from "./stock-movement.entity";

/**
 * @description
 * An Allocation is created for each ProductVariant in an Order when the checkout is completed
 * (as configured by the {@link StockAllocationStrategy}. This prevents stock being sold twice.
 *
 * @docsCategory entities
 * @docsPage StockMovement
 */
@ChildEntity()
export class Allocation extends StockMovement {
  readonly type = StockMovementType.ALLOCATION;

  constructor(input: DeepPartial<Allocation>) {
    super(input);
  }

  @Index()
  @ManyToOne((type) => OrderLine, (orderLine) => orderLine.allocations)
  orderLine: Relation<OrderLine>;
}
