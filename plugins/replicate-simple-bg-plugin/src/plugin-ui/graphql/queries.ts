import { typedGql } from "../zeus/typedDocumentNode";
import { $ } from "../zeus";
import { scalars } from "@deenruv/admin-types";
import {
  ReplicateSimpleBgEntityListSelector,
  PredictionSelector,
  ImageSelector,
  RoomTypeSelector,
  RoomThemeSelector,
  ProductSelector,
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
    {
      options: $("options", "ReplicateSimpleBgEntityListOptions"),
    },
    ReplicateSimpleBgEntityListSelector,
  ],
});

export const getSimpleBgItemQuery = typedGql("query", { scalars })({
  getSimpleBgItem: [
    {
      id: $("id", "String!"),
    },
    PredictionSelector,
  ],
});

export const getSimpleBgThemeAssetQuery = typedGql("query", { scalars })({
  getSimpleBgThemeAsset: [
    {
      url: $("url", "String!"),
    },
    ImageSelector,
  ],
});

export const getSimpleBgRoomTypeQuery = typedGql("query", { scalars })({
  getSimpleBgRoomType: RoomTypeSelector,
});

export const getSimpleBgRoomThemeQuery = typedGql("query", { scalars })({
  getSimpleBgRoomTheme: RoomThemeSelector,
});
export const getSimpleBgAssetIDByNameQuery = typedGql("query", { scalars })({
  getSimpleBgAssetIDByName: [
    {
      source: $("source", "String!"),
    },
    true,
  ],
});

export const getSimpleBgProductListQuery = typedGql("query", { scalars })({
  getSimpleBgProductList: [
    {
      options: $("options", "SimpleBgProductListOptions"),
    },
    ProductSelector,
  ],
});
