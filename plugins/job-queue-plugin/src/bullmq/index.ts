import { Logger } from "@deenruv/core";

// ensure that the bullmq package is installed
try {
  require("bullmq");
} catch (e: any) {
  console.error(
    'The BullMQJobQueuePlugin depends on the "bullmq" package being installed.',
  );
  process.exit(1);
}

export * from "./plugin";
export * from "./types";
