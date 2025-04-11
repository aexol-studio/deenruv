import { FromSelector, Selector } from "../zeus";

export const PredictionSelector = Selector("PredictionSimpleBgResult")({
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

export type ReplicatePredictionListType = FromSelector<
  typeof PredictionSelector,
  "PredictionSimpleBgResult"
>;

export type ReplicateSimpleBgEntityListType = FromSelector<
  typeof ReplicateSimpleBgEntityListSelector,
  "ReplicateSimpleBgEntityList"
>;

export type SimpleBgProductListType = FromSelector<
  typeof ProductSelector,
  "SimpleBgProductList"
>;
