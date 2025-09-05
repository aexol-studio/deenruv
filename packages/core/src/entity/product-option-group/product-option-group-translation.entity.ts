import { LanguageCode } from "@deenruv/common/src/generated-types";
import { type DeepPartial } from "@deenruv/common/src/shared-types";
import { type Relation, Column, Entity, Index, ManyToOne } from "typeorm";

import { Translation } from "../../common/types/locale-types";
import { HasCustomFields } from "../../config/custom-field/custom-field-types";
import { DeenruvEntity } from "../base/base.entity";
import { CustomProductOptionGroupFieldsTranslation } from "../custom-entity-fields";

import { ProductOptionGroup } from "./product-option-group.entity";

@Entity()
export class ProductOptionGroupTranslation
  extends DeenruvEntity
  implements Translation<ProductOptionGroup>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<ProductOptionGroup>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Index()
  @ManyToOne((type) => ProductOptionGroup, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Relation<ProductOptionGroup>;

  @Column((type) => CustomProductOptionGroupFieldsTranslation)
  customFields: CustomProductOptionGroupFieldsTranslation;
}
