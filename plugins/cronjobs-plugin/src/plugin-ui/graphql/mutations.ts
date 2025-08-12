import { typedGql } from "../zeus/typedDocumentNode.js";
import { scalars } from "@deenruv/admin-types";
import { $ } from "../zeus/index.js";

export const CreateCronJob = typedGql("mutation", { scalars })({
  createCronJob: [{ input: $("input", "CronJobCreateInput!") }, true],
});

export const UpdateCronJob = typedGql("mutation", { scalars })({
  updateCronJob: [{ job: $("job", "CronJobInput!") }, true],
});

export const RemoveCronJob = typedGql("mutation", { scalars })({
  removeCronJob: [{ jobs: $("jobs", "[CronJobInput!]!") }, true],
});
