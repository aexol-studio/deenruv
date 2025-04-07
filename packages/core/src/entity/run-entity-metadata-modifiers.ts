import { getMetadataArgsStorage } from "typeorm";

import { DeenruvConfig } from "../config/deenruv-config";

export async function runEntityMetadataModifiers(config: DeenruvConfig) {
  if (config.entityOptions?.metadataModifiers?.length) {
    const metadataArgsStorage = getMetadataArgsStorage();
    for (const modifier of config.entityOptions.metadataModifiers) {
      await modifier(metadataArgsStorage);
    }
  }
}
