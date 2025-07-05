import { LanguageCode } from "@deenruv/core";
import {
  createTestEnvironment,
  PostgresInitializer,
  registerInitializer,
  testConfig,
} from "@deenruv/testing";
import { doesNotReject } from "node:assert";
import test, { after, before, describe } from "node:test";
import { Przelewy24Plugin } from "../index.js";
import { Przelewy24Service } from "../services/przelewy24.service.js";
import { Przelewy24PluginConfiguration } from "../types.js";

registerInitializer("postgres", new PostgresInitializer());

//@ts-expect-error - this is a test and we can return undefined if the env vars are not set
const envConfig = ((): Przelewy24PluginConfiguration => {
  const {
    CARD_MARKET_APP_TOKEN: appToken,
    CARD_MARKET_APP_SECRET: appSecret,
    CARD_MARKET_ACCESS_TOKEN_SECRET: accessTokenSecret,
    CARD_MARKET_ACCESS_TOKEN: accessToken,
  } = process.env;
  if (appToken && appSecret && accessToken && accessTokenSecret) {
    return {
      "pl-channel": {
        PRZELEWY24_CLIENT_SECRET: "",
        PRZELEWY24_CRC: "",
        PRZELEWY24_POS_ID: "",
      },
      returnUrl: () => "http://localhost:4200",
      apiUrl: "https://sincere-swift-oddly.ngrok-free.app",
      przelewy24Host: "https://sandbox.przelewy24.pl",
    };
  }
})();

describe("test cardmarket plugin", { skip: !envConfig }, async () => {
  const config = {
    ...testConfig,
    dbConnectionOptions: {
      type: "postgres",
    } as { type: "postgres" },
    plugins: [Przelewy24Plugin.init(envConfig)],
  };
  const { server } = createTestEnvironment(config);
  let przelewy24Service: Przelewy24Service;
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
    przelewy24Service = server.app.get(Przelewy24Service);
  });

  after(async () => {
    await server.destroy();
  });

  // await test("get product by id", async () => {
  //   await doesNotReject(cardMarketService.getProduct(261421));
  // });
  // await test("list products", async () => {
  //   await doesNotReject(cardMarketService.productList());
  // });
  // await test("check if stock exports", async () => {
  //  await doesNotReject(cardMarketService.requestStockExport());
  // });
  // await test("fetch stock exports", async () => {
  //  await doesNotReject(cardMarketService.fetchStockExports());
  // });
  // await test("decrease stock", async () => {
  //  await doesNotReject(cardMarketService.stockDecrease([{ articleId: 1718498926, quantity: 1 }]));
  // });
  // await test("decrease stock", async () => {
  //   await doesNotReject(
  //     cardMarketService.stockIncrease([{ articleId: 1718498926, quantity: 1 }])
  //   );
  // });
});
