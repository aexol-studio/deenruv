import { LanguageCode } from "@deenruv/common/src/generated-types";
import { type DeepPartial } from "@deenruv/common/src/shared-types";
import { HasCustomFields, Translation, DeenruvEntity } from "@deenruv/core";
import { Column, Entity, Index, ManyToOne } from "typeorm";

import { ScaffoldEntity } from "./entity.template";

export class ScaffoldEntityCustomFieldsTranslation {}

@Entity()
export class ScaffoldTranslation
  extends DeenruvEntity
  implements Translation<ScaffoldEntity>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<ScaffoldTranslation>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() localizedName: string;

  @Index()
  @ManyToOne((type) => ScaffoldEntity, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: ScaffoldEntity;

  @Column((type) => ScaffoldEntityCustomFieldsTranslation)
  customFields: ScaffoldEntityCustomFieldsTranslation;
}
