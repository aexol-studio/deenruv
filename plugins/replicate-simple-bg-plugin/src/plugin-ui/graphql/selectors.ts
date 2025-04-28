import { FromSelector, Selector } from "../zeus";
import { FromSelectorWithScalars } from "../zeus/scalars.js";

export const PredictionSelector = Selector("PredictionSimpleBgResult")({
  id: true,
  status: true,
  image: true,
  roomType: true,
  roomStyle: true,
});

export const ReplicateSimpleBgEntityListSelector = Selector(
  "ReplicateSimpleBgEntityList",
)({
  items: {
    id: true,
    status: true,
    finishedAt: true,
  },
  totalItems: true,
});

export const ImageSelector = Selector("Image")({
  url: true,
});

export const RoomTypeSelector = Selector("RoomType")({
  label: true,
  value: true,
});

export const RoomThemeSelector = Selector("RoomTheme")({
  label: true,
  value: true,
  image: true,
});

export const ProductSelector = Selector("SimpleBgProductList")({
  items: {
    createdAt: true,
    updatedAt: true,
    name: true,
    slug: true,
    id: true,
  },
  totalItems: true,
});

export type ReplicateRoomType = FromSelectorWithScalars<
  typeof RoomTypeSelector,
  "RoomType"
>;

export type ReplicateRoomStyle = FromSelectorWithScalars<
  typeof RoomThemeSelector,
  "RoomTheme"
>;

export type ReplicatePredictionListType = FromSelectorWithScalars<
  typeof PredictionSelector,
  "PredictionSimpleBgResult"
>;

export type ReplicateSimpleBgEntityListType = FromSelectorWithScalars<
  typeof ReplicateSimpleBgEntityListSelector,
  "ReplicateSimpleBgEntityList"
>;

export type SimpleBgProductListType = FromSelectorWithScalars<
  typeof ProductSelector,
  "SimpleBgProductList"
>;
