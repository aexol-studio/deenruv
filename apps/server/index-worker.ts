import "reflect-metadata";
import { bootstrapWorker } from "@deenruv/core";

import { devConfig } from "./dev-config";
import { applyConfigFromJson } from "./plugin-config-loader";

const main = async () => {
  await applyConfigFromJson(devConfig, __dirname);

  const worker = await bootstrapWorker(devConfig);
  await worker.startJobQueue();
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
