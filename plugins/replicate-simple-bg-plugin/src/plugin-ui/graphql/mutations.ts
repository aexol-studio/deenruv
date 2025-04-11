import { typedGql } from "../zeus/typedDocumentNode.js";
import { $ } from "../zeus/index.js";
import { scalars } from "@deenruv/admin-types";

export const startGenerateSimpleBgMutation = typedGql("mutation", { scalars })({
  startGenerateSimpleBg: [
    { input: $("input", "StartGenerateSimpleBgInput!") },
    true,
  ],
});

export const assignPredictionToProductMutation = typedGql("mutation", {
  scalars,
})({
  assignPredictionToProduct: [
    { input: $("input", "AssignPredictionToProductInput!") },
    {
      id: true,
      preview: true,
      source: true,
    },
  ],
});
