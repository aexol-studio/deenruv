import { describe, expect, it } from "vitest";

import {
  AssetDraftRequestGate,
  clampAssetPage,
  formatAssetFileSize,
  getAssetMetadata,
  getAssetPageItems,
  getAssetResultRange,
  RequestGenerationGate,
} from "./AssetsModalInput.helpers.js";

describe("AssetsModalInput helpers", () => {
  it("clamps pages and final-page result ranges", () => {
    expect(clampAssetPage(0, 3)).toBe(1);
    expect(clampAssetPage(9, 3)).toBe(3);
    expect(clampAssetPage(9, 0)).toBe(1);
    expect(getAssetResultRange(4, 12, 25)).toEqual({ from: 25, to: 25 });
    expect(getAssetResultRange(1, 12, 0)).toEqual({ from: 0, to: 0 });
  });

  it("builds bounded compact pagination items", () => {
    expect(getAssetPageItems(1, 0)).toEqual([]);
    expect(getAssetPageItems(99, 10)).toEqual([1, "ellipsis", 6, 7, 8, 9, 10]);
    expect(getAssetPageItems(5, 10)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      10,
    ]);
  });

  it("formats compact asset metadata", () => {
    expect(formatAssetFileSize(1536)).toBe("1.5 KB");
    expect(
      getAssetMetadata({
        mimeType: "image/png",
        width: 800,
        height: 600,
        fileSize: 1536,
      }),
    ).toEqual(["image/png", "800×600", "1.5 KB"]);
  });

  it("applies only the latest request when completions arrive out of order", () => {
    const gate = new RequestGenerationGate();
    const state = { assets: [] as string[], error: false, pending: true };
    const first = gate.begin();
    const second = gate.begin();

    if (gate.isCurrent(second)) {
      state.assets = ["latest"];
      state.error = false;
      state.pending = false;
    }
    if (gate.isCurrent(first)) {
      state.assets = [];
      state.error = true;
      state.pending = false;
    }

    expect(state).toEqual({
      assets: ["latest"],
      error: false,
      pending: false,
    });
  });

  it("rejects pending work after invalidation and accepts a newer generation", () => {
    const gate = new RequestGenerationGate();
    const pending = gate.begin();
    gate.invalidate();

    expect(gate.isCurrent(pending)).toBe(false);

    const resumed = gate.begin();
    expect(gate.isCurrent(resumed)).toBe(true);
  });

  it("supersedes uploads with newer uploads and manual selections", () => {
    const gate = new AssetDraftRequestGate();
    gate.open();
    const firstUpload = gate.beginUpload();
    const secondUpload = gate.beginUpload();

    expect(gate.canApplyUpload(firstUpload, true)).toBe(false);
    expect(gate.canApplyUpload(secondUpload, true)).toBe(true);

    gate.manualSelection();
    expect(gate.canApplyUpload(secondUpload, true)).toBe(false);
  });

  it("invalidates async draft writes on close and controlled-value sync", () => {
    const gate = new AssetDraftRequestGate();
    gate.open();
    const upload = gate.beginUpload();
    gate.close();

    expect(gate.canApplyUpload(upload, false)).toBe(false);
    expect(gate.canApplyValue(false)).toBe(false);

    gate.syncFromValue(true);
    expect(gate.canApplyValue(true)).toBe(true);
    expect(gate.canApplyUpload(upload, true)).toBe(false);
  });
});
