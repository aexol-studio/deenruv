import { DeenruvEntity } from '@deenruv/core';
import { ManyToOne, Column, Entity, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import type { DeepPartial, LocaleString, Translatable, Translation } from '@deenruv/core';
import { Product } from '@deenruv/core';
import { BadgeTranslation } from './BadgeTranslation.js';

@Entity()
export class Badge extends DeenruvEntity implements Translatable {
    constructor(input?: DeepPartial<Badge>) {
        super(input);
    }

    //@ts-expect-error 123
    @ManyToOne(() => Product, product => product.badges, {
        onDelete: 'CASCADE',
    })
    product: Relation<Product>;

    name: LocaleString;

    @Column()
    color: string;

    @Column()
    productId: string;

    @OneToMany(() => BadgeTranslation, translation => translation.base, {
        eager: true,
    })
    translations: Relation<Array<Translation<Badge>>>;
}
