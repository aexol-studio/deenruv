import { CurrencyCode } from "@deenruv/common/generated-types";
import { type DeepPartial, type ID } from "@deenruv/common/shared-types";
import { type Relation, Column, Entity, Index, ManyToOne } from "typeorm";

import { HasCustomFields } from "../../config/custom-field/custom-field-types";
import { DeenruvEntity } from "../base/base.entity";
import { CustomProductVariantPriceFields } from "../custom-entity-fields";
import { EntityId } from "../entity-id.decorator";
import { Money } from "../money.decorator";

import { ProductVariant } from "./product-variant.entity";

/**
 * @description
 * A ProductVariantPrice is a Channel-specific price for a ProductVariant. For every Channel to
 * which a ProductVariant is assigned, there will be a corresponding ProductVariantPrice entity.
 *
 * @docsCategory entities
 */
@Entity()
export class ProductVariantPrice
  extends DeenruvEntity
  implements HasCustomFields
{
  constructor(input?: DeepPartial<ProductVariantPrice>) {
    super(input);
  }

  @Money() price: number;

  @EntityId({ nullable: true }) channelId: ID;

  @Column("varchar")
  currencyCode: CurrencyCode;

  @Index()
  @ManyToOne(
    (type) => ProductVariant,
    (variant) => variant.productVariantPrices,
    { onDelete: "CASCADE" },
  )
  variant: Relation<ProductVariant>;

  @Column((type) => CustomProductVariantPriceFields)
  customFields: CustomProductVariantPriceFields;
}
