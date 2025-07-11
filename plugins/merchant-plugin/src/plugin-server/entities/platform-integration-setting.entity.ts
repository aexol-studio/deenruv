import { DeepPartial } from "@deenruv/common/lib/shared-types.js";
import { DeenruvEntity } from "@deenruv/core";
import { Entity, Column, ManyToOne } from "typeorm";
import { MerchantPlatformSettingsEntity } from "./platform-integration-settings.entity.js";
import type { Relation } from "typeorm";

@Entity()
export class MerchantPlatformSetting extends DeenruvEntity {
  constructor(input?: DeepPartial<MerchantPlatformSetting>) {
    super(input);
  }

  @Column()
  key: string;

  @Column({ type: "text" })
  value: string;

  @ManyToOne(
    () => MerchantPlatformSettingsEntity,
    (settings) => settings.entries,
    { onDelete: "CASCADE" },
  )
  settingsEntity: Relation<MerchantPlatformSettingsEntity>;
}
