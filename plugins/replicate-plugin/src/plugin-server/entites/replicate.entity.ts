import { DeenruvEntity } from "@deenruv/core";
import { Entity, Column, CreateDateColumn } from "typeorm";
import type { DeepPartial, ID } from "@deenruv/core";
import "reflect-metadata";

@Entity()
export class ReplicateEntity extends DeenruvEntity {
  constructor(input?: DeepPartial<ReplicateEntity>) {
    super(input);
  }

  @Column({ nullable: true, type: "varchar", length: 255 })
  prediction_id: string;

  @Column("simple-json", { nullable: true })
  output: [{ customerId: ID; score: number }];

  @Column({ default: "starting" })
  status: string;

  @Column({ type: Date, nullable: true })
  finishedAt: Date | null;
}
