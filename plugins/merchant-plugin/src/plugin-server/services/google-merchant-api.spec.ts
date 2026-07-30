import { describe, expect, it } from "vitest";
import type { GoogleProduct } from "../types.js";
import {
  buildGoogleProductIdentifier,
  buildGoogleProductInputName,
  buildGoogleProductName,
  collectGoogleProductsForDataSource,
  createGoogleDeleteOperation,
  createGoogleInsertOperation,
  createGoogleMerchantClients,
  createGoogleUpdateOperation,
  diagnoseGoogleMerchantConnection,
  executeGoogleWriteOperations,
  GoogleProductInputsWriter,
  GoogleDataSourcesReader,
  GoogleProductsReader,
  normalizeGoogleMerchantError,
  parseGoogleMerchantSettings,
  runBoundedMerchantOperations,
  selectRemoteOrphanProducts,
  summarizeMerchantOperations,
  toGoogleProductInput,
  validateGoogleProductUrls,
} from "./google-merchant-api.js";

const credentialJson = JSON.stringify({
  type: "service_account",
  client_email: "merchant-test@example.invalid",
  private_key: "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----\n",
  project_id: "merchant-test",
});

function createSettings() {
  return parseGoogleMerchantSettings([
    { key: "merchantId", value: " 123456 " },
    {
      key: "dataSource",
      value: " accounts/123456/dataSources/987654 ",
    },
    { key: "brand", value: " Deenruv " },
    { key: "credentials", value: credentialJson },
    { key: "autoUpdate", value: "TRUE" },
  ]);
}

function createProduct(communicateID = "sku-123"): GoogleProduct {
  return {
    communicateID,
    variantID: "variant-1",
    productAttributes: {
      availability: "IN_STOCK",
      customLabel_0: "label",
      price: { amountMicros: "12990000", currencyCode: "PLN" },
      title: "Test product",
    },
  };
}

describe("Google Merchant settings", () => {
  it("normalizes and validates the account-scoped dataSource", () => {
    const settings = createSettings();

    expect(settings).toMatchObject({
      accountId: "123456",
      autoUpdate: true,
      brand: "Deenruv",
      dataSource: "accounts/123456/dataSources/987654",
    });
  });

  it("rejects a dataSource owned by another account", () => {
    expect(() =>
      parseGoogleMerchantSettings([
        { key: "merchantId", value: "123456" },
        {
          key: "dataSource",
          value: "accounts/999999/dataSources/987654",
        },
        { key: "brand", value: "Deenruv" },
        { key: "credentials", value: credentialJson },
      ]),
    ).toThrow("dataSource account must match Merchant ID");
  });

  it("keeps authorized-user OAuth credential JSON support", () => {
    const settings = parseGoogleMerchantSettings([
      { key: "merchantId", value: "123456" },
      {
        key: "dataSource",
        value: "accounts/123456/dataSources/987654",
      },
      { key: "brand", value: "Deenruv" },
      {
        key: "credentials",
        value: JSON.stringify({
          type: "authorized_user",
          client_id: "oauth-client",
          client_secret: "oauth-secret",
          refresh_token: "oauth-refresh-token",
        }),
      },
    ]);

    expect(settings.credentials).toMatchObject({
      type: "authorized_user",
      client_id: "oauth-client",
      refresh_token: "oauth-refresh-token",
    });
  });

  it("uses the configured market context in product input identifiers", () => {
    const settings = parseGoogleMerchantSettings([
      { key: "merchantId", value: "123456" },
      {
        key: "dataSource",
        value: "accounts/123456/dataSources/987654",
      },
      { key: "brand", value: "Deenruv" },
      { key: "credentials", value: credentialJson },
      { key: "contentLanguage", value: "en" },
      { key: "feedLabel", value: "US" },
    ]);

    expect(createGoogleInsertOperation(createProduct(), settings).request)
      .toMatchObject({
        productInput: { contentLanguage: "en", feedLabel: "US" },
      });
    expect(
      createGoogleUpdateOperation(createProduct(), settings).request.productInput
        ?.name,
    ).toBe("accounts/123456/productInputs/en~US~sku-123");
  });

  it("constructs stable v1 clients without initializing a network request", async () => {
    const clients = createGoogleMerchantClients(createSettings().credentials);

    expect(clients.products.getProduct).toBeTypeOf("function");
    expect(clients.productInputs.insertProductInput).toBeTypeOf("function");
    expect(clients.dataSources.getDataSource).toBeTypeOf("function");

    await clients.products.close();
    await clients.productInputs.close();
    await clients.dataSources.close();
  });
});

