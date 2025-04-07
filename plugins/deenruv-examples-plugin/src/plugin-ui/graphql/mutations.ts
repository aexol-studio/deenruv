import { typedGql } from "../zeus/typedDocumentNode";
import { $ } from "../zeus";
import { scalars } from "@deenruv/admin-types";

export const ProductMutation = typedGql("mutation", { scalars })({
  updateProduct: [
    {
      input: $("input", "UpdateProductInput!"),
    },
    { id: true },
  ],
});
