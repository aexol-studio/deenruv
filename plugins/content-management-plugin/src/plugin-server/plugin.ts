import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';
import { CMSController } from './controllers/cms-controller';
import { CMSEntry } from './entities/cms-entry.entity';
import { CMSEntryTranslation } from './entities/cms-entry-translation.entity';
import { CMSService } from './services/cms.service';

@DeenruvPlugin({
    compatibility: '0.0.1',
    imports: [PluginCommonModule],
    providers: [CMSService],
    entities: [CMSEntry, CMSEntryTranslation],
    controllers: [CMSController],
})
export class ContentManagementPlugin {}
