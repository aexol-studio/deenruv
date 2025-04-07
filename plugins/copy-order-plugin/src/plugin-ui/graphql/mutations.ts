import { scalars } from "@deenruv/admin-types";
import { typedGql } from "../zeus/typedDocumentNode.js";
import { $ } from "../zeus/index.js";

export const COPY_ORDER = typedGql("mutation", { scalars })({
  copyOrder: [
    { id: $("id", "ID!") },
    {
      __typename: true,
      "...on Order": { id: true },
      "...on CopyOrderErrorResponse": { message: true },
    },
  ],
});
