import { LanguageCode } from "@deenruv/common/generated-types";
import { type DeepPartial } from "@deenruv/common/shared-types";
import { type Relation, Column, Entity, Index, ManyToOne } from "typeorm";

import { Translation } from "../../common/types/locale-types";
import { HasCustomFields } from "../../config/custom-field/custom-field-types";
import { DeenruvEntity } from "../base/base.entity";
import { CustomShippingMethodFieldsTranslation } from "../custom-entity-fields";
import { Product } from "../product/product.entity";

import { ShippingMethod } from "./shipping-method.entity";

@Entity()
export class ShippingMethodTranslation
  extends DeenruvEntity
  implements Translation<ShippingMethod>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<Product>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column({ default: "" }) name: string;

  @Column({ default: "" }) description: string;

  @Index()
  @ManyToOne((type) => ShippingMethod, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Relation<ShippingMethod>;

  @Column((type) => CustomShippingMethodFieldsTranslation)
  customFields: CustomShippingMethodFieldsTranslation;
}
