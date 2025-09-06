import "reflect-metadata";
import { bootstrap, JobQueueService, runMigrations } from "@deenruv/core";

import { devConfig } from "./dev-config";
import { applyConfigFromJson } from "./plugin-config-loader";
/**
 * This bootstraps the dev server, used for testing Deenruv during development.
 */

const main = async () => {
  await applyConfigFromJson(devConfig, __dirname);
  await runMigrations(devConfig);
  const app = await bootstrap(devConfig);
  if (process.env.RUN_JOB_QUEUE === "1") {
    await app.get(JobQueueService).start();
  }
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
