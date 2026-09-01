import {
  Permission,
  RequestContext,
} from "@deenruv/core";
import { describe, expect, it, vi } from "vitest";
import type { FacebookPlatformIntegrationService } from "../services/facebook-platform-integration.service.js";
import type { GooglePlatformIntegrationService } from "../services/google-platform-integration.service.js";
import type { PlatformIntegrationService } from "../services/platform-integration.service.js";
import { PlatformIntegrationAdminResolver } from "./platform-integration-admin-resolver.js";

vi.mock("../entities/platform-integration-setting.entity.js", () => ({
  MerchantPlatformSetting: class MerchantPlatformSetting {},
}));
vi.mock("../entities/platform-integration-settings.entity.js", () => ({
  MerchantPlatformSettingsEntity: class MerchantPlatformSettingsEntity {},
}));
vi.mock("../services/facebook-platform-integration.service.js", () => ({
  FacebookPlatformIntegrationService: class FacebookPlatformIntegrationService {},
}));
vi.mock("../services/google-platform-integration.service.js", () => ({
  GooglePlatformIntegrationService: class GooglePlatformIntegrationService {},
}));
vi.mock("../services/platform-integration.service.js", () => ({
  PlatformIntegrationService: class PlatformIntegrationService {},
}));

describe("PlatformIntegrationAdminResolver Google data-source discovery", () => {
  it("requires ReadSettings and delegates the requested account with context", async () => {
    const discoverGoogleMerchantDataSources = vi
      .fn()
      .mockResolvedValue(["accounts/123/dataSources/456"]);
    const resolver = new PlatformIntegrationAdminResolver(
      { discoverGoogleMerchantDataSources } as unknown as GooglePlatformIntegrationService,
      {} as FacebookPlatformIntegrationService,
      {} as PlatformIntegrationService,
    );
    const ctx = {} as RequestContext;

    await expect(
      resolver.getGoogleMerchantDataSources(ctx, { merchantId: "123" }),
    ).resolves.toEqual(["accounts/123/dataSources/456"]);
    expect(discoverGoogleMerchantDataSources).toHaveBeenCalledWith(ctx, "123");

    const handler = Object.getOwnPropertyDescriptor(
      PlatformIntegrationAdminResolver.prototype,
      "getGoogleMerchantDataSources",
    )?.value as (() => unknown) | undefined;
    if (!handler) throw new Error("Discovery resolver handler not found");
    expect(Reflect.getMetadata("__permissions__", handler)).toEqual([
      Permission.ReadSettings,
    ]);
  });
});
