import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const assetsSelector = Selector("Asset")({
  id: true,
  createdAt: true,
  fileSize: true,
  focalPoint: { x: true, y: true },
  width: true,
  height: true,
  mimeType: true,
  preview: true,
  source: true,
  name: true,
});
export type AssetType = FromSelectorWithScalars<typeof assetsSelector, "Asset">;
