import { PluginCommonModule, Type, DeenruvPlugin, Product } from '@deenruv/core';

type PluginInitOptions = any;

@DeenruvPlugin({
    imports: [PluginCommonModule],
    entities: [Product],
    compatibility: '^0.0.0',
})
export class TestOnePlugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<TestOnePlugin> {
        this.options = options;
        return TestOnePlugin;
    }
}
