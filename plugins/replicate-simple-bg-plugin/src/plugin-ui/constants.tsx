import { PredictionSimpleBgStatus } from "./zeus/index.js";

export const getStatusColor = (status: string) => {
  switch (status) {
    case PredictionSimpleBgStatus.succeeded:
      return "bg-green-500";
    case PredictionSimpleBgStatus.failed:
      return "bg-red-500";
    case PredictionSimpleBgStatus.starting:
      return "bg-blue-500";
    case PredictionSimpleBgStatus.preprocessing:
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};
