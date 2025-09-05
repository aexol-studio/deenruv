import { LanguageCode } from "@deenruv/common/generated-types";
import { ConfigModule, DeenruvPlugin } from "@deenruv/core";

@DeenruvPlugin({
  imports: [ConfigModule],
  configuration: (config) => {
    config.defaultLanguageCode = LanguageCode.zh;
    return config;
  },
})
export class TestPluginWithConfig {
  static setup() {
    return TestPluginWithConfig;
  }
}
