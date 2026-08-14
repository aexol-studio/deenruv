import { LanguageCode } from "@deenruv/common/lib/generated-types";
import { DataSource, SelectQueryBuilder } from "typeorm";
import { describe, expect, it } from "vitest";

import { RequestContext } from "../../api/common/request-context";
import { ensureConfigLoaded } from "../../config/config-helpers";
import { defaultConfig } from "../../config/default-config";
import { Channel } from "../../entity/channel/channel.entity";
import { coreEntitiesMap } from "../../entity/entities";
import { Product } from "../../entity/product/product.entity";
import { ProductVariant } from "../../entity/product-variant/product-variant.entity";
import { setEntityIdStrategy } from "../../entity/set-entity-id-strategy";

import {
  applyProductListSearch,
  applyProductVariantListSearch,
  normalizeCatalogSearchTerm,
} from "./catalog-list-search";

describe("normalizeCatalogSearchTerm", () => {
  it("trims and splits all whitespace", () => {
    expect(normalizeCatalogSearchTerm("  camera\t lens\nblack  ")).toEqual([
      "camera",
      "lens",
      "black",
    ]);
  });

  it("returns no tokens for an empty term", () => {
    expect(normalizeCatalogSearchTerm(" \t\n ")).toEqual([]);
    expect(normalizeCatalogSearchTerm()).toEqual([]);
  });
});

describe("catalog translation search SQL", () => {
  it.each([
    ["product", applyProductListSearch],
    ["variant", applyProductVariantListSearch],
  ] as const)(
    "uses correlated active translation precedence for %s search",
    (_entity, applySearch) => {
      const qb = new RecordingQueryBuilder("catalog");

      applySearch(queryBuilderFor(qb), "needle", context("de"));

      expect(qb.conditions[0]).toContain("EXISTS");
      expect(qb.conditions[0]).toContain("NOT EXISTS");
      expect(qb.conditions[0]).toContain("baseId = catalog.id");
      expect(qb.parameters).toMatchObject({
        [parameterName(applySearch, "ActiveLanguage")]: LanguageCode.de,
        [parameterName(applySearch, "DefaultLanguage")]: LanguageCode.en,
      });
    },
  );

  it.each([
    ["product", applyProductListSearch],
    ["variant", applyProductVariantListSearch],
  ] as const)(
    "does not add a redundant fallback branch for identical %s languages",
    (_entity, applySearch) => {
      const qb = new RecordingQueryBuilder("catalog");

      applySearch(queryBuilderFor(qb), "needle", context("en"));

      expect(qb.conditions[0]).toContain("EXISTS");
      expect(qb.conditions[0]).not.toContain("NOT EXISTS");
    },
  );

  it("uses exactly one EXISTS parentheses layer for TypeORM subqueries", () => {
    const qb = new RecordingQueryBuilder("catalog");

    applyProductListSearch(queryBuilderFor(qb), "needle", context("de"));

    expect(qb.conditions[0]).not.toContain("EXISTS ((");
    expect(qb.conditions[0].match(/(?:NOT )?EXISTS \(SELECT/g)).toHaveLength(4);
  });
});

describe("catalog translation search SQLite execution", () => {
  it("executes product and variant search through real TypeORM subqueries", async () => {
    await ensureConfigLoaded();
    const entities = Object.values(coreEntitiesMap);
    setEntityIdStrategy(defaultConfig.entityIdStrategy, entities);
    const dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities,
      synchronize: true,
    });
    await dataSource.initialize();

    try {
      const productQb = dataSource
        .getRepository(Product)
        .createQueryBuilder("catalog")
        .setFindOptions({
          relations: ["featuredAsset", "assets"],
          take: 10,
          skip: 0,
        })
        .innerJoin(
          "catalog.channels",
          "lqb__channel",
          "lqb__channel.id = :channelId",
          { channelId: 1 },
        );
      applyProductListSearch(productQb, "needle", context("de"));
      const variantQb = dataSource
        .getRepository(ProductVariant)
        .createQueryBuilder("catalog")
        .setFindOptions({
          relations: ["featuredAsset", "taxCategory", "channels"],
          take: 10,
          skip: 0,
        })
        .innerJoin(
          "catalog.channels",
          "lqb__channel",
          "lqb__channel.id = :channelId",
          { channelId: 1 },
        );
      applyProductVariantListSearch(variantQb, "needle", context("de"));

      const [productSql, productParameters] = productQb.getQueryAndParameters();
      const [variantSql, variantParameters] = variantQb.getQueryAndParameters();
      expect(productSql).toContain("EXISTS (SELECT");
      expect(productSql).not.toContain("EXISTS ((");
      expect(variantSql).toContain("EXISTS (SELECT");
      expect(variantSql).not.toContain("EXISTS ((");
      expect(productParameters).toContain("%needle%");
      expect(variantParameters).toContain("%needle%");

      await expect(productQb.getManyAndCount()).resolves.toEqual([[], 0]);
      await expect(variantQb.getManyAndCount()).resolves.toEqual([[], 0]);
    } finally {
      await dataSource.destroy();
    }
  });
});

type SearchFunction =
  | typeof applyProductListSearch
  | typeof applyProductVariantListSearch;

class RecordingQueryBuilder {
  readonly conditions: string[] = [];
  readonly parameters: Record<string, unknown> = {};
  private fromAlias = "subquery";
  private readonly clauses: string[] = [];

  constructor(readonly alias: string) {}

  subQuery(): RecordingQueryBuilder {
    return new RecordingQueryBuilder(this.alias);
  }

  select(): this {
    return this;
  }

  from(_entity: unknown, alias: string): this {
    this.fromAlias = alias;
    return this;
  }

  innerJoin(_relation: string, _alias: string, condition: string): this {
    this.clauses.push(condition);
    return this;
  }

  where(condition: string): this {
    this.clauses.push(condition);
    return this;
  }

  andWhere(condition: string, parameters?: Record<string, unknown>): this {
    this.clauses.push(condition);
    this.conditions.push(condition);
    Object.assign(this.parameters, parameters);
    return this;
  }

  getQuery(): string {
    return `(SELECT 1 FROM ${this.fromAlias} WHERE ${this.clauses.join(" AND ")})`;
  }
}

function context(languageCode: "de" | "en"): RequestContext {
  const channel = new Channel({
    id: 1,
    defaultLanguageCode: LanguageCode.en,
  });
  return new RequestContext({
    apiType: "admin",
    authorizedAsOwnerOnly: false,
    channel,
    isAuthorized: true,
    languageCode: languageCode === "de" ? LanguageCode.de : LanguageCode.en,
  });
}

function queryBuilderFor(
  qb: RecordingQueryBuilder,
): SelectQueryBuilder<Product> & SelectQueryBuilder<ProductVariant> {
  return qb as unknown as SelectQueryBuilder<Product> &
    SelectQueryBuilder<ProductVariant>;
}

function parameterName(
  applySearch: SearchFunction,
  suffix: "ActiveLanguage" | "DefaultLanguage",
): string {
  return `${applySearch === applyProductListSearch ? "product" : "variant"}ListSearch${suffix}_0`;
}
