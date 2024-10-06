import { LanguageCode } from '@deenruv/common/lib/generated-types';
import { ConfigModule, VendurePlugin } from '@deenruv/core';

@VendurePlugin({
    imports: [ConfigModule],
    configuration: config => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        config.defaultLanguageCode = LanguageCode.zh;
        return config;
    },
})
export class TestPluginWithConfig {
    static setup() {
        return TestPluginWithConfig;
    }
}
