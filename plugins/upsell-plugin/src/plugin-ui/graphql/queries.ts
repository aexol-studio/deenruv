import { typedGql } from "../zeus/typedDocumentNode";
import { $ } from "../zeus";
import { scalars } from "./scalars";
import { upsellSelector } from "./selectors";

const query = typedGql("query", { scalars });

const GET_UPSELLS = query({
  upsellProducts: [{ productID: $("productID", "ID!") }, upsellSelector],
});

export const QUERIES = {
  GET_UPSELLS,
};
