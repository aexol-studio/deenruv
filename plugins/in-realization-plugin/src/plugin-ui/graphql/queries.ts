import { scalars } from "@deenruv/admin-types";
import { typedGql } from "../zeus/typedDocumentNode.js";
import { $ } from "../zeus/index.js";

export const GET_REALIZATION = typedGql("query", { scalars })({
  getRealizationURL: [{ orderID: $("orderID", "ID!") }, true],
});
