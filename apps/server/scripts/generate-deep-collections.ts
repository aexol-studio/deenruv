import {
  bootstrapWorker,
  LanguageCode,
  RequestContextService,
  CollectionDefinition,
  CollectionService,
} from "@deenruv/core";

import { devConfig } from "../dev-config";

generateDeepCollections()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

// Used for testing scenarios where there are many channels
// such as https://github.com/deenruv-ecommerce/deenruv/issues/2233
async function generateDeepCollections() {
  const { app } = await bootstrapWorker(devConfig);
  const requestContextService = app.get(RequestContextService);
  const collectionService = app.get(CollectionService);

  const ctxAdmin = await requestContextService.create({
    apiType: "admin",
  });

  const collections = getCollections();
  for (const collection of collections) {
    await collectionService.create(ctxAdmin, {
      translations: [
        {
          description: "",
          languageCode: LanguageCode.en,
          name: collection.name,
          slug: collection.name,
        },
      ],
      filters: [],
    });
  }
}

/**
 * This script generates lots of Collections, nested 3 levels deep. It is useful for testing
 * scenarios where we need to work with a large amount of Collections.
 */
function getCollections() {
  const collections: CollectionDefinition[] = [];
  for (let i = 1; i <= 20; i++) {
    const IName = `Collection ${i}`;
    collections.push({
      name: IName,
      filters: [],
    });
    for (let j = 1; j <= 5; j++) {
      const JName = `Collection ${i}-${j}`;
      collections.push({
        name: JName,
        filters: [],
        parentName: IName,
      });
      for (let k = 1; k <= 3; k++) {
        const KName = `Collection ${i}-${j}-${k}`;
        collections.push({
          name: KName,
          filters: [],
          parentName: JName,
        });
      }
    }
  }
  return collections;
}

// fs.writeFileSync(
//   path.join(__dirname, "collections.json"),
//   JSON.stringify(collections, null, 2),
//   "utf-8",
// );
