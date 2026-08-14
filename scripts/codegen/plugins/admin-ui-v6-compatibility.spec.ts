import { describe, expect, it } from "vitest";

import {
  transformAdminUiOperationTypes,
  transformAdminUiSchemaTypes,
} from "./admin-ui-v6-compatibility.js";

describe("legacy admin-ui Codegen v6 compatibility", () => {
  it("narrows only the known operation compatibility shapes", () => {
    const source = `export type GetUiStateQuery = { uiState: { __typename: 'UiState', language: Types.LanguageCode, locale: string | null, theme: string } };
export type GetProductVariantQuery = { productVariant: { __typename: 'ProductVariant' } | null };
export type GetProfileDetailQuery = { activeAdministrator: { __typename: 'Administrator', id: string } | null };
type Result = { __typename: 'Asset', tags: Array<{ __typename: 'Tag' }>, focalPoint: { __typename: 'Coordinate' } };
type User = { __typename: 'CurrentUser' };
type State = { __typename: 'UserStatus' };
type Ui = { __typename: 'UiState' };
type Network = { __typename: 'NetworkStatus' };
type Duplicate = { __typename: 'DuplicateEntityError' } | { __typename: 'DuplicateEntitySuccess' };
type Login = { __typename: 'InvalidCredentialsError' } | { __typename: 'NativeAuthStrategyError' };
type Fields = { __typename: 'BooleanCustomFieldConfig' } | { __typename: 'DateTimeCustomFieldConfig' } | { __typename: 'FloatCustomFieldConfig' } | { __typename: 'IntCustomFieldConfig' } | { __typename: 'LocaleStringCustomFieldConfig' } | { __typename: 'LocaleTextCustomFieldConfig' } | { __typename: 'RelationCustomFieldConfig' } | { __typename: 'StringCustomFieldConfig' } | { __typename: 'TextCustomFieldConfig' };`;

    expect(transformAdminUiOperationTypes(source)).toBe(`export type GetUiStateQuery = { uiState: { __typename: 'UiState', language: Types.LanguageCode, locale?: string | null, theme: string } };
export type GetProductVariantQuery = { productVariant?: { __typename?: 'ProductVariant' } | null };
export type GetProfileDetailQuery = { activeAdministrator: Types.Administrator & { __typename?: 'Administrator', id: string } | null };
type Result = { __typename?: 'Asset', tags: Array<{ __typename?: 'Tag' }>, focalPoint: { __typename?: 'Coordinate' } };
type User = { __typename: 'CurrentUser' };
type State = { __typename: 'UserStatus' };
type Ui = { __typename: 'UiState' };
type Network = { __typename: 'NetworkStatus' };
type Duplicate = { __typename: 'DuplicateEntityError' } | { __typename: 'DuplicateEntitySuccess' };
type Login = { __typename: 'InvalidCredentialsError' } | { __typename: 'NativeAuthStrategyError' };
type Fields = { __typename: 'BooleanCustomFieldConfig' } | { __typename: 'DateTimeCustomFieldConfig' } | { __typename: 'FloatCustomFieldConfig' } | { __typename: 'IntCustomFieldConfig' } | { __typename: 'LocaleStringCustomFieldConfig' } | { __typename: 'LocaleTextCustomFieldConfig' } | { __typename: 'RelationCustomFieldConfig' } | { __typename: 'StringCustomFieldConfig' } | { __typename: 'TextCustomFieldConfig' };`);
  });

  it("changes only Asset.focalPoint in schema types", () => {
    const source = `export type Asset = Node & {
  focalPoint?: Maybe<Coordinate>;
  customFields?: Maybe<unknown>;
};
export type SearchResultAsset = {
  focalPoint?: Maybe<Coordinate>;
};`;

    expect(transformAdminUiSchemaTypes(source)).toBe(`export type Asset = Node & {
  focalPoint: Maybe<Coordinate>;
  customFields?: Maybe<unknown>;
};
export type SearchResultAsset = {
  focalPoint?: Maybe<Coordinate>;
};`);
  });

  it("fails loudly when an expected operation shape changes", () => {
    expect(() => transformAdminUiOperationTypes("type Unrelated = {};")).toThrow(
      "Expected exactly one GetUiStateQuery locale field",
    );
  });
});
