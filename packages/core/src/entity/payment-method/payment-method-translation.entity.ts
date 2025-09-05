import { LanguageCode } from "@deenruv/common/src/generated-types";
import { type DeepPartial } from "@deenruv/common/src/shared-types";
import { type Relation, Column, Entity, Index, ManyToOne } from "typeorm";

import { Translation } from "../../common/types/locale-types";
import { HasCustomFields } from "../../config/custom-field/custom-field-types";
import { DeenruvEntity } from "../base/base.entity";
import { CustomPaymentMethodFieldsTranslation } from "../custom-entity-fields";

import { PaymentMethod } from "./payment-method.entity";

@Entity()
export class PaymentMethodTranslation
  extends DeenruvEntity
  implements Translation<PaymentMethod>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<PaymentMethod>>) {
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
  @ManyToOne((type) => PaymentMethod, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Relation<PaymentMethod>;

  @Column((type) => CustomPaymentMethodFieldsTranslation)
  customFields: CustomPaymentMethodFieldsTranslation;
}