describe("Google Merchant connection diagnostics", () => {
  it("verifies the account with Google and reports processed product issues", async () => {
    const reader: GoogleProductsReader = {
      async *listProductsAsync() {
        yield {
          dataSource: "accounts/123456/dataSources/987654",
          offerId: "healthy",
          productStatus: { itemLevelIssues: [] },
        };
        yield {
          dataSource: "accounts/123456/dataSources/987654",
          offerId: "rejected",
          productStatus: {
            itemLevelIssues: [
              {
                code: "invalid_image",
                description: "Image cannot be fetched",
                severity: "DISAPPROVED",
              },
            ],
          },
        };
        yield {
          dataSource: "accounts/123456/dataSources/111111",
          offerId: "another-source",
        };
      },
    };
    const dataSources: GoogleDataSourcesReader = {
      async getDataSource() {
        return [{ name: "accounts/123456/dataSources/987654" }];
      },
    };

    await expect(
      diagnoseGoogleMerchantConnection(reader, createSettings(), dataSources),
    ).resolves.toMatchObject({
      connectionStatus: "CONNECTED",
      dataSourceVerified: true,
      disapprovedProductsCount: 1,
      issuesCount: 1,
      productsCount: 2,
    });
  });

  it("normalizes Google authentication errors without exposing credentials", () => {
    expect(
      normalizeGoogleMerchantError({
        code: 16,
        details: "Invalid authentication credentials",
      }),
    ).toEqual({
      code: "UNAUTHENTICATED",
      message: "Invalid authentication credentials",
      retryable: false,
      status: "AUTHENTICATION_FAILED",
    });
  });

  it("redacts secrets embedded in error details", () => {
    expect(
      normalizeGoogleMerchantError({
        code: 16,
        details:
          "refresh_token=secret-token client_secret=secret-value access denied",
      }).message,
    ).toBe(
      "refresh_token=[REDACTED] client_secret=[REDACTED] access denied",
    );
  });

  it("returns a diagnostic result when Google rejects authentication", async () => {
    const reader: GoogleProductsReader = {
      async *listProductsAsync() {
        throw { code: 16, details: "Credentials rejected" };
      },
    };

    await expect(
      diagnoseGoogleMerchantConnection(reader, createSettings()),
    ).resolves.toMatchObject({
      connectionStatus: "AUTHENTICATION_FAILED",
      lastError: {
        code: "UNAUTHENTICATED",
        message: "Credentials rejected",
        retryable: false,
      },
      productsCount: 0,
    });
  });

  it("does not report a connection when the configured data source is missing", async () => {
    const reader: GoogleProductsReader = {
      async *listProductsAsync() {},
    };
    const dataSources: GoogleDataSourcesReader = {
      async getDataSource() {
        throw { code: 5, details: "Data source was not found" };
      },
    };

    await expect(
      diagnoseGoogleMerchantConnection(reader, createSettings(), dataSources),
    ).resolves.toMatchObject({
      connectionStatus: "DATA_SOURCE_NOT_FOUND",
      dataSourceVerified: false,
      lastError: { code: "NOT_FOUND" },
    });
  });
});

