import { LanguageCode } from "@deenruv/common/generated-types";
import { type DeepPartial } from "@deenruv/common/shared-types";
import { type Relation, Column, Entity, Index, ManyToOne } from "typeorm";

import { Translation } from "../../common/types/locale-types";
import { HasCustomFields } from "../../config/custom-field/custom-field-types";
import { DeenruvEntity } from "../base/base.entity";
import { CustomPromotionFieldsTranslation } from "../custom-entity-fields";

import { Promotion } from "./promotion.entity";

@Entity()
export class PromotionTranslation
  extends DeenruvEntity
  implements Translation<Promotion>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<Promotion>>) {
    super(input);
    // This is a workaround for the fact that
    // MySQL does not support default values on TEXT columns
    if (this.description === undefined) {
      this.description = "";
    }
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Column("text") description: string;

  @Index()
  @ManyToOne((type) => Promotion, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Relation<Promotion>;

  @Column((type) => CustomPromotionFieldsTranslation)
  customFields: CustomPromotionFieldsTranslation;
}
