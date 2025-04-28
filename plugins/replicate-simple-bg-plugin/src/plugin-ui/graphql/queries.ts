import { typedGql } from "../zeus/typedDocumentNode";
import { $ } from "../zeus";
import { scalars } from "@deenruv/admin-types";
import {
  ReplicateSimpleBgEntityListSelector,
  PredictionSelector,
  ImageSelector,
  RoomTypeSelector,
  RoomThemeSelector,
} from "./selectors";

export const getPredictionSimpleBGIDQuery = typedGql("query", { scalars })({
  getSimpleBgID: [
    {
      input: {
        prediction_simple_bg_entity_id: $(
          "prediction_simple_bg_entity_id",
          "String!",
        ),
      },
    },
    true,
  ],
});

export const getSimpleBgPredictionsQuery = typedGql("query", { scalars })({
  getSimpleBgPredictions: [
    { options: $("options", "ReplicateSimpleBgEntityListOptions") },
    ReplicateSimpleBgEntityListSelector,
  ],
});

export const getSimpleBgItemQuery = typedGql("query", { scalars })({
  getSimpleBgItem: [{ id: $("id", "String!") }, PredictionSelector],
});

export const getSimpleBgThemeAssetQuery = typedGql("query", { scalars })({
  getSimpleBgThemeAsset: [{ url: $("url", "String!") }, ImageSelector],
});

export const getSimpleBgRoomOptions = typedGql("query", { scalars })({
  getSimpleBgOptions: {
    roomTypes: RoomTypeSelector,
    roomThemes: RoomThemeSelector,
  },
});