describe("Google Merchant resource names", () => {
  it("uses the plain v1 identifier for safe offer IDs", () => {
    expect(buildGoogleProductIdentifier("sku-123_A")).toBe(
      "pl~PL~sku-123_A",
    );
    expect(buildGoogleProductName("123", "sku-123_A")).toBe(
      "accounts/123/products/pl~PL~sku-123_A",
    );
    expect(buildGoogleProductInputName("123", "sku-123_A")).toBe(
      "accounts/123/productInputs/pl~PL~sku-123_A",
    );
  });

  it("uses unpadded base64url for reserved and delimiter characters", () => {
    const identifier = buildGoogleProductIdentifier("sku/10%~special");

    expect(identifier).not.toContain("=");
    expect(identifier).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(Buffer.from(identifier, "base64url").toString("utf8")).toBe(
      "pl~PL~sku/10%~special",
    );
  });
});

describe("Google Merchant ProductInput mapping", () => {
  it("moves writable fields under productAttributes and applies pl/PL context", () => {
    const productInput = toGoogleProductInput(createProduct(), "Configured Brand");

    expect(productInput).toMatchObject({
      offerId: "sku-123",
      contentLanguage: "pl",
      feedLabel: "PL",
      productAttributes: {
        brand: "Configured Brand",
        title: "Test product",
      },
    });
  });

  it("builds dataSource-scoped insert, update, and delete requests", () => {
    const settings = createSettings();
    const product: GoogleProduct = {
      ...createProduct("sku/123"),
      customAttributes: [{ name: "material", value: "cotton" }],
    };
    const insert = createGoogleInsertOperation(product, settings);
    const update = createGoogleUpdateOperation(product, settings);
    const remove = createGoogleDeleteOperation("sku/123", settings);

    expect(insert.request).toMatchObject({
      parent: "accounts/123456",
      dataSource: settings.dataSource,
      productInput: { offerId: "sku/123" },
    });
    expect(update.request).toMatchObject({
      dataSource: settings.dataSource,
      productInput: {
        name: buildGoogleProductInputName("123456", "sku/123"),
      },
      updateMask: {
        paths: expect.arrayContaining([
          "product_attributes.availability",
          "product_attributes.brand",
          "product_attributes.custom_label_0",
          "product_attributes.price",
          "product_attributes.title",
          "custom_attribute.material",
        ]),
      },
    });
    expect(remove.request).toEqual({
      name: buildGoogleProductInputName("123456", "sku/123"),
      dataSource: settings.dataSource,
    });
  });

  it("rejects relative storefront URLs before sending them to Google", () => {
    expect(() =>
      validateGoogleProductUrls({
        ...createProduct(),
        productAttributes: {
          ...createProduct().productAttributes,
          imageLink: "/assets/image.jpg",
          link: "/products/test",
        },
      }),
    ).toThrow("absolute http(s) URL");
  });
});

