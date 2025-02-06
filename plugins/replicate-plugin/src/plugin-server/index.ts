import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';
import { ReplicateAdminResolver } from './resolvers/replicate-admin.resolver.js';
import { ReplicateService } from './services/replicate.service.js';
import { ReplicateController } from './controllers/replicate.js';
import { REPLICATE_PLUGIN_OPTIONS } from './constants.js';
import { ReplicatePluginOptions } from './types.js';
import { AdminExtension } from './extensions/replicate.extension.js';
import { ReplicateEntity } from './entites/replicate.entity.js';
@DeenruvPlugin({
    compatibility: '^0.0.20',
    imports: [PluginCommonModule],
    entities: [ReplicateEntity],
    providers: [
        { provide: REPLICATE_PLUGIN_OPTIONS, useFactory: () => ReplicatePlugin.options },
        ReplicateService,
    ],
    controllers: [ReplicateController],
    adminApiExtensions: {
        schema: AdminExtension,
        resolvers: [ReplicateAdminResolver],
    },
})
export class ReplicatePlugin {
    private static options: ReplicatePluginOptions;
    static init(options: ReplicatePluginOptions) {
        this.options = options;
        return this;
    }
}
