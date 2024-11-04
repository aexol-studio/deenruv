import { Injectable } from '@nestjs/common';
import {
    TransactionalConnection,
    Logger,
    RequestContext,
    TranslatableSaver,
    TranslatorService,
    ChannelService,
} from '@deenruv/core';
import { CMSEntry } from '../entities/cms-entry.entity';
import { CMSEntryTranslation } from '../entities/cms-entry-translation.entity';

@Injectable()
export class CMSService {
    private readonly logger = new Logger();
    private readonly log = (msg: string) => this.logger.log(msg, 'CMSService');

    constructor(
        private connection: TransactionalConnection,
        private translatableSaver: TranslatableSaver,
        private translator: TranslatorService,
        private channelService: ChannelService,
    ) {}

    async getEntry(ctx: RequestContext, slug: string) {
        const entry = await this.connection.getRepository(ctx, CMSEntry).findOne({
            where: { translations: { base: { slug: slug } } },
        });
        if (!entry) return;
        return this.translator.translate(entry, ctx);
    }

    async upsertEntry(
        ctx: RequestContext,
        slug: string,
        data: { root: string; content: string; zones: string },
    ) {
        const oldTranslations =
            (await this.connection.getRepository(ctx, CMSEntryTranslation).find({ where: { slug } })) || [];
        const existing = oldTranslations.find(t => t.languageCode === ctx.languageCode);
        const translation = {
            ...(existing || {}),
            languageCode: ctx.languageCode,
            slug,
            root: data.root,
            content: data.content,
            zones: data.zones,
        };
        const result = await this.translatableSaver.create({
            ctx,
            entityType: CMSEntry,
            translationType: CMSEntryTranslation,
            input: { translations: [...oldTranslations, translation] },
        });
        const defaultChannel = await this.channelService.getDefaultChannel(ctx);
        await this.channelService.assignToChannels(ctx, CMSEntry, result.id, [
            ctx.channelId,
            defaultChannel.id,
        ]);
        return this.translator.translate(result, ctx);
    }
}