describe("bounded Merchant API operations", () => {
  it("limits concurrency, preserves order, and aggregates item errors", async () => {
    let active = 0;
    let maximumActive = 0;
    const results = await runBoundedMerchantOperations(
      [0, 1, 2, 3, 4, 5, 6],
      async (item) => {
        active += 1;
        maximumActive = Math.max(maximumActive, active);
        await Promise.resolve();
        active -= 1;
        if (item === 4) throw new Error("rejected item");
      },
      3,
    );
    const summary = summarizeMerchantOperations(results);

    expect(maximumActive).toBe(3);
    expect(results.map((result) => result.item)).toEqual([
      0, 1, 2, 3, 4, 5, 6,
    ]);
    expect(summary.status).toBe("error");
    expect(summary.failures.map((failure) => failure.item)).toEqual([4]);
  });

  it("passes dataSource on every per-item write and does not hide failures", async () => {
    const settings = createSettings();
    const operations = [
      createGoogleInsertOperation(createProduct("insert"), settings),
      createGoogleUpdateOperation(createProduct("update"), settings),
      createGoogleDeleteOperation("delete", settings),
    ];
    const seenDataSources: string[] = [];
    const writer: GoogleProductInputsWriter = {
      async deleteProductInput(request) {
        seenDataSources.push(request.dataSource ?? "");
      },
      async insertProductInput(request) {
        seenDataSources.push(request.dataSource ?? "");
      },
      async updateProductInput(request) {
        seenDataSources.push(request.dataSource ?? "");
        throw new Error("update failed");
      },
    };

    const results = await executeGoogleWriteOperations(writer, operations, 2);
    const summary = summarizeMerchantOperations(results);

    expect(seenDataSources).toEqual([
      settings.dataSource,
      settings.dataSource,
      settings.dataSource,
    ]);
    expect(summary.status).toBe("error");
    expect(summary.failures).toHaveLength(1);
    expect(summary.failures[0].item.communicateID).toBe("update");
  });

  it("retries transient Google failures and eventually reports success", async () => {
    const settings = createSettings();
    let attempts = 0;
    const writer: GoogleProductInputsWriter = {
      async deleteProductInput() {},
      async insertProductInput() {
        attempts += 1;
        if (attempts < 3) throw { code: 14, details: "Temporarily unavailable" };
      },
      async updateProductInput() {},
    };

    const results = await executeGoogleWriteOperations(
      writer,
      [createGoogleInsertOperation(createProduct("retry-me"), settings)],
      1,
      { delay: async () => undefined, maxAttempts: 3 },
    );

    expect(attempts).toBe(3);
    expect(results[0]).toMatchObject({ attempts: 3, status: "success" });
  });

  it("does not retry permanent permission failures", async () => {
    const settings = createSettings();
    let attempts = 0;
    const writer: GoogleProductInputsWriter = {
      async deleteProductInput() {},
      async insertProductInput() {
        attempts += 1;
        throw { code: 7, details: "Permission denied" };
      },
      async updateProductInput() {},
    };

    const results = await executeGoogleWriteOperations(
      writer,
      [createGoogleInsertOperation(createProduct("forbidden"), settings)],
      1,
      { delay: async () => undefined, maxAttempts: 3 },
    );

    expect(attempts).toBe(1);
    expect(results[0]).toMatchObject({ attempts: 1, status: "error" });
  });
});

describe("orphan cleanup safety", () => {
  it("selects remote-only products rather than local-only products", () => {
    const remote = [
      { communicateID: "remote-only", name: "Remote" },
      { communicateID: "shared", name: "Shared" },
      { communicateID: "remote-only", name: "Duplicate" },
    ];
    const local = [
      { communicateID: "shared" },
      { communicateID: "local-only" },
    ];

    expect(selectRemoteOrphanProducts(remote, local)).toEqual([
      { communicateID: "remote-only", name: "Duplicate" },
    ]);
  });

  it("propagates list failures instead of returning an empty deletion trigger", async () => {
    const reader: GoogleProductsReader = {
      async *listProductsAsync() {
        throw new Error("list unavailable");
      },
    };

    await expect(
      collectGoogleProductsForDataSource(
        reader,
        "123456",
        "accounts/123456/dataSources/987654",
      ),
    ).rejects.toThrow("list unavailable");
  });

  it("only returns processed Products from the configured dataSource", async () => {
    const reader: GoogleProductsReader = {
      async *listProductsAsync() {
        yield {
          dataSource: "accounts/123456/dataSources/987654",
          offerId: "included",
          productAttributes: { title: "Included" },
        };
        yield {
          dataSource: "accounts/123456/dataSources/111111",
          offerId: "excluded",
          productAttributes: { title: "Excluded" },
        };
      },
    };

    await expect(
      collectGoogleProductsForDataSource(
        reader,
        "123456",
        "accounts/123456/dataSources/987654",
      ),
    ).resolves.toEqual([
      { communicateID: "included", name: "Included" },
    ]);
  });
});
