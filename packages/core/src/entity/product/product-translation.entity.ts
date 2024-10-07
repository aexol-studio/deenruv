import { LanguageCode } from '@deenruv/common/lib/generated-types';
import { DeepPartial } from '@deenruv/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { DeenruvEntity } from '../base/base.entity';
import { CustomProductFieldsTranslation } from '../custom-entity-fields';

import { Product } from './product.entity';

@Entity()
export class ProductTranslation extends DeenruvEntity implements Translation<Product>, HasCustomFields {
    constructor(input?: DeepPartial<Translation<Product>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Column() name: string;

    @Index({ unique: false })
    @Column()
    slug: string;

    @Column('text') description: string;

    @Index()
    @ManyToOne(type => Product, base => base.translations)
    base: Product;

    @Column(type => CustomProductFieldsTranslation)
    customFields: CustomProductFieldsTranslation;
}
