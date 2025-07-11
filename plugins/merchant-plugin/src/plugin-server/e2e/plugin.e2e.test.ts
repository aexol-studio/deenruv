import { LanguageCode } from "@deenruv/core";
import {
  createTestEnvironment,
  PostgresInitializer,
  registerInitializer,
  testConfig,
} from "@deenruv/testing";
import { after, before, describe, it } from "node:test";
import { MerchantPlugin } from "../index.js";
import { ok } from "assert";
import { PlatformIntegrationService } from "../services/platform-integration.service.js";

registerInitializer("postgres", new PostgresInitializer());

describe("test merchant plugin", async () => {
  // const config = {
  //   ...testConfig,
  //   dbConnectionOptions: {
  //     type: "postgres",
  //   } as { type: "postgres" },
  //   plugins: [MerchantPlugin],
  // };
  // const { server } = createTestEnvironment(config);
  // let magicznyRynekService: PlatformIntegrationService;
  // before(async () => {
  //   await server.init({
  //     initialData: {
  //       defaultLanguage: LanguageCode.en,
  //       defaultZone: "Europe",
  //       countries: [{ name: "Poland", code: "PL", zone: "Europe" }],
  //       taxRates: [],
  //       shippingMethods: [],
  //       paymentMethods: [],
  //       collections: [],
  //     },
  //   });
  //   magicznyRynekService = server.app.get(PlatformIntegrationService);
  // });
  // after(async () => {
  //   await server.destroy();
  // });
  // it("should define MagicznyRynekService", () => {
  //   ok(magicznyRynekService, "MagicznyRynekService is not defined");
  // });
});
