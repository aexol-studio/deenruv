import { DeepPartial } from "@deenruv/common/lib/shared-types.js";
import { DeenruvEntity } from "@deenruv/core";
import { Column, Entity, Index, OneToMany } from "typeorm";
import type { Relation } from "typeorm";
import { MerchantSyncItem } from "./merchant-sync-item.entity.js";

export type MerchantSyncRunStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "PARTIAL"
  | "FAILED";

@Entity()
@Index(["platform", "createdAt"])
export class MerchantSyncRun extends DeenruvEntity {
  constructor(input?: DeepPartial<MerchantSyncRun>) {
    super(input);
  }

  @Column({ type: "varchar" })
  platform: string;

  @Column({ type: "varchar" })
  trigger: string;

  @Column({ default: "PENDING", type: "varchar" })
  status: MerchantSyncRunStatus;

  @Column({ nullable: true, type: "varchar" })
  jobId: string | null;

  @Column({ default: 0, type: "int" })
  total: number;

  @Column({ default: 0, type: "int" })
  succeeded: number;

  @Column({ default: 0, type: "int" })
  failed: number;

  @Column({ type: "text", nullable: true })
  errorSummary: string | null;

  @Column({ type: "timestamp", nullable: true })
  startedAt: Date | null;

  @Column({ type: "timestamp", nullable: true })
  finishedAt: Date | null;

  @OneToMany(() => MerchantSyncItem, (item) => item.run, {
    cascade: true,
  })
  items: Relation<MerchantSyncItem[]>;
}
