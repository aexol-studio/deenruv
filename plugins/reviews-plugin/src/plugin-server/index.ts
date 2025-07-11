import { PluginCommonModule, DeenruvPlugin, Injector } from "@deenruv/core";
import { AdminAPIExtension } from "./extensions/admin-api.extension.js";
import { ShopAPIExtension } from "./extensions/shop-api.extension.js";
import type { ReviewsPluginOptions } from "./types.js";
import { REVIEWS_PLUGIN_OPTIONS } from "./constants.js";
import { ReviewEntity } from "./entities/review.entity.js";
import { ReviewsShopAPIResolver } from "./api/shop-api.resolver.js";
import { ReviewsAdminAPIResolver } from "./api/admin-api.resolver.js";
import { ReviewEntityTranslation } from "./entities/review-translation.entity.js";
import { ReviewsService } from "./services/reviews.service.js";
import { ReviewStateMachine } from "./state/reviews.state.js";
import { OnApplicationBootstrap } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ReviewAssetResolver } from "./api/review-asset.resolver.js";
import { ReviewProductResolver } from "./api/review-product.resolver.js";
import { ReviewOrderResolver } from "./api/review-order.resolver.js";
import { ReviewCustomerResolver } from "./api/review-customer.resolver.js";
@DeenruvPlugin({
  compatibility: "0.0.1",
  imports: [PluginCommonModule],
  entities: [ReviewEntity, ReviewEntityTranslation],
  adminApiExtensions: {
    schema: AdminAPIExtension,
    resolvers: [ReviewsAdminAPIResolver, ReviewAssetResolver],
  },
  shopApiExtensions: {
    schema: ShopAPIExtension,
    resolvers: [
      ReviewsShopAPIResolver,
      ReviewAssetResolver,
      ReviewProductResolver,
      ReviewOrderResolver,
      ReviewCustomerResolver,
    ],
  },
  providers: [
    {
      provide: REVIEWS_PLUGIN_OPTIONS,
      useFactory: () => ReviewsPlugin.options,
    },
    ReviewsService,
    ReviewStateMachine,
  ],
})
class ReviewsPlugin implements OnApplicationBootstrap {
  static options: ReviewsPluginOptions;
  constructor(private moduleRef: ModuleRef) {}

  static init(options: ReviewsPluginOptions) {
    this.options = options;
    return this;
  }

  async onApplicationBootstrap() {
    await this.initTranslationStrategy();
  }

  async onApplicationShutdown() {
    await this.destroyTranslationStrategy();
  }

  private async initTranslationStrategy(): Promise<void> {
    const injector = new Injector(this.moduleRef);
    const service = injector.get(ReviewsService);
    if (
      service.translateStrategy &&
      typeof service.translateStrategy.init === "function"
    ) {
      await service.translateStrategy.init(injector);
    }
  }

  private async destroyTranslationStrategy(): Promise<void> {
    const injector = new Injector(this.moduleRef);
    const service = injector.get(ReviewsService);
    if (
      service.translateStrategy &&
      typeof service.translateStrategy.destroy === "function"
    ) {
      await service.translateStrategy.destroy();
    }
  }
}
export { TranslateReviewStrategy } from "./types.js";
export { ReviewsPlugin };
