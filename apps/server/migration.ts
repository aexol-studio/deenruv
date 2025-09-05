import {
  generateMigration,
  revertLastMigration,
  runMigrations,
} from "@deenruv/core";
import { program } from "commander";
import { devConfig } from "./dev-config";
import { applyConfigFromJson } from "./plugin-config-loader";

program
  .command("generate <name>")
  .description("Generate a new migration file with the given name")
  .action(async (name) => {
    await applyConfigFromJson(devConfig, __dirname);

    await generateMigration(devConfig, { name, outputDir: "./migrations" });
  });

program
  .command("run")
  .description("Run all pending migrations")
  .action(async () => {
    await applyConfigFromJson(devConfig, __dirname);

    await runMigrations(devConfig);
  });

program
  .command("revert")
  .description("Revert the last applied migration")
  .action(async () => {
    await applyConfigFromJson(devConfig, __dirname);

    await revertLastMigration(devConfig);
  });

program.parse(process.argv);
