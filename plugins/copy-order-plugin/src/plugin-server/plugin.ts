import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';
import { AdminResolver } from './resolvers/admin.resolver';
import { PLUGIN_INIT_OPTIONS } from './constants';
import { ADMIN_API_EXTENSION } from './extensions/admin.extension.js';

@DeenruvPlugin({
    compatibility: '^0.0.0',
    imports: [PluginCommonModule],
    controllers: [],
    entities: [],
    providers: [{ provide: PLUGIN_INIT_OPTIONS, useFactory: () => CopyOrderPlugin.options }],
    adminApiExtensions: {
        schema: ADMIN_API_EXTENSION,
        resolvers: [AdminResolver],
    },
})
export class CopyOrderPlugin {
    private static options: {};

    static init(options: {}) {
        CopyOrderPlugin.options = options;
        return this;
    }
}
