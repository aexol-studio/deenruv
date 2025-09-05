import { LanguageCode } from "@deenruv/common/generated-types";
import { type DeepPartial } from "@deenruv/common/shared-types";
import { type Relation, Column, Entity, Index, ManyToOne } from "typeorm";

import { Translation } from "../../common/types/locale-types";
import { HasCustomFields } from "../../config/custom-field/custom-field-types";
import { DeenruvEntity } from "../base/base.entity";
import { CustomProductVariantFieldsTranslation } from "../custom-entity-fields";

import { ProductVariant } from "./product-variant.entity";

@Entity()
export class ProductVariantTranslation
  extends DeenruvEntity
  implements Translation<ProductVariant>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<ProductVariant>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Index()
  @ManyToOne((type) => ProductVariant, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Relation<ProductVariant>;

  @Column((type) => CustomProductVariantFieldsTranslation)
  customFields: CustomProductVariantFieldsTranslation;
}
