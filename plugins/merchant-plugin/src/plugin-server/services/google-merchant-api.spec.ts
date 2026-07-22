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
  executeGoogleWriteOperations,
  GoogleProductInputsWriter,
  GoogleProductsReader,
  parseGoogleMerchantSettings,
  runBoundedMerchantOperations,
  selectRemoteOrphanProducts,
  summarizeMerchantOperations,
  toGoogleProductInput,
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

  it("constructs stable v1 clients without initializing a network request", async () => {
    const clients = createGoogleMerchantClients(createSettings().credentials);

    expect(clients.products.getProduct).toBeTypeOf("function");
    expect(clients.productInputs.insertProductInput).toBeTypeOf("function");

    await clients.products.close();
    await clients.productInputs.close();
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
