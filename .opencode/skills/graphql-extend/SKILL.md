---
name: graphql-extend
description: How to extend the Deenruv GraphQL API with new types, queries, mutations, and resolvers
---

# Extending the Deenruv GraphQL API

Use this skill when:
- Adding new GraphQL queries, mutations, or types to a plugin
- Extending the Admin API or Shop API
- Setting up Zeus typed client for plugin UI code
- Running codegen after schema changes

## Two GraphQL Systems

1. **Server-side** (`plugin-server/`) — NestJS resolvers + `gql` schema extensions
2. **Client-side** (`plugin-ui/`) — Zeus typed client for type-safe queries in React

## Server-Side: Schema + Resolvers

### Step 1: Define the schema extension

```typescript
// plugin-server/extensions/admin-api.extension.ts
import { gql } from "graphql-tag";
import { DocumentNode } from "graphql";

export const AdminAPIExtension: DocumentNode = gql`
  type Feature {
    id: ID!
    name: String!
    enabled: Boolean!
    createdAt: DateTime!
  }

  input CreateFeatureInput {
    name: String!
    enabled: Boolean
  }

  type FeatureList implements PaginatedList {
    items: [Feature!]!
    totalItems: Int!
  }

  input FeatureFilterParameter {
    id: IDOperators
    name: StringOperators
    createdAt: DateOperators
    _and: [FeatureFilterParameter!]
    _or: [FeatureFilterParameter!]
  }

  input FeatureSortParameter {
    id: SortOrder
    name: SortOrder
    createdAt: SortOrder
  }

  input FeatureListOptions {
    skip: Int
    take: Int
    sort: FeatureSortParameter
    filter: FeatureFilterParameter
    filterOperator: LogicalOperator
  }

  extend type Query {
    features(options: FeatureListOptions): FeatureList!
    feature(id: ID!): Feature
  }

  extend type Mutation {
    createFeature(input: CreateFeatureInput!): Feature!
    deleteFeature(id: ID!): DeletionResponse!
  }
`;
```

**Conventions:** `implements PaginatedList` for lists, explicit `FilterParameter`/`SortParameter`/`ListOptions` inputs, `DeletionResponse` for deletes, shared types in `shared.extension.ts` interpolated via `${SharedAPIExtension}`.

### Step 2: Create the resolver

```typescript
// plugin-server/api/feature-admin.resolver.ts
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Allow, Ctx, Permission, RequestContext } from "@deenruv/core";
import { ModelTypes } from "../zeus/index.js";
import { FeatureService } from "../services/feature.service.js";

@Resolver()
export class FeatureAdminAPIResolver {
  constructor(private readonly featureService: FeatureService) {}

  @Query()
  @Allow(Permission.ReadSettings)
  async features(
    @Ctx() ctx: RequestContext,
    @Args() args: { options: ModelTypes["FeatureListOptions"] },
  ) {
    return this.featureService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.ReadSettings)
  async feature(@Ctx() ctx: RequestContext, @Args() args: { id: string }) {
    return this.featureService.findOne(ctx, args.id);
  }

  @Mutation()
  @Allow(Permission.UpdateSettings)
  async createFeature(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: ModelTypes["CreateFeatureInput"] },
  ) {
    return this.featureService.create(ctx, args.input);
  }
}
```

**Conventions:** `@Allow(Permission.X)` on every query/mutation, `@Ctx() ctx: RequestContext` for user/channel access, `ModelTypes["TypeName"]` from plugin's `zeus/index.js` for typed args, `@Relations(Entity) relations: RelationPaths<Entity>` for relation loading.

### Step 3: Register in the plugin

```typescript
// plugin-server/index.ts
import { PluginCommonModule, DeenruvPlugin } from "@deenruv/core";
import { AdminAPIExtension } from "./extensions/admin-api.extension.js";
import { FeatureAdminAPIResolver } from "./api/feature-admin.resolver.js";
import { FeatureService } from "./services/feature.service.js";
import { FeatureEntity } from "./entities/feature.entity.js";

@DeenruvPlugin({
  compatibility: "0.0.1",
  imports: [PluginCommonModule],
  entities: [FeatureEntity],
  adminApiExtensions: {
    schema: AdminAPIExtension,
    resolvers: [FeatureAdminAPIResolver],
  },
  // shopApiExtensions: { schema: ShopAPIExtension, resolvers: [...] },
  providers: [FeatureService],
})
export class FeaturePlugin {}
```

