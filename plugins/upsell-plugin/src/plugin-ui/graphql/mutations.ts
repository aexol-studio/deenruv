import { $ } from "../zeus";
import { typedGql } from "../zeus/typedDocumentNode";
import { scalars } from "./scalars";

const mutation = typedGql("mutation", { scalars });

const CREATE_UPSELL = mutation({
  createUpsell: [{ input: $("input", "[UpsellInput!]!") }, true],
});

const DELETE_UPSELL = mutation({
  deleteUpsell: [{ input: $("input", "[UpsellInput!]!") }, true],
});

export const MUTATIONS = {
  CREATE_UPSELL,
  DELETE_UPSELL,
};
