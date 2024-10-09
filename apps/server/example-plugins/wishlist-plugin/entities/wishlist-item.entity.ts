import { DeepPartial, ID, ProductVariant, DeenruvEntity } from '@deenruv/core';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class WishlistItem extends DeenruvEntity {
    constructor(input?: DeepPartial<WishlistItem>) {
        super(input);
    }

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @Column()
    productVariantId: ID;
}
