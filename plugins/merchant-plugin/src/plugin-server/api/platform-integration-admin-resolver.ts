import { Args, Query, Resolver, Mutation } from "@nestjs/graphql";
import { Ctx, RequestContext, Transaction } from "@deenruv/core";
import { GooglePlatformIntegrationService } from "../services/google-platform-integration.service.js";
import { MerchantPlatformSetting } from "../entities/platform-integration-setting.entity.js";
import { PlatformIntegrationService } from "../services/platform-integration.service.js";
import { FacebookPlatformIntegrationService } from "../services/facebook-platform-integration.service.js";
import { MerchantPlatformSettingsEntity } from "../entities/platform-integration-settings.entity.js";

@Resolver()
export class PlatformIntegrationAdminResolver {
  constructor(
    private googlePlatformIntegrationService: GooglePlatformIntegrationService,
    private facebookPlatformIntegrationService: FacebookPlatformIntegrationService,
    private platformIntegrationService: PlatformIntegrationService,
  ) {}

  @Query()
  async getMerchantPlatformSettings(
    @Ctx() ctx: RequestContext,
    @Args() args: { platform: string },
  ) {
    return await this.platformIntegrationService.getBaseSettings(
      ctx,
      args.platform,
    );
  }

  @Query()
  async getMerchantPlatformInfo(
    @Ctx() ctx: RequestContext,
    @Args() args: { platform: string },
  ) {
    const settings = await this.platformIntegrationService.getBaseSettings(
      ctx,
      args.platform,
    );
    if (args.platform === "google") {
      return [
        {
          productsCount: 0,
          isValidConnection:
            settings?.entries.find((entry) => entry.key === "credentials")
              ?.value !== "",
        },
      ];
    }

    if (args.platform === "facebook") {
      return [
        {
          productsCount: 0,
          isValidConnection:
            settings?.entries.find((entry) => entry.key === "accessToken")
              ?.value !== "",
        },
      ];
    }
    return [{ productsCount: 0, isValidConnection: false }];
  }

  @Transaction()
  @Mutation()
  async saveMerchantPlatformSettings(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: MerchantPlatformSettingsEntity },
  ) {
    const settingsEntity = new MerchantPlatformSettingsEntity({
      platform: args.input.platform,
      entries: args.input.entries.map(
        (entry) => new MerchantPlatformSetting(entry),
      ),
    });

    const settings =
      await this.platformIntegrationService.savePlatformIntegrationSettings(
        ctx,
        settingsEntity,
      );

    return settings;
  }
}
