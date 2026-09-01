import { Args, Query, Resolver, Mutation } from "@nestjs/graphql";
import { Allow, Ctx, Permission, RequestContext } from "@deenruv/core";
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
  @Allow(Permission.ReadSettings)
  async getGoogleMerchantDataSources(
    @Ctx() ctx: RequestContext,
    @Args() args: { merchantId: string },
  ): Promise<string[]> {
    return this.googlePlatformIntegrationService.discoverGoogleMerchantDataSources(
      ctx,
      args.merchantId,
    );
  }

  @Query()
  async getMerchantPlatformSettings(
    @Ctx() ctx: RequestContext,
    @Args() args: { platform: string },
  ) {
    const settings = await this.platformIntegrationService.getBaseSettings(
      ctx,
      args.platform,
    );
    return settings ? this.redactCredentials(settings) : null;
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
      const diagnostic =
        await this.googlePlatformIntegrationService.getConnectionDiagnostic(ctx);
      return [
        {
          ...diagnostic,
          isValidConnection: diagnostic.connectionStatus === "CONNECTED",
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

  @Mutation()
  async sendAllProductsToMerchantPlatform(
    @Ctx() ctx: RequestContext,
    @Args() args: { platform: string },
  ) {
    return this.platformIntegrationService.enqueueFullSync(ctx, args.platform);
  }

  @Query()
  async getMerchantSyncHistory(
    @Ctx() ctx: RequestContext,
    @Args() args: { platform: string; take?: number },
  ) {
    return this.platformIntegrationService.getSyncHistory(
      ctx,
      args.platform,
      args.take,
    );
  }

  @Mutation()
  async saveMerchantPlatformSettings(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: MerchantPlatformSettingsEntity },
  ) {
    let entries = args.input.entries;
    if (
      args.input.platform === "google" &&
      entries.find((entry) => entry.key === "credentials")?.value === ""
    ) {
      const existing = await this.platformIntegrationService.getBaseSettings(
        ctx,
        "google",
      );
      const existingCredentials = existing?.entries.find(
        (entry) => entry.key === "credentials",
      )?.value;
      if (existingCredentials) {
        entries = entries.map((entry) =>
          entry.key === "credentials"
            ? { ...entry, value: existingCredentials }
            : entry,
        );
      }
    }
    const settingsEntity = new MerchantPlatformSettingsEntity({
      platform: args.input.platform,
      entries: entries.map(
        (entry) => new MerchantPlatformSetting(entry),
      ),
    });

    if (settingsEntity.platform === "google") {
      this.googlePlatformIntegrationService.validateGoogleSettings(
        settingsEntity,
      );
    }

    const settings =
      await this.platformIntegrationService.savePlatformIntegrationSettings(
        ctx,
        settingsEntity,
      );

    return settings ? this.redactCredentials(settings) : settings;
  }

  @Mutation()
  async removeOrphanItems(
    @Ctx() ctx: RequestContext,
    @Args() args: { platform: string },
  ) {
    return this.platformIntegrationService.removeOrphanItems(
      ctx,
      args.platform,
    );
  }

  private redactCredentials(
    settings: MerchantPlatformSettingsEntity,
  ): MerchantPlatformSettingsEntity {
    return {
      ...settings,
      entries: settings.entries.map((entry) =>
        entry.key === "credentials" ? { ...entry, value: "" } : entry,
      ),
    } as MerchantPlatformSettingsEntity;
  }
}
