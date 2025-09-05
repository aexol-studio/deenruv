import { INestApplicationContext } from "@nestjs/common";
import { LanguageCode } from "@deenruv/common/src/generated-types";
import { DeenruvConfig } from "@deenruv/core";
import {
  importProductsFromCsv,
  populateCollections,
  populateInitialData,
} from "@deenruv/core/cli";

import { TestServerOptions } from "../types";

import { populateCustomers } from "./populate-customers";

/**
 * Clears all tables from the database and populates with (deterministic) random data.
 */
export async function populateForTesting<T extends INestApplicationContext>(
  config: Required<DeenruvConfig>,
  bootstrapFn: (config: DeenruvConfig) => Promise<T>,
  options: TestServerOptions,
): Promise<T> {
  (config.dbConnectionOptions as any).logging = false;
  const logging = options.logging === undefined ? true : options.logging;
  const originalRequireVerification = config.authOptions.requireVerification;
  config.authOptions.requireVerification = false;

  const app = await bootstrapFn(config);

  const logFn = (message: string) => (logging ? console.log(message) : null);

  await populateInitialData(app, options.initialData);
  await populateProducts(app, options.productsCsvPath, logging);
  await populateCollections(app, options.initialData);
  await populateCustomers(app, options.customerCount ?? 10, logFn);

  config.authOptions.requireVerification = originalRequireVerification;
  return app;
}

async function populateProducts(
  app: INestApplicationContext,
  productsCsvPath: string | undefined,
  logging: boolean,
) {
  if (!productsCsvPath) {
    if (logging) {
      console.log("\nNo product data provided, skipping product import");
    }
    return;
  }

  const importResult = await importProductsFromCsv(
    app,
    productsCsvPath,
    LanguageCode.en,
  );
  if (importResult.errors && importResult.errors.length) {
    console.log(
      `${importResult.errors.length} errors encountered when importing product data:`,
    );
    console.log(importResult.errors.join("\n"));
  }

  if (logging) {
    console.log(`\nImported ${importResult.imported} products`);
  }
}
