import { DeepPartial } from "@deenruv/common/lib/shared-types.js";
import { DeenruvEntity } from "@deenruv/core";
import { Entity, Column, OneToMany } from "typeorm";
import { MerchantPlatformSetting } from "./platform-integration-setting.entity.js";
import type { Relation } from "typeorm";

@Entity()
export class MerchantPlatformSettingsEntity extends DeenruvEntity {
  constructor(input?: DeepPartial<MerchantPlatformSettingsEntity>) {
    super(input);
  }

  @Column()
  platform: string;

  @OneToMany(
    () => MerchantPlatformSetting,
    (setting) => setting.settingsEntity,
    { eager: true, cascade: true },
  )
  entries: Relation<Array<MerchantPlatformSetting>>;
}
