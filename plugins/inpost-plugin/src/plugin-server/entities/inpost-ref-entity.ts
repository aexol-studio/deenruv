import { DeenruvEntity, DeepPartial, OrderLine } from "@deenruv/core";
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Relation,
} from "typeorm";
import { InpostConfigEntity } from "./inpost-config-entity";

@Entity()
export class InpostRefEntity extends DeenruvEntity {
  constructor(data: DeepPartial<InpostRefEntity>) {
    super(data);
  }

  @ManyToOne(() => InpostConfigEntity)
  inpostConfig!: Relation<InpostConfigEntity>;

  @Index({ unique: true, sparse: true })
  @Column("bigint", { nullable: true })
  inpostShipmentId?: number;

  @ManyToMany(() => OrderLine)
  @JoinTable()
  orderLines!: Relation<OrderLine[]>;
}
