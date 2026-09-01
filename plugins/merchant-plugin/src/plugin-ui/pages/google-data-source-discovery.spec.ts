import { print } from "graphql";
import { describe, expect, it } from "vitest";
import { getGoogleMerchantDataSources } from "../graphql/queries.js";
import {
  createGoogleDataSourceDiscoveryRequestTracker,
  isValidGoogleMerchantId,
  selectDiscoveredGoogleDataSource,
} from "./google-data-source-discovery.js";

describe("Google data-source discovery selection", () => {
  it("selects only a resource returned by discovery", () => {
    const discovered = [
      "accounts/123/dataSources/456",
      "accounts/123/dataSources/789",
    ];

    expect(
      selectDiscoveredGoogleDataSource(
        "accounts/123/dataSources/manual",
        "accounts/123/dataSources/789",
        discovered,
      ),
    ).toBe("accounts/123/dataSources/789");
    expect(
      selectDiscoveredGoogleDataSource(
        "accounts/123/dataSources/manual",
        "accounts/999/dataSources/789",
        discovered,
      ),
    ).toBe("accounts/123/dataSources/manual");
  });

  it("builds the raw typed discovery query without Zeus regeneration", () => {
    expect(print(getGoogleMerchantDataSources)).toContain(
      "getGoogleMerchantDataSources(merchantId: $merchantId)",
    );
  });

  it("rejects blank or non-numeric account IDs", () => {
    expect(isValidGoogleMerchantId("")).toBe(false);
    expect(isValidGoogleMerchantId("123x")).toBe(false);
    expect(isValidGoogleMerchantId(" 123 ")).toBe(true);
  });

  it("invalidates stale and overlapping discovery requests", () => {
    const tracker = createGoogleDataSourceDiscoveryRequestTracker();
    const first = tracker.begin("123");
    const second = tracker.begin("123");

    expect(tracker.isCurrent(first, "123")).toBe(false);
    expect(tracker.isCurrent(second, "123")).toBe(true);
    tracker.invalidate();
    expect(tracker.isCurrent(second, "123")).toBe(false);

    const third = tracker.begin("456");
    expect(tracker.isCurrent(third, "123")).toBe(false);
    expect(tracker.isCurrent(third, "456")).toBe(true);
  });
});
