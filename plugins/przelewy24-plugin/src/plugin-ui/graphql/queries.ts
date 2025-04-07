import { typedGql } from "../zeus/typedDocumentNode.js";
import { $ } from "../zeus/index.js";
import { scalars } from "@deenruv/admin-types";

const query = typedGql("query", { scalars });
export const REMINDER = query({
  remindPrzelewy24: [{ orderId: $("orderId", "ID!") }, true],
});
