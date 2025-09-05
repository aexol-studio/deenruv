import { LanguageCode } from "@deenruv/common/generated-types";
import { type DeepPartial } from "@deenruv/common/shared-types";
import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";

import { Translation } from "../../common/types/locale-types";
import { HasCustomFields } from "../../config/custom-field/custom-field-types";
import { DeenruvEntity } from "../base/base.entity";
import { CustomCollectionFieldsTranslation } from "../custom-entity-fields";

import { Collection } from "./collection.entity";

@Entity()
export class CollectionTranslation
  extends DeenruvEntity
  implements Translation<Collection>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<Collection>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Index({ unique: false })
  @Column()
  slug: string;

  @Column("text") description: string;

  @Index()
  @ManyToOne((type) => Collection, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Relation<Collection>;

  @Column((type) => CustomCollectionFieldsTranslation)
  customFields: CustomCollectionFieldsTranslation;
}
