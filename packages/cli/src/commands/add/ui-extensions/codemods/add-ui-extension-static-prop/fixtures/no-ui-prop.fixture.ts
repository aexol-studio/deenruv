import { PluginCommonModule, Type, DeenruvPlugin } from '@deenruv/core';

type PluginInitOptions = any;

@DeenruvPlugin({
    imports: [PluginCommonModule],
    compatibility: '^2.0.0',
})
export class TestOnePlugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<TestOnePlugin> {
        this.options = options;
        return TestOnePlugin;
    }
}
