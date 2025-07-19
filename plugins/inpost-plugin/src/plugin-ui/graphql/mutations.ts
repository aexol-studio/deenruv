import { $ } from "../zeus";
import { typedGql } from "../zeus/typedDocumentNode";
import { scalars } from "./scalars";

const mutation = typedGql("mutation", { scalars });

export const SET_INPOST_CONFIG = mutation({
  setInpostShippingMethodConfig: [
    { input: $("input", "SetInpostShippingMethodConfigInput!") },
    true,
  ],
});
