import { DeepPartial } from "@deenruv/common/lib/shared-types.js";
import { DeenruvEntity } from "@deenruv/core";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";
import { MerchantSyncRun } from "./merchant-sync-run.entity.js";

@Entity()
@Index(["offerId", "createdAt"])
export class MerchantSyncItem extends DeenruvEntity {
  constructor(input?: DeepPartial<MerchantSyncItem>) {
    super(input);
  }

  @Column({ type: "varchar" })
  offerId: string;

  @Column({ type: "varchar" })
  operation: string;

  @Column({ type: "varchar" })
  status: string;

  @Column({ nullable: true, type: "varchar" })
  errorCode: string | null;

  @Column({ type: "text", nullable: true })
  errorMessage: string | null;

  @Column({ default: 1, type: "int" })
  attempts: number;

  @ManyToOne(() => MerchantSyncRun, (run) => run.items, {
    onDelete: "CASCADE",
  })
  run: Relation<MerchantSyncRun>;
}
