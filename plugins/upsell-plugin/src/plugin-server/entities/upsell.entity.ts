import { Product, DeenruvEntity } from "@deenruv/core";
import { JoinColumn, Unique, ManyToOne, Entity } from "typeorm";
import type { DeepPartial } from "@deenruv/core";
import type { Relation } from "typeorm";

@Entity()
@Unique(["base", "upsell"])
export class UpsellEntity extends DeenruvEntity {
  constructor(input?: DeepPartial<UpsellEntity>) {
    super(input);
  }

  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn()
  base: Relation<Product>;

  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn()
  upsell: Relation<Product>;
}
