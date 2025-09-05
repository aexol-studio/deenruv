import { LanguageCode } from "@deenruv/common/src/generated-types";
import { type DeepPartial } from "@deenruv/common/src/shared-types";
import { type Relation, Column, Entity, Index, ManyToOne } from "typeorm";

import { Translation } from "../../common/types/locale-types";
import { HasCustomFields } from "../../config/custom-field/custom-field-types";
import { DeenruvEntity } from "../base/base.entity";
import { CustomProductOptionFieldsTranslation } from "../custom-entity-fields";

import { ProductOption } from "./product-option.entity";

@Entity()
export class ProductOptionTranslation
  extends DeenruvEntity
  implements Translation<ProductOption>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<ProductOption>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Index()
  @ManyToOne((type) => ProductOption, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Relation<ProductOption>;

  @Column((type) => CustomProductOptionFieldsTranslation)
  customFields: CustomProductOptionFieldsTranslation;
}
