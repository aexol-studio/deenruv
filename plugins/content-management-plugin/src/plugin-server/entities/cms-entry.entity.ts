import {
    ChannelAware,
    Channel,
    DeepPartial,
    DeenruvEntity,
    Translatable,
    Translation,
    LocaleString,
} from '@deenruv/core';
import { Relation, OneToMany, Entity, JoinTable, ManyToMany } from 'typeorm';
import { CMSEntryTranslation } from './cms-entry-translation.entity';

@Entity()
export class CMSEntry extends DeenruvEntity implements Translatable, ChannelAware {
    constructor(input?: DeepPartial<CMSEntry>) {
        super(input);
    }

    @ManyToMany(() => Channel)
    @JoinTable()
    channels: Array<Relation<Channel>>;

    slug: LocaleString;
    root: LocaleString;
    content: LocaleString;
    zones: LocaleString;

    @OneToMany(() => CMSEntryTranslation, translation => translation.base, {
        eager: true,
    })
    translations: Array<Relation<Translation<CMSEntryTranslation>>>;
}
