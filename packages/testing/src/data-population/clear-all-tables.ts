import { DeenruvConfig } from "@deenruv/core";
import { preBootstrapConfig } from "@deenruv/core/dist/bootstrap";
import { createConnection } from "typeorm";

/**
 * Clears all tables in the database specified by the connectionOptions
 */
export async function clearAllTables(config: DeenruvConfig, logging = true) {
  if (logging) {
    console.log("Clearing all tables...");
  }
  config = await preBootstrapConfig(config);
  const entityIdStrategy =
    config.entityIdStrategy ?? config.entityOptions?.entityIdStrategy;
  const connection = await createConnection({ ...config.dbConnectionOptions });
  try {
    await connection.synchronize(true);
  } catch (err: any) {
    console.error("Error occurred when attempting to clear tables!");
    console.log(err);
  } finally {
    await connection.close();
  }
  if (logging) {
    console.log("Done!");
  }
}
