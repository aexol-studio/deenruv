import { SelectQueryBuilder } from "typeorm";

import { RequestContext } from "../../api/common/request-context";
import { ProductTranslation } from "../../entity/product/product-translation.entity";
import { Product } from "../../entity/product/product.entity";
import { ProductVariantTranslation } from "../../entity/product-variant/product-variant-translation.entity";
import { ProductVariant } from "../../entity/product-variant/product-variant.entity";

export type CatalogListOptions = {
  searchTerm?: string | null;
};

export function normalizeCatalogSearchTerm(
  searchTerm?: string | null,
): string[] {
  return searchTerm?.trim().split(/\s+/).filter(Boolean) ?? [];
}

function existsExpression(query: string, negated = false): string {
  const trimmedQuery = query.trim();
  const normalizedQuery =
    trimmedQuery.startsWith("(") && trimmedQuery.endsWith(")")
      ? trimmedQuery.slice(1, -1).trim()
      : trimmedQuery;
  return `${negated ? "NOT " : ""}EXISTS (${normalizedQuery})`;
}

export function applyProductListSearch(
  qb: SelectQueryBuilder<Product>,
  searchTerm: string | null | undefined,
  ctx: RequestContext,
): void {
  const tokens = normalizeCatalogSearchTerm(searchTerm);
  if (tokens.length === 0) {
    return;
  }
  const activeLanguageCode = ctx.languageCode;
  const defaultLanguageCode = ctx.channel.defaultLanguageCode;

  tokens.forEach((token, index) => {
    const tokenParameter = `productListSearchToken_${index}`;
    const activeLanguageParameter = `productListSearchActiveLanguage_${index}`;
    const defaultLanguageParameter = `productListSearchDefaultLanguage_${index}`;
    const channelParameter = `productListSearchChannel_${index}`;
    const translationQb = qb
      .subQuery()
      .select("1")
      .from(ProductTranslation, `productListSearchTranslation_${index}`)
      .where(`productListSearchTranslation_${index}.baseId = ${qb.alias}.id`)
      .andWhere(
        `productListSearchTranslation_${index}.languageCode = :${activeLanguageParameter}`,
      )
      .andWhere(
        `(LOWER(productListSearchTranslation_${index}.name) LIKE :${tokenParameter} OR LOWER(productListSearchTranslation_${index}.slug) LIKE :${tokenParameter})`,
      );
    const defaultTranslationQb = qb
      .subQuery()
      .select("1")
      .from(ProductTranslation, `productListSearchDefaultTranslation_${index}`)
      .where(
        `productListSearchDefaultTranslation_${index}.baseId = ${qb.alias}.id`,
      )
      .andWhere(
        `productListSearchDefaultTranslation_${index}.languageCode = :${defaultLanguageParameter}`,
      )
      .andWhere(
        `(LOWER(productListSearchDefaultTranslation_${index}.name) LIKE :${tokenParameter} OR LOWER(productListSearchDefaultTranslation_${index}.slug) LIKE :${tokenParameter})`,
      );
    const activeTranslationExistsQb = qb
      .subQuery()
      .select("1")
      .from(ProductTranslation, `productListSearchActiveTranslation_${index}`)
      .where(
        `productListSearchActiveTranslation_${index}.baseId = ${qb.alias}.id`,
      )
      .andWhere(
        `productListSearchActiveTranslation_${index}.languageCode = :${activeLanguageParameter}`,
      );
    const variantQb = qb
      .subQuery()
      .select("1")
      .from(ProductVariant, `productListSearchVariant_${index}`)
      .innerJoin(
        `productListSearchVariant_${index}.channels`,
        `productListSearchVariantChannel_${index}`,
        `productListSearchVariantChannel_${index}.id = :${channelParameter}`,
      )
      .where(`productListSearchVariant_${index}.productId = ${qb.alias}.id`)
      .andWhere(`productListSearchVariant_${index}.deletedAt IS NULL`)
      .andWhere(
        `LOWER(productListSearchVariant_${index}.sku) LIKE :${tokenParameter}`,
      );

    const translationCondition =
      activeLanguageCode === defaultLanguageCode
        ? existsExpression(translationQb.getQuery())
        : `(${existsExpression(translationQb.getQuery())} OR (${existsExpression(defaultTranslationQb.getQuery())} AND ${existsExpression(activeTranslationExistsQb.getQuery(), true)}))`;

    qb.andWhere(
      `(${translationCondition} OR ${existsExpression(variantQb.getQuery())})`,
      {
        [tokenParameter]: `%${token.toLocaleLowerCase()}%`,
        [activeLanguageParameter]: activeLanguageCode,
        [defaultLanguageParameter]: defaultLanguageCode,
        [channelParameter]: ctx.channelId,
      },
    );
  });
}

export function applyProductVariantListSearch(
  qb: SelectQueryBuilder<ProductVariant>,
  searchTerm: string | null | undefined,
  ctx: RequestContext,
): void {
  const tokens = normalizeCatalogSearchTerm(searchTerm);
  if (tokens.length === 0) {
    return;
  }
  const activeLanguageCode = ctx.languageCode;
  const defaultLanguageCode = ctx.channel.defaultLanguageCode;

  tokens.forEach((token, index) => {
    const tokenParameter = `variantListSearchToken_${index}`;
    const activeLanguageParameter = `variantListSearchActiveLanguage_${index}`;
    const defaultLanguageParameter = `variantListSearchDefaultLanguage_${index}`;
    const translationQb = qb
      .subQuery()
      .select("1")
      .from(ProductVariantTranslation, `variantListSearchTranslation_${index}`)
      .where(`variantListSearchTranslation_${index}.baseId = ${qb.alias}.id`)
      .andWhere(
        `variantListSearchTranslation_${index}.languageCode = :${activeLanguageParameter}`,
      )
      .andWhere(
        `LOWER(variantListSearchTranslation_${index}.name) LIKE :${tokenParameter}`,
      );
    const defaultTranslationQb = qb
      .subQuery()
      .select("1")
      .from(
        ProductVariantTranslation,
        `variantListSearchDefaultTranslation_${index}`,
      )
      .where(
        `variantListSearchDefaultTranslation_${index}.baseId = ${qb.alias}.id`,
      )
      .andWhere(
        `variantListSearchDefaultTranslation_${index}.languageCode = :${defaultLanguageParameter}`,
      )
      .andWhere(
        `LOWER(variantListSearchDefaultTranslation_${index}.name) LIKE :${tokenParameter}`,
      );
    const activeTranslationExistsQb = qb
      .subQuery()
      .select("1")
      .from(
        ProductVariantTranslation,
        `variantListSearchActiveTranslation_${index}`,
      )
      .where(
        `variantListSearchActiveTranslation_${index}.baseId = ${qb.alias}.id`,
      )
      .andWhere(
        `variantListSearchActiveTranslation_${index}.languageCode = :${activeLanguageParameter}`,
      );
    const translationCondition =
      activeLanguageCode === defaultLanguageCode
        ? existsExpression(translationQb.getQuery())
        : `(${existsExpression(translationQb.getQuery())} OR (${existsExpression(defaultTranslationQb.getQuery())} AND ${existsExpression(activeTranslationExistsQb.getQuery(), true)}))`;

    qb.andWhere(
      `(LOWER(${qb.alias}.sku) LIKE :${tokenParameter} OR ${translationCondition})`,
      {
        [tokenParameter]: `%${token.toLocaleLowerCase()}%`,
        [activeLanguageParameter]: activeLanguageCode,
        [defaultLanguageParameter]: defaultLanguageCode,
      },
    );
  });
}