## Client-Side: Zeus Typed Queries

### Step 1: Generate Zeus types

Server must be running with the plugin loaded:

```bash
zeus http://localhost:3000/admin-api ./src/plugin-ui --td
```

Generates `zeus/index.ts`, `zeus/const.ts`, and `zeus/typedDocumentNode.ts`.

### Step 2: Create selectors

```typescript
// plugin-ui/graphql/selectors.ts
import { Selector } from "../zeus/index.js";

export const FeatureListSelector = Selector("Feature")({
  id: true, name: true, enabled: true, createdAt: true,
});

export const FeatureDetailSelector = Selector("Feature")({
  id: true, name: true, enabled: true, createdAt: true,
  relatedItems: { id: true, name: true },
});
```

### Step 3: Create queries and mutations

```typescript
// plugin-ui/graphql/queries.ts
import { typedGql } from "../zeus/typedDocumentNode.js";
import { $ } from "../zeus/index.js";
import { scalars } from "@deenruv/admin-types";
import { FeatureListSelector, FeatureDetailSelector } from "./selectors.js";

export const FeaturesQuery = typedGql("query", { scalars })({
  features: [
    { options: $("options", "FeatureListOptions!") },
    { items: FeatureListSelector, totalItems: true },
  ],
});

export const FeatureQuery = typedGql("query", { scalars })({
  feature: [{ id: $("id", "ID!") }, FeatureDetailSelector],
});
```

```typescript
// plugin-ui/graphql/mutations.ts
import { typedGql } from "../zeus/typedDocumentNode.js";
import { $ } from "../zeus/index.js";
import { scalars } from "@deenruv/admin-types";

export const CreateFeatureMutation = typedGql("mutation", { scalars })({
  createFeature: [
    { input: $("input", "CreateFeatureInput!") },
    { id: true, name: true },
  ],
});

// For Boolean returns, select `true` directly
export const DeleteFeatureMutation = typedGql("mutation", { scalars })({
  deleteFeature: [{ id: $("id", "ID!") }, { result: true, message: true }],
});
```

### Step 4: Use in React components

```typescript
import { useQuery, useMutation, useTranslation } from "@deenruv/react-ui-devkit";
import { FeaturesQuery } from "../graphql/queries";
import { CreateFeatureMutation } from "../graphql/mutations";

export const FeatureList = () => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(FeaturesQuery, {
    variables: { options: { take: 20, skip: 0 } },
  });
  const [createFeature] = useMutation(CreateFeatureMutation);
  // render data.features.items
};
```

## Running Codegen

For **core framework types** (not plugin Zeus), run from repo root:

```bash
pnpm codegen
# Generates packages/common/src/generated-types.ts (Admin API)
# Generates packages/common/src/generated-shop-types.ts (Shop API)
```

Run after modifying core GraphQL schemas. Plugin Zeus types are generated separately as above.

## Checklist

- [ ] Schema extension with `gql` tag, types/inputs defined
- [ ] FilterParameter/SortParameter/ListOptions for paginated queries
- [ ] Resolver with `@Resolver()`, `@Query()`, `@Mutation()` decorators
- [ ] `@Allow(Permission.X)` on every query and mutation
- [ ] Registered in `@DeenruvPlugin` via `adminApiExtensions`/`shopApiExtensions`
- [ ] Zeus types generated: `zeus http://localhost:3000/admin-api ./src/plugin-ui --td`
- [ ] Selectors, queries, mutations in `plugin-ui/graphql/`
- [ ] Components use `useQuery`/`useMutation` from `@deenruv/react-ui-devkit`
- [ ] `pnpm codegen` run if core types affected
