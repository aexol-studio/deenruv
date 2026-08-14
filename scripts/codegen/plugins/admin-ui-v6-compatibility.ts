const replaceExactlyOnce = (
  source: string,
  search: string,
  replacement: string,
  description: string,
): string => {
  const occurrences = source.split(search).length - 1;
  if (occurrences !== 1) {
    throw new Error(
      `Expected exactly one ${description}, found ${occurrences}. Update the legacy admin-ui Codegen compatibility transform.`,
    );
  }
  return source.replace(search, replacement);
};

/**
 * GraphQL Codegen v6 makes nullable result fields always present. The legacy
 * local-state cache models an unset locale as `undefined`.
 */
export function transformAdminUiOperationTypes(source: string): string {
  let transformed = replaceExactlyOnce(
    source,
    "export type GetUiStateQuery = { uiState: { __typename: 'UiState', language: Types.LanguageCode, locale: string | null,",
    "export type GetUiStateQuery = { uiState: { __typename: 'UiState', language: Types.LanguageCode, locale?: string | null,",
    "GetUiStateQuery locale field",
  );
  transformed = replaceExactlyOnce(
    transformed,
    "export type GetProductVariantQuery = { productVariant:",
    "export type GetProductVariantQuery = { productVariant?:",
    "GetProductVariantQuery productVariant field",
  );
  transformed = replaceExactlyOnce(
    transformed,
    "export type GetProfileDetailQuery = { activeAdministrator: {",
    "export type GetProfileDetailQuery = { activeAdministrator: Types.Administrator & {",
    "GetProfileDetailQuery activeAdministrator field",
  );

  const requiredTypenames = new Set([
    "BooleanCustomFieldConfig",
    "CurrentUser",
    "DateTimeCustomFieldConfig",
    "DuplicateEntityError",
    "DuplicateEntitySuccess",
    "FloatCustomFieldConfig",
    "IntCustomFieldConfig",
    "InvalidCredentialsError",
    "LocaleStringCustomFieldConfig",
    "LocaleTextCustomFieldConfig",
    "NativeAuthStrategyError",
    "NetworkStatus",
    "RelationCustomFieldConfig",
    "StringCustomFieldConfig",
    "TextCustomFieldConfig",
    "UiState",
    "UserStatus",
  ]);
  let typenameCount = 0;
  transformed = transformed.replace(
    /__typename: '([A-Za-z0-9_]+)'/g,
    (typename, typeName: string) => {
      typenameCount++;
      return requiredTypenames.has(typeName)
        ? typename
        : `__typename?: '${typeName}'`;
    },
  );
  if (typenameCount === 0) {
    throw new Error(
      "Expected generated operation typenames. Update the legacy admin-ui Codegen compatibility transform.",
    );
  }
  for (const typeName of requiredTypenames) {
    if (!transformed.includes(`__typename: '${typeName}'`)) {
      throw new Error(
        `Expected required ${typeName} discriminator. Update the legacy admin-ui Codegen compatibility transform.`,
      );
    }
  }

  return transformed;
}

/**
 * The v5 admin-ui treated Asset.focalPoint as present-but-nullable. Keeping this
 * one schema field required preserves assignability with selected Asset shapes.
 */
export function transformAdminUiSchemaTypes(source: string): string {
  const assetStart = source.indexOf("export type Asset = Node & {");
  const assetEnd = source.indexOf("\n};", assetStart);
  if (assetStart === -1 || assetEnd === -1) {
    throw new Error(
      "Could not locate the Asset schema type for legacy admin-ui compatibility.",
    );
  }

  const asset = source.slice(assetStart, assetEnd + 3);
  const transformedAsset = replaceExactlyOnce(
    asset,
    "  focalPoint?: Maybe<Coordinate>;",
    "  focalPoint: Maybe<Coordinate>;",
    "optional Asset.focalPoint field",
  );

  return source.slice(0, assetStart) + transformedAsset + source.slice(assetEnd + 3);
}
