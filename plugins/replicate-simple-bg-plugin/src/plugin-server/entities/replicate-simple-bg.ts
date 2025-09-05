import { DeenruvEntity, type DeepPartial } from "@deenruv/core";
import { Entity, Column } from "typeorm";

@Entity()
export class ReplicateSimpleBgEntity extends DeenruvEntity {
  constructor(input?: DeepPartial<ReplicateSimpleBgEntity>) {
    super(input);
  }

  @Column({ nullable: true, type: "varchar", length: 255 })
  prediction_simple_bg_id: string;

  @Column({ nullable: true, type: "varchar", length: 255 })
  output: string;

  @Column({ default: "starting" })
  status: string;

  @Column({ type: Date, nullable: true })
  finishedAt: Date | null;

  @Column({ nullable: true, type: "varchar", length: 255 })
  roomType: string;

  @Column({ nullable: true, type: "varchar", length: 255 })
  roomStyle: string;
}
