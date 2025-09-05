import {
  bootstrap,
  defaultConfig,
  JobQueueService,
  Logger,
  mergeConfig,
} from "@deenruv/core";
import { populate } from "@deenruv/core";
import { clearAllTables, populateCustomers } from "@deenruv/testing";
import path from "path";

// import { initialData } from "@deenruv/core";

import { devConfig } from "./dev-config";

/**
 * A CLI script which populates the dev database with deterministic random data.
 */
if (require.main === module) {
  // Running from command line
  const populateConfig = mergeConfig(
    defaultConfig,
    mergeConfig(devConfig, {
      authOptions: {
        tokenMethod: "bearer",
        requireVerification: false,
      },
      importExportOptions: {
        importAssetsDir: path.join(
          __dirname,
          "../../node_modules/@deenruv/core/mock-data/assets",
        ),
      },
      customFields: {},
    }),
  );
  clearAllTables(populateConfig, true)
    .then(() =>
      populate(
        () =>
          bootstrap(populateConfig).then(async (app) => {
            await app.get(JobQueueService).start();
            return app;
          }),
        {},
        path.join(__dirname, "../../packages/create/assets/products.csv"),
      ),
    )
    .then(async (app) => {
      console.log("populating customers...");
      await populateCustomers(app, 10, (message) => Logger.error(message));
      return app.close();
    })
    .then(
      () => process.exit(0),
      (err) => {
        console.log(err);
        process.exit(1);
      },
    );
}
