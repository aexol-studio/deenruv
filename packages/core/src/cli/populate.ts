import { INestApplicationContext } from "@nestjs/common";
import fs from "fs-extra";
import path from "path";
import { lastValueFrom } from "rxjs";

const loggerCtx = "Populate";

/**
 * @description
 * Populates the Deenruv server with some initial data and (optionally) product data from
 * a supplied CSV file. The format of the CSV file is described in the section
 * [Importing Product Data](/guides/developer-guide/importing-data/).
 *
 * If the `channelOrToken` argument is provided, all ChannelAware entities (Products, ProductVariants,
 * Assets, ShippingMethods, PaymentMethods etc.) will be assigned to the specified Channel.
 * The argument can be either a Channel object or a valid channel `token`.
 *
 * Internally the `populate()` function does the following:
 *
 * 1. Uses the {@link Populator} to populate the {@link InitialData}.
 * 2. If `productsCsvPath` is provided, uses {@link Importer} to populate Product data.
 * 3. Uses {@link Populator} to populate collections specified in the {@link InitialData}.
 *
 * @example
 * ```ts
 * import { bootstrap } from '\@deenruv/core';
 * import { populate } from '\@deenruv/core/cli';
 * import { config } from './deenruv-config.ts'
 * import { initialData } from './my-initial-data.ts';
 *
 * const productsCsvFile = path.join(__dirname, 'path/to/products.csv')
 *
 * populate(
 *   () => bootstrap(config),
 *   initialData,
 *   productsCsvFile,
 * )
 * .then(app => app.close())
 * .then(
 *   () => process.exit(0),
 *   err => {
 *     console.log(err);
 *     process.exit(1);
 *   },
 * );
 * ```
 *
 * @docsCategory import-export
 */
export async function populate<T extends INestApplicationContext>(
  bootstrapFn: () => Promise<T | undefined>,
  initialDataPathOrObject: string | object,
  productsCsvPath?: string,
  channelOrToken?: string | import("@deenruv/core").Channel,
): Promise<T> {
  const app = await bootstrapFn();
  if (!app) {
    throw new Error("Could not bootstrap the Deenruv app");
  }
  let channel: import("@deenruv/core").Channel | undefined;
  const { ChannelService, Channel, Logger } = await import("@deenruv/core");
  if (typeof channelOrToken === "string") {
    channel = await app.get(ChannelService).getChannelFromToken(channelOrToken);
    if (!channel) {
      Logger.warn(
        `Warning: channel with token "${channelOrToken}" was not found. Using default Channel instead.`,
        loggerCtx,
      );
    }
  } else if (channelOrToken instanceof Channel) {
    channel = channelOrToken;
  }
  const initialData: import("@deenruv/core").InitialData =
    typeof initialDataPathOrObject === "string"
      ? require(initialDataPathOrObject)
      : initialDataPathOrObject;

  await populateInitialData(app, initialData, channel);

  if (productsCsvPath) {
    const importResult = await importProductsFromCsv(
      app,
      productsCsvPath,
      initialData.defaultLanguage,
      channel,
    );
    if (importResult.errors && importResult.errors.length) {
      const errorFile = path.join(process.cwd(), "deenruv-import-error.log");
      Logger.error(
        `${importResult.errors.length} errors encountered when importing product data. See: ${errorFile}`,
        loggerCtx,
      );
      await fs.writeFile(errorFile, importResult.errors.join("\n"));
    }

    Logger.info(`Imported ${importResult.imported} products`, loggerCtx);

    await populateCollections(app, initialData, channel);
  }

  Logger.info("Done!", loggerCtx);
  return app;
}

export async function populateInitialData(
  app: INestApplicationContext,
  initialData: import("@deenruv/core").InitialData,
  channel?: import("@deenruv/core").Channel,
) {
  const { Populator, Logger } = await import("@deenruv/core");
  const populator = app.get(Populator);
  try {
    await populator.populateInitialData(initialData, channel);
    Logger.info("Populated initial data", loggerCtx);
  } catch (err: any) {
    Logger.error(err.message, loggerCtx);
  }
}

export async function populateCollections(
  app: INestApplicationContext,
  initialData: import("@deenruv/core").InitialData,
  channel?: import("@deenruv/core").Channel,
) {
  const { Populator, Logger } = await import("@deenruv/core");
  const populator = app.get(Populator);
  try {
    if (initialData.collections.length) {
      await populator.populateCollections(initialData, channel);
      Logger.info(
        `Created ${initialData.collections.length} Collections`,
        loggerCtx,
      );
    }
  } catch (err: any) {
    Logger.info(err.message, loggerCtx);
  }
}

export async function importProductsFromCsv(
  app: INestApplicationContext,
  productsCsvPath: string,
  languageCode: import("@deenruv/core").LanguageCode,
  channel?: import("@deenruv/core").Channel,
): Promise<import("@deenruv/core").ImportProgress> {
  const { Importer, RequestContextService } = await import("@deenruv/core");
  const importer = app.get(Importer);
  const requestContextService = app.get(RequestContextService);
  const productData = await fs.readFile(productsCsvPath, "utf-8");
  const ctx = await requestContextService.create({
    apiType: "admin",
    languageCode,
    channelOrToken: channel,
  });
  return lastValueFrom(importer.parseAndImport(productData, ctx, true));
}
