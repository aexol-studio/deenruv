import { describe, it, beforeAll, afterAll, expect } from "vitest";
import {
  Channel,
  CurrencyCode,
  LanguageCode,
  RequestContext,
} from "@deenruv/core";
import {
  createTestEnvironment,
  PostgresInitializer,
  registerInitializer,
  testConfig,
} from "@deenruv/testing";
import { PhoneNumberValidationPlugin } from "./index.js";
import { PhoneNumberValidationService } from "./service.js";
import { getTestOrder } from "./utils.js";

registerInitializer("postgres", new PostgresInitializer());
let service: PhoneNumberValidationService;

describe("test phone validation plugin", () => {
  const config = {
    ...testConfig,
    dbConnectionOptions: {
      type: "postgres",
    } as { type: "postgres" },
    plugins: [
      PhoneNumberValidationPlugin.init({
        requirePhoneNumber: true,
        defaultCountryCode: "PL",
        allowedCountryCodes: ["PL"],
      }),
    ],
  };
  const { server } = createTestEnvironment(config);

  beforeAll(async () => {
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
    service = server.app.get(PhoneNumberValidationService);
  }, 30_000);

  it("should define PhoneNumberValidationService", () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext({
    apiType: "shop",
    channel: new Channel({}),
    languageCode: LanguageCode.en,
    currencyCode: CurrencyCode.USD,
    authorizedAsOwnerOnly: false,
    isAuthorized: true,
  });
  it("should validate phone number for order with valid Polish number", async () => {
    const POLISH_ORDER = getTestOrder("+48 123 456 789");
    const result = await service.validatePhoneNumberForOrder(ctx, POLISH_ORDER);
    expect(result).toBeUndefined();
  });

  it("should return error for order with not allowed country code (e.g. Netherlands)", async () => {
    const NETHERLANDS_ORDER = getTestOrder("+31 123 456 789");
    const result = await service.validatePhoneNumberForOrder(
      ctx,
      NETHERLANDS_ORDER,
    );
    expect(result).toBe("phone number country NL is not allowed");
  });

  it("should return error for order with missing phone number", async () => {
    const ORDER_WITHOUT_PHONE = getTestOrder("");
    const result = await service.validatePhoneNumberForOrder(
      ctx,
      ORDER_WITHOUT_PHONE,
    );
    expect(result).toBe("missing required phone number");
  });

  it("should return error for order with invalid phone number format", async () => {
    const INVALID_ORDER = getTestOrder("+48 12345");
    const result = await service.validatePhoneNumberForOrder(
      ctx,
      INVALID_ORDER,
    );
    expect(result).toBe("+48 12345 is not a valid phone number for country PL");
  });

  it("should return error for order with invalid phone number for country", async () => {
    const INVALID_POLISH_ORDER = getTestOrder("+48 123 456 7890");
    const result = await service.validatePhoneNumberForOrder(
      ctx,
      INVALID_POLISH_ORDER,
    );
    expect(result).toBe(
      "+48 123 456 7890 is not a valid phone number for country PL",
    );
  });

  afterAll(async () => {
    await server.destroy();
  }, 30_000);
});
