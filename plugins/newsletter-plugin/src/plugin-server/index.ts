import { Injector, PluginCommonModule, DeenruvPlugin } from "@deenruv/core";

import { DefaultNewsletterStrategy } from "./strategies/default-newsletter-strategy.js";
import { NewsletterPluginOptions, NewsletterStrategy } from "./types.js";

import { ModuleRef } from "@nestjs/core";
import { OnApplicationBootstrap } from "@nestjs/common";
import { NEWSLETTER_PLUGIN_OPTIONS } from "./constants.js";
import { NewsletterService } from "./services/newsletter-service.js";
import { shopApiExtension } from "./extensions/api-extension.js";
import { NewsletterShopResolver } from "./api/newsletter-shop-resolver.js";
@DeenruvPlugin({
  compatibility: "^0.0.40",
  imports: [PluginCommonModule],
  providers: [
    {
      provide: NEWSLETTER_PLUGIN_OPTIONS,
      useFactory: () => NewsletterPlugin.options,
    },
    NewsletterService,
  ],
  shopApiExtensions: {
    schema: shopApiExtension,
    resolvers: [NewsletterShopResolver],
  },
  configuration: (config) => {
    return config;
  },
})
class NewsletterPlugin implements OnApplicationBootstrap {
  static options: NewsletterPluginOptions;
  constructor(private moduleRef: ModuleRef) {}

  static init(options: NewsletterPluginOptions) {
    this.options = options;
    return this;
  }

  async onApplicationBootstrap() {
    await this.initStrategy();
  }

  async onApplicationShutdown() {
    await this.destroyStrategy();
  }

  private async initStrategy(): Promise<void> {
    const injector = new Injector(this.moduleRef);
    const service = injector.get(NewsletterService);
    if (typeof service.strategy.init === "function") {
      await service.strategy.init(injector);
    }
  }

  private async destroyStrategy(): Promise<void> {
    const injector = new Injector(this.moduleRef);
    const service = injector.get(NewsletterService);
    if (typeof service.strategy.destroy === "function") {
      await service.strategy.destroy();
    }
  }
}
export { NewsletterPlugin, DefaultNewsletterStrategy, NewsletterStrategy };
