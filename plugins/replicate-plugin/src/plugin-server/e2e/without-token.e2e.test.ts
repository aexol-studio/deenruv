import { LanguageCode, DefaultJobQueuePlugin } from "@deenruv/core";
import { INestApplicationContext } from "@nestjs/common";
import {
  createTestEnvironment,
  PostgresInitializer,
  registerInitializer,
  testConfig,
} from "@deenruv/testing";
import test, { after, before, describe, it, beforeEach } from "node:test";
import { ReplicatePlugin } from "../index.js";
import { REPLICATE_PLUGIN_OPTIONS } from "../constants.js";
import { equal } from "assert";

registerInitializer("postgres", new PostgresInitializer());

describe("integration tests without replicate token", async () => {
  const deploymentName = "test";
  const apiToken = "test";

  if (!apiToken || !deploymentName) throw new Error("impossible");

  const config = {
    ...testConfig,
    dbConnectionOptions: {
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "deenruv",
      password: "deenruv",
      database: "deenruv",
      schema: "public",
    } as { type: "postgres" },
    plugins: [
      DefaultJobQueuePlugin.init({}),
      ReplicatePlugin.init({
        deploymentName,
        apiToken,
      }),
    ],
  };
  const { server } = createTestEnvironment(config);
  let app: INestApplicationContext;
  before(async () => {
    await server.init({
      initialData: {
        defaultLanguage: LanguageCode.en,
        defaultZone: "Europe",
        countries: [{ name: "Poland", code: "PL", zone: "Europe" }],
        taxRates: [],
        shippingMethods: [],
        paymentMethods: [],
        collections: [],
      },
    });
    app = server.app;
  });

  after(async () => {
    await server.destroy();
  });
  test("plugin loads api key", () => {
    equal(app.get(REPLICATE_PLUGIN_OPTIONS).apiToken, "test");
  });
});
