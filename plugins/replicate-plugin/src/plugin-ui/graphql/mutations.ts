import { typedGql } from "../zeus/typedDocumentNode";
import { $ } from "../zeus";
import { scalars } from "@deenruv/admin-types";

export const startOrderExportToReplicateMutation = typedGql("mutation", {
  scalars,
})({
  startOrderExportToReplicate: [
    { input: $("input", "StartOrderExportToReplicateInput!") },
    true,
  ],
});
