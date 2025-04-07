import { typedGql } from "../zeus/typedDocumentNode.js";
import { $ } from "../zeus/index.js";
import { scalars } from "./scalars.js";
import { FacetListOptionsSelector } from "./selectors.js";

const query = typedGql("query", { scalars });

export const FACETS_QUERY = query({
  facets: [
    { options: $("facetOptions", "FacetListOptions!") },
    FacetListOptionsSelector,
  ],
});
