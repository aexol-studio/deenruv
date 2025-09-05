import { LanguageCode } from "@deenruv/common/src/generated-types";
import { type DeepPartial } from "@deenruv/common/src/shared-types";
import { type Relation, Column, Entity, Index, ManyToOne } from "typeorm";

import { Translation } from "../../common/types/locale-types";
import { DeenruvEntity } from "../base/base.entity";
import { CustomFacetValueFieldsTranslation } from "../custom-entity-fields";

import { FacetValue } from "./facet-value.entity";

@Entity()
export class FacetValueTranslation
  extends DeenruvEntity
  implements Translation<FacetValue>
{
  constructor(input?: DeepPartial<Translation<FacetValue>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Index()
  @ManyToOne((type) => FacetValue, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Relation<FacetValue>;

  @Column((type) => CustomFacetValueFieldsTranslation)
  customFields: CustomFacetValueFieldsTranslation;
}
