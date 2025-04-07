import { FromSelector, Selector } from "../zeus";

export const PredictionSelector = Selector("PredictionResult")({
  predictions: {
    id: true,
    score: true,
    customer: { emailAddress: true, id: true, firstName: true, lastName: true },
  },
  status: true,
});

export const ReplicateEntityListSelector = Selector("ReplicateEntityList")({
  items: {
    id: true,
    status: true,
    finishedAt: true,
  },
  totalItems: true,
});

export type ReplicatePredictionListType = FromSelector<
  typeof PredictionSelector,
  "PredictionResult"
>;
export type ReplicateEntityListType = FromSelector<
  typeof ReplicateEntityListSelector,
  "ReplicateEntityList"
>;
