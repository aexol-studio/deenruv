import {
  DeenruvEntity,
  type DeepPartial,
  LanguageCode,
  Translation,
} from "@deenruv/core";
import { Column, Entity, Index, ManyToOne, Relation } from "typeorm";
import { ReviewEntity } from "./review.entity.js";

@Entity()
export class ReviewEntityTranslation
  extends DeenruvEntity
  implements Translation<ReviewEntity>
{
  constructor(input?: DeepPartial<ReviewEntityTranslation>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column("text") body: string;

  @Index()
  @ManyToOne(() => ReviewEntity, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Relation<ReviewEntity>;
}
