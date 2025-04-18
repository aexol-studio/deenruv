import { typedGql } from "../zeus/typedDocumentNode.js";
import { $ } from "../zeus/index.js";
import { scalars } from "@deenruv/admin-types";

export const startGenerateSimpleBgMutation = typedGql("mutation", { scalars })({
  startGenerateSimpleBg: [
    { input: $("input", "StartGenerateSimpleBgInput!") },
    true,
  ],
});

export const getPredictionAssetMutation = typedGql("mutation", {
  scalars,
})({
  getPredictionAsset: [
    { input: $("input", "GetPredictionAssetInput!") },
    {
      id: true,
      preview: true,
      source: true,
    },
  ],
});
