import { Column, Entity, ManyToOne, OneToMany, Relation } from "typeorm";
import type {
  DeepPartial,
  LocaleString,
  Translatable,
  Translation,
} from "@deenruv/core";
import {
  Customer,
  DeenruvEntity,
  Order,
  Product,
  ProductVariant,
  User,
} from "@deenruv/core";
import { ReviewState } from "../constants.js";
import { ReviewEntityTranslation } from "./review-translation.entity.js";

@Entity()
export class ReviewEntity extends DeenruvEntity implements Translatable {
  constructor(input?: DeepPartial<ReviewEntity>) {
    super(input);
  }

  @Column({ default: false })
  keepAnonymous: boolean;

  @Column({ nullable: true, type: "simple-json" })
  assetKeys?: string[];

  @Column({
    type: "enum",
    enum: ReviewState,
    default: ReviewState.PENDING,
  })
  state: ReviewState;

  @Column("text", { nullable: true, default: null })
  response?: string;

  @Column({ nullable: true, default: null })
  responseCreatedAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  responseAuthor?: User;

  // ** Product review
  @ManyToOne(() => Product, { nullable: true })
  product?: Relation<Product>;

  // ** Product variant review
  @ManyToOne(() => ProductVariant, { nullable: true })
  productVariant?: Relation<ProductVariant>;

  // ** Order review
  @ManyToOne(() => Order, { nullable: true })
  order?: Relation<Order>;

  // ** if there are no product, variant or order, this is a shop review

  body: LocaleString;
  @OneToMany(() => ReviewEntityTranslation, (translation) => translation.base, {
    eager: true,
  })
  translations: Relation<Array<Translation<ReviewEntityTranslation>>>;

  @Column()
  rating: number;

  @ManyToOne(() => Customer, { nullable: true })
  author?: Relation<Customer>;

  @Column()
  authorName: string;

  @Column()
  authorEmailAddress: string;

  @Column({ nullable: true })
  authorLocation?: string;
}
