import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';
import { AdminResolver } from './resolvers/admin.resolver';
import { PLUGIN_INIT_OPTIONS } from './constants';
import { ADMIN_API_EXTENSION } from './extensions/admin.extension.js';
import { CopyOrderResultResolver, CopyOrderService } from './services/copy-order.service.js';
import { CopyOrderPluginOptions } from './types.js';

@DeenruvPlugin({
    compatibility: '^0.0.0',
    imports: [PluginCommonModule],
    providers: [
        { provide: PLUGIN_INIT_OPTIONS, useFactory: () => CopyOrderPlugin.options },
        CopyOrderService,
    ],
    adminApiExtensions: { schema: ADMIN_API_EXTENSION, resolvers: [AdminResolver, CopyOrderResultResolver] },
})
export class CopyOrderPlugin {
    private static options: CopyOrderPluginOptions;

    static init(options: CopyOrderPluginOptions) {
        this.options = options;
        return this;
    }
}
