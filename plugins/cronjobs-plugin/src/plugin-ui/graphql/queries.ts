import { scalars } from "@deenruv/admin-types";
import { typedGql } from "../zeus/typedDocumentNode.js";
import { $ } from "../zeus/index.js";

export const GetJobQueues = typedGql("query", { scalars })({
  jobQueues: { name: true, running: true },
});

export const GetCronJobs = typedGql("query", { scalars })({
  cronJobs: [
    { input: $("input", "CronJobsListInput!") },
    {
      items: {
        name: true,
        schedule: true,
        lastScheduleTime: true,
        channelToken: true,
        lastSuccessfulTime: true,
      },
      totalItems: true,
    },
  ],
});

export const GetCronJobsConfig = typedGql("query", { scalars })({
  cronJobsConfig: {
    suggestedJobs: true,
    presets: { label: true, value: true, default: true },
  },
});
