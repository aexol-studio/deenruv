import { LanguageCode, DeenruvEntity } from "@deenruv/core";
import type { DeepPartial } from "@deenruv/core";
import { ManyToOne, Column, Entity, Index } from "typeorm";
import { Badge } from "./Badge.js";
import type { Relation } from "typeorm";

@Entity()
export class BadgeTranslation extends DeenruvEntity {
  constructor(input?: DeepPartial<BadgeTranslation>) {
    super(input);
  }

  @Index()
  @ManyToOne(() => Badge, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Relation<Badge>;

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;
}
