import { typedGql } from "../zeus/typedDocumentNode";
import { $ } from "../zeus";
import { scalars } from "@deenruv/admin-types";
import { PredictionSelector, ReplicateEntityListSelector } from "./selectors";

export const getPredictionIDQuery = typedGql("query", { scalars })({
  getPredictionID: [
    {
      input: {
        prediction_entity_id: $("prediction_entity_id", "String!"),
      },
    },
    true,
  ],
});
export const getReplicatePredictionsQuery = typedGql("query", { scalars })({
  getReplicatePredictions: [
    {
      options: $("options", "ReplicateEntityListOptions"),
    },
    ReplicateEntityListSelector,
  ],
});
export const getPredictionItemQuery = typedGql("query", { scalars })({
  getPredictionItem: [
    {
      id: $("id", "String!"),
    },
    PredictionSelector,
  ],
});
