import { typedGql } from "../zeus/typedDocumentNode.js";
import { scalars } from "@deenruv/admin-types";
import { $ } from "../zeus/index.js";

export const ChangeReviewStateMutation = typedGql("mutation", { scalars })({
  changeReviewState: [
    { input: $("input", "ChangeReviewStateInput!") },
    { success: true },
  ],
});

export const ChangeReviewsStateMutation = typedGql("mutation", { scalars })({
  changeReviewsState: [
    { input: $("input", "[ChangeReviewStateInput!]!") },
    { success: true },
  ],
});
export const UpdateTranslationsReviewMutation = typedGql("mutation", {
  scalars,
})({
  updateTranslationsReview: [
    { input: $("input", "UpdateTranslationsReviewInput!") },
    { id: true },
  ],
});
// export const UpdateTranslationReviewMutation = typedGql("mutation", {
//   scalars,
// })({
//   updateTranslationReview: [{}, {}],
// });
