import { describe, expect, it, vi } from "vitest";
import type { BaseData } from "../types.js";
import type { FacebookOperationResult } from "./facebook-platform-integration.service.js";
import { executeFacebookBatches } from "./facebook-platform-integration.service.js";

vi.mock("../entities/platform-integration-settings.entity.js", () => ({
  MerchantPlatformSettingsEntity: class MerchantPlatformSettingsEntity {},
}));

function product(communicateID: string): BaseData {
  return { communicateID, variantID: communicateID };
}

describe("Facebook bulk product batches", () => {
  it("stops and returns the first batch error", async () => {
    const executedBatches: string[][] = [];
    const outcomes: FacebookOperationResult[] = [
      { status: "success" },
      { status: "error", message: "batch rejected" },
      { status: "success" },
    ];

    const result = await executeFacebookBatches(
      [[product("first")], [product("second")], [product("third")]],
      async (batch) => {
        executedBatches.push(batch.map((item) => item.communicateID));
        return outcomes[executedBatches.length - 1];
      },
    );

    expect(result).toEqual({ status: "error", message: "batch rejected" });
    expect(executedBatches).toEqual([["first"], ["second"]]);
  });
});
