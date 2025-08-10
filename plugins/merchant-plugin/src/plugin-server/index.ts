import {
  DeenruvPlugin,
  Injector,
  LanguageCode,
  PluginCommonModule,
} from "@deenruv/core";
import { OnApplicationBootstrap } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { PlatformIntegrationAdminResolver } from "./api/platform-integration-admin-resolver.js";
import { MERCHANT_PLUGIN_OPTIONS } from "./constants.js";
import { MerchantPlatformSetting } from "./entities/platform-integration-setting.entity.js";
import { MerchantPlatformSettingsEntity } from "./entities/platform-integration-settings.entity.js";
import { adminApiExtensions } from "./extensions/api-extensions.js";
import { FacebookPlatformIntegrationService } from "./services/facebook-platform-integration.service.js";
import { GooglePlatformIntegrationService } from "./services/google-platform-integration.service.js";
import { MerchantStrategyService } from "./services/merchant-strategy.service.js";
import { PlatformIntegrationService } from "./services/platform-integration.service.js";
import { SubscriberService } from "./services/subscriber.service.js";
import {
  FacebookProduct,
  GoogleProduct,
  MerchantExportStrategy,
  MerchantPluginOptions,
} from "./types.js";
@DeenruvPlugin({
  compatibility: "^2.0.0",
  imports: [PluginCommonModule],
  entities: [MerchantPlatformSetting, MerchantPlatformSettingsEntity],
  shopApiExtensions: {},
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [PlatformIntegrationAdminResolver],
  },
  providers: [
    {
      provide: MERCHANT_PLUGIN_OPTIONS,
      useFactory: () => MerchantPlugin.options,
    },
    MerchantStrategyService,
    PlatformIntegrationService,
    GooglePlatformIntegrationService,
    FacebookPlatformIntegrationService,
    SubscriberService,
  ],
  configuration: (config) => {
    config.customFields.ProductVariant.push({
      type: "string",
      name: "communicateID",
      readonly: true,
      label: [
        { languageCode: LanguageCode.pl, value: "ID komunikacji" },
        { languageCode: LanguageCode.en, value: "Communication ID" },
      ],
      description: [
        {
          languageCode: LanguageCode.pl,
          value: "ID do komunikacji z facebookiem lub googlem",
        },
        {
          languageCode: LanguageCode.en,
          value: "ID for communication with Facebook or Google",
        },
      ],
    });
    return config;
  },
})
class MerchantPlugin implements OnApplicationBootstrap {
  static options: MerchantPluginOptions;
  constructor(private moduleRef: ModuleRef) {}

  static init(options: MerchantPluginOptions) {
    this.options = options;
    return this;
  }

  async onApplicationBootstrap() {
    await this.initMerchantStrategy();
  }

  async onApplicationShutdown() {
    await this.destroyMerchantStrategy();
  }

  private async initMerchantStrategy(): Promise<void> {
    const injector = new Injector(this.moduleRef);
    const service = injector.get(MerchantStrategyService);
    if (typeof service.strategy.init === "function") {
      await service.strategy.init(injector);
    }
  }

  private async destroyMerchantStrategy(): Promise<void> {
    const injector = new Injector(this.moduleRef);
    const service = injector.get(MerchantStrategyService);
    if (typeof service.strategy.destroy === "function") {
      await service.strategy.destroy();
    }
  }
}

export {
  FacebookProduct,
  GoogleProduct,
  MerchantExportStrategy,
  MerchantPlugin,
};
