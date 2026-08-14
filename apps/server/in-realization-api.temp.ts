import { bootstrap, JobQueueService } from "@deenruv/core";

import { devConfig } from "./dev-config";

devConfig.plugins = devConfig.plugins?.filter(
  (plugin) => ("name" in plugin ? plugin.name : undefined) !== "AdminUiPlugin",
);

bootstrap(devConfig)
  .then(async (app) => {
    if (process.env.RUN_JOB_QUEUE === "1") {
      await app.get(JobQueueService).start();
    }
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
