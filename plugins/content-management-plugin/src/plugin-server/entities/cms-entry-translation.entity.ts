import { LanguageCode } from '@deenruv/common/lib/generated-types';
import { DeepPartial } from '@deenruv/common/lib/shared-types';
import { Translation, DeenruvEntity } from '@deenruv/core';
import { Relation, Column, Entity, Index, ManyToOne } from 'typeorm';
import { CMSEntry } from './cms-entry.entity';

@Entity()
export class CMSEntryTranslation extends DeenruvEntity implements Translation<CMSEntry> {
    constructor(input?: DeepPartial<Translation<CMSEntry>>) {
        super(input);
    }

    @Column('varchar') languageCode: LanguageCode;

    @Index({ unique: false })
    @Column()
    slug: string;

    @Column({ type: 'jsonb' })
    root: string;

    @Column({ type: 'jsonb' })
    content: string;

    @Column({ type: 'jsonb' })
    zones: string;

    @Index()
    @ManyToOne(() => CMSEntry, base => base.translations)
    base: Relation<CMSEntry>;
}
