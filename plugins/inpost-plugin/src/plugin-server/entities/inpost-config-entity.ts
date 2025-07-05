import { DeenruvEntity, DeepPartial, ShippingMethod } from "@deenruv/core";
import { Column, Entity, JoinColumn, OneToOne, Relation } from "typeorm";
import { Service } from "@deenruv/inpost";

@Entity()
export class InpostConfigEntity extends DeenruvEntity {
  constructor(data: DeepPartial<InpostConfigEntity>) {
    super(data);
  }

  @OneToOne(() => ShippingMethod)
  @JoinColumn()
  shippingMethod!: Relation<ShippingMethod>;

  @Column("text")
  host!: string;

  @Column("text")
  apiKey!: string;

  @Column("text", { nullable: true })
  geowidgetKey!: string;

  @Column("bigint")
  inpostOrganization!: number;

  @Column("text")
  service!: Service;
}
