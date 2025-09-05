import { type DeepPartial } from "@deenruv/common/shared-types";
import { DeenruvEntity } from "@deenruv/core";
import { Column, Entity } from "typeorm";

@Entity()
export class OrderRealizationEntity extends DeenruvEntity {
  constructor(input?: DeepPartial<OrderRealizationEntity>) {
    super(input);
  }

  @Column({ nullable: true })
  key: string;

  //shouldnt be nullable
  @Column({ nullable: true })
  customerID: string;

  @Column()
  orderID: string;

  @Column()
  assetID: string;

  @Column()
  plannedAt: string;

  @Column()
  color: string;

  @Column({ nullable: true })
  finalPlannedAt: string;

  @Column({ nullable: true })
  note: string;
}
