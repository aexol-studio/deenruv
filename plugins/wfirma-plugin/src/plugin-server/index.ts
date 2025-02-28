import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';
import { AdminUiExtension } from '@deenruv/ui-devkit/compiler';
import path from 'path';
import { WFirmaService } from './services/wfirma.service';
import { WFirmaPluginConfig } from './types';
import { PLUGIN_INIT_OPTIONS } from './constants';
import { WFirmaAdminExtension } from './extensions/wfirma.extension';
import { WFirmaAdminResolver } from './api/wfirma-admin.resolver';

@DeenruvPlugin({
    compatibility: '^2.0.0',
    imports: [PluginCommonModule],
    providers: [WFirmaService, { provide: PLUGIN_INIT_OPTIONS, useFactory: () => WFirmaPlugin.config }],
    adminApiExtensions: {
        schema: WFirmaAdminExtension,
        resolvers: [WFirmaAdminResolver],
    },
    configuration: config => {
        config.customFields.Order.push({
            type: 'string',
            name: 'wfirmaInvoiceId',
            internal: true,
            nullable: true,
            defaultValue: '',
        });
        return config;
    },
})
export class WFirmaPlugin {
    static config: WFirmaPluginConfig;

    static init(config: WFirmaPluginConfig) {
        this.config = config;
        return this;
    }

    static ui: AdminUiExtension = {
        id: 'WFirma-extension',
        extensionPath: path.join(__dirname, 'ui'),
        providers: ['providers.ts'],
        globalStyles: [path.join(__dirname, 'ui/styles/overwrite.css')],
        translations: {},
    };
}
