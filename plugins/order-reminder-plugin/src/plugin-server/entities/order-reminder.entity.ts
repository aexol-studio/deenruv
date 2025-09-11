import { Column, DeepPartial, Entity, Index, ManyToOne, Unique } from "typeorm";

import { DeenruvEntity, Order } from "@deenruv/core";

@Entity()
@Unique(["order"]) // one reminder per order
@Index(["order"]) // used in join/filter; JSON key checks are handled in query
export class OrderReminderEntity extends DeenruvEntity {
  constructor(input?: DeepPartial<OrderReminderEntity>) {
    super(input);
  }

  @ManyToOne(() => Order, { eager: true, onDelete: "CASCADE" })
  order!: Order;

  @Column({ type: "jsonb", default: {} })
  remindmerSend!: Record<string, boolean>;
}
