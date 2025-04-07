import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const AssetListSelector = Selector("Asset")({
  id: true,
  createdAt: true,
  updatedAt: true,
  fileSize: true,
  width: true,
  height: true,
  mimeType: true,
  name: true,
  source: true,
  preview: true,
  tags: { id: true, value: true },
  type: true,
  focalPoint: { x: true, y: true },
});

export type AssetListType = FromSelectorWithScalars<
  typeof AssetListSelector,
  "Asset"
>;
