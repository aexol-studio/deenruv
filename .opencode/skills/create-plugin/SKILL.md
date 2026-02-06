---
name: create-plugin
description: Step-by-step guide to create a new Deenruv plugin with server and UI components
---

# Create Deenruv Plugin

## When to Use This Skill

- User asks to create a new plugin
- User wants to extend Deenruv with custom functionality (entities, API, admin UI)
- User asks about plugin architecture or scaffolding

## Plugin Directory Structure

```
plugins/<feature>-plugin/
├── package.json
├── tsconfig.json                  # Project references (server + ui)
├── src/
│   ├── plugin-server/
│   │   ├── tsconfig.json          # Server-side TS config
│   │   ├── index.ts               # Re-exports from plugin.ts
│   │   ├── plugin.ts              # @DeenruvPlugin() class definition
│   │   ├── constants.ts           # Injection tokens (Symbols)
│   │   ├── types.ts               # Config interfaces
│   │   ├── entities/              # TypeORM entities
│   │   ├── services/              # NestJS injectable services
│   │   ├── resolvers/             # GraphQL resolvers (or api/)
│   │   └── extensions/            # GraphQL schema extensions (.ts with gql``)
│   └── plugin-ui/
│       ├── tsconfig.json          # UI-side TS config
│       ├── index.tsx              # createDeenruvUIPlugin() call
│       ├── translation-ns.ts      # Symbol-based namespace (or constants.ts)
│       ├── locales/
│       │   ├── en/
│       │   │   ├── index.ts       # Re-exports JSON files as array
│       │   │   └── feature.json   # English translations
│       │   └── pl/
│       │       ├── index.ts
│       │       └── feature.json   # Polish translations
│       ├── components/            # React components
│       └── graphql/               # Zeus-generated types (auto-generated)
└── e2e/                           # E2E tests (*.e2e-spec.ts)
```

## Step-by-Step Instructions

### 1. Create Directory Structure

Replace `<feature>` with the plugin name (kebab-case, e.g. `loyalty`, `wishlist`).

```bash
FEATURE=<feature>
mkdir -p plugins/${FEATURE}-plugin/src/plugin-server/{entities,services,resolvers,extensions}
mkdir -p plugins/${FEATURE}-plugin/src/plugin-ui/{locales/en,locales/pl,components}
mkdir -p plugins/${FEATURE}-plugin/e2e
```

### 2. Root `tsconfig.json`

File: `plugins/<feature>-plugin/tsconfig.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true
  },
  "references": [
    { "path": "./src/plugin-server" },
    { "path": "./src/plugin-ui" }
  ],
  "files": []
}
```

> If the plugin has no UI, remove the `plugin-ui` reference.

### 3. Server `tsconfig.json`

File: `plugins/<feature>-plugin/src/plugin-server/tsconfig.json`

```json
{
  "compilerOptions": {
    "jsx": "react",
    "useDefineForClassFields": false,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "noLib": false,
    "declaration": true,
    "skipLibCheck": true,
    "noEmitOnError": false,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es2017",
    "strict": true,
    "strictPropertyInitialization": false,
    "sourceMap": false,
    "newLine": "LF",
    "resolveJsonModule": true,
    "outDir": "../../dist/plugin-server"
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist", "ui"]
}
```

### 4. UI `tsconfig.json`

File: `plugins/<feature>-plugin/src/plugin-ui/tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2020",
    "jsx": "react",
    "outDir": "../../dist/plugin-ui",
    "importHelpers": true,
    "declaration": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["./**/*.tsx", "./**/*.json", "./**/*.ts"]
}
```

### 5. `package.json`

File: `plugins/<feature>-plugin/package.json`

```json
{
  "name": "@deenruv/<feature>-plugin",
  "version": "1.0.0",
  "license": "MIT",
  "type": "module",
  "files": ["dist/**/*"],
  "main": "./dist/plugin-server/index.js",
  "exports": {
    ".": "./dist/plugin-server/index.js",
    "./plugin-server": "./dist/plugin-server/index.js",
    "./plugin-ui": "./dist/plugin-ui/index.js"
  },
  "scripts": {
    "build": "rimraf dist && tsc --build",
    "watch": "tsc --build --watch",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "zeus": "zeus http://localhost:3000/admin-api ./src/plugin-server --td && zeus http://localhost:3000/admin-api ./src/plugin-ui --td"
  },
  "peerDependencies": {
    "@deenruv/core": "^0.1.0"
  },
  "dependencies": {
    "@deenruv/common": "workspace:^",
    "@deenruv/admin-types": "workspace:^",
    "@deenruv/react-ui-devkit": "workspace:^",
    "@nestjs/common": "^10.3.10",
    "@nestjs/graphql": "^12.2.0",
    "graphql-tag": "^2.12.6",
    "graphql-zeus": "^7.0.0",
    "lucide-react": "^0.363.0",
    "react": "^18.2.0",
    "react-i18next": "^14.0.5",
    "react-router-dom": "^6.22.1",
    "sonner": "^1.4.41"
  },
  "devDependencies": {
    "@deenruv/core": "workspace:^",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "rimraf": "^5.0.10",
    "typescript": "5.3.3"
  }
}
```

> Remove UI-related deps (`react`, `lucide-react`, `react-ui-devkit`, etc.) if the plugin is server-only.

### 6. Constants File

File: `plugins/<feature>-plugin/src/plugin-server/constants.ts`

```typescript
export const FEATURE_PLUGIN_OPTIONS = Symbol("<feature>-plugin-options");
```

### 7. Types File

File: `plugins/<feature>-plugin/src/plugin-server/types.ts`

```typescript
export type FeaturePluginOptions = {
  // Plugin configuration options
  enabled?: boolean;
};
```

### 8. Server Plugin Definition

File: `plugins/<feature>-plugin/src/plugin-server/index.ts`

```typescript
export * from "./plugin.js";
```

#### Variant A: Simple Plugin (custom fields only)

File: `plugins/<feature>-plugin/src/plugin-server/plugin.ts`

```typescript
import { PluginCommonModule, DeenruvPlugin, LanguageCode } from "@deenruv/core";

@DeenruvPlugin({
  compatibility: "^0.0.1",
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Product.push({
      name: "featureField",
      type: "string",
      nullable: true,
      defaultValue: "",
      label: [
        { languageCode: LanguageCode.en, value: "Feature Field" },
        { languageCode: LanguageCode.pl, value: "Pole funkcji" },
      ],
    });
    return config;
  },
})
export class FeaturePlugin {}
```

#### Variant B: Full Plugin (entities, API, services)

File: `plugins/<feature>-plugin/src/plugin-server/plugin.ts`

```typescript
import { PluginCommonModule, DeenruvPlugin } from "@deenruv/core";
import { ADMIN_API_EXTENSION } from "./extensions/admin.extension.js";
import type { FeaturePluginOptions } from "./types.js";
import { FEATURE_PLUGIN_OPTIONS } from "./constants.js";
import { FeatureEntity } from "./entities/feature.entity.js";
import { FeatureAdminResolver } from "./resolvers/admin.resolver.js";
import { FeatureService } from "./services/feature.service.js";

@DeenruvPlugin({
  compatibility: "^0.0.1",
  imports: [PluginCommonModule],
  entities: [FeatureEntity],
  adminApiExtensions: {
    schema: ADMIN_API_EXTENSION,
    resolvers: [FeatureAdminResolver],
  },
  providers: [
    { provide: FEATURE_PLUGIN_OPTIONS, useFactory: () => FeaturePlugin.options },
    FeatureService,
  ],
})
export class FeaturePlugin {
  private static options: FeaturePluginOptions;

  static init(options: FeaturePluginOptions) {
    this.options = options;
    return this;
  }
}
```

> **IMPORTANT:** All relative imports in `plugin-server/` must use `.js` extensions (ESM).

### 9. TypeORM Entity

File: `plugins/<feature>-plugin/src/plugin-server/entities/feature.entity.ts`

```typescript
import { Column, Entity } from "typeorm";
import type { DeepPartial } from "@deenruv/core";
import { DeenruvEntity } from "@deenruv/core";

@Entity()
export class FeatureEntity extends DeenruvEntity {
  constructor(input?: DeepPartial<FeatureEntity>) {
    super(input);
  }

  @Column()
  name: string;

  @Column({ default: true })
  enabled: boolean;
}
```

### 10. GraphQL Schema Extension

File: `plugins/<feature>-plugin/src/plugin-server/extensions/admin.extension.ts`

```typescript
import gql from "graphql-tag";

export const ADMIN_API_EXTENSION = gql`
  type Feature {
    id: ID!
    name: String!
    enabled: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  extend type Query {
    feature(id: ID!): Feature
  }

  extend type Mutation {
    createFeature(input: CreateFeatureInput!): Feature!
    deleteFeature(id: ID!): DeletionResponse!
  }

  input CreateFeatureInput {
    name: String!
    enabled: Boolean
  }
`;
```

### 11. Service

File: `plugins/<feature>-plugin/src/plugin-server/services/feature.service.ts`

```typescript
import { Inject, Injectable } from "@nestjs/common";
import { ID, RequestContext, TransactionalConnection } from "@deenruv/core";
import { FeatureEntity } from "../entities/feature.entity.js";
import { FEATURE_PLUGIN_OPTIONS } from "../constants.js";
import type { FeaturePluginOptions } from "../types.js";

@Injectable()
export class FeatureService {
  constructor(
    private connection: TransactionalConnection,
    @Inject(FEATURE_PLUGIN_OPTIONS)
    private options: FeaturePluginOptions,
  ) {}

  async findOne(ctx: RequestContext, id: ID) {
    return this.connection.getRepository(ctx, FeatureEntity).findOne({ where: { id } });
  }

  async create(ctx: RequestContext, input: { name: string; enabled?: boolean }) {
    const entity = new FeatureEntity({ name: input.name, enabled: input.enabled ?? true });
    return this.connection.getRepository(ctx, FeatureEntity).save(entity);
  }

  async delete(ctx: RequestContext, id: ID) {
    await this.connection.getRepository(ctx, FeatureEntity).delete(id);
    return { result: "DELETED" as const };
  }
}
```

### 12. Admin Resolver

File: `plugins/<feature>-plugin/src/plugin-server/resolvers/admin.resolver.ts`

```typescript
import { Mutation, Query, Args, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, ID, Permission, RequestContext } from "@deenruv/core";
import { FeatureService } from "../services/feature.service.js";

@Resolver()
export class FeatureAdminResolver {
  constructor(private service: FeatureService) {}

  @Allow(Permission.SuperAdmin)
  @Query()
  async feature(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.service.findOne(ctx, args.id);
  }

  @Allow(Permission.SuperAdmin)
  @Mutation()
  async createFeature(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: { name: string; enabled?: boolean } },
  ) {
    return this.service.create(ctx, args.input);
  }

  @Allow(Permission.SuperAdmin)
  @Mutation()
  async deleteFeature(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.service.delete(ctx, args.id);
  }
}
```

### 13. UI Plugin Definition

File: `plugins/<feature>-plugin/src/plugin-ui/index.tsx`

```tsx
import { BASE_GROUP_ID, createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import { LayoutGridIcon } from "lucide-react";
import { translationNS } from "./translation-ns";
import pl from "./locales/pl";
import en from "./locales/en";
import React from "react";
import { FeaturePage } from "./components/FeaturePage";

export const UIPlugin = createDeenruvUIPlugin({
  version: "1.0.0",
  name: "Feature Plugin",
  pages: [
    { path: "", element: <FeaturePage /> },
  ],
  translations: {
    ns: translationNS,
    data: { en, pl },
  },
  navMenuLinks: [
    {
      id: "feature",
      href: "",
      labelId: "nav.link",
      groupId: BASE_GROUP_ID.SETTINGS,
      icon: LayoutGridIcon,
    },
  ],
});
```

### 14. Translation Namespace

Two patterns exist in the codebase. Pick one:

**Pattern A — Symbol-based** (file: `translation-ns.ts`):

```typescript
export const translationNS = Symbol("<feature>-plugin").toString();
```

**Pattern B — String constant** (file: `constants.ts`):

```typescript
export const TRANSLATION_NAMESPACE = "<feature>-plugin";
```

### 15. Locale Files

File: `plugins/<feature>-plugin/src/plugin-ui/locales/en/feature.json`

```json
{
  "nav": {
    "link": "Feature"
  },
  "title": "Feature Management",
  "description": "Manage features from here."
}
```

File: `plugins/<feature>-plugin/src/plugin-ui/locales/en/index.ts`

```typescript
import feature from "./feature.json";

export default [feature];
```

File: `plugins/<feature>-plugin/src/plugin-ui/locales/pl/feature.json`

```json
{
  "nav": {
    "link": "Funkcja"
  },
  "title": "Zarządzanie funkcjami",
  "description": "Zarządzaj funkcjami stąd."
}
```

File: `plugins/<feature>-plugin/src/plugin-ui/locales/pl/index.ts`

```typescript
import feature from "./feature.json";

export default [feature];
```

### 16. Sample React Page Component

File: `plugins/<feature>-plugin/src/plugin-ui/components/FeaturePage.tsx`

```tsx
import React from "react";

export const FeaturePage = () => {
  return (
    <div>
      <h1>Feature Plugin</h1>
      <p>Plugin page content goes here.</p>
    </div>
  );
};
```

### 17. Register Plugin in Dev Config

Edit `apps/server/dev-config.ts`:

```typescript
import { FeaturePlugin } from "@deenruv/<feature>-plugin/plugin-server";

// Add to the plugins array:
plugins: [
  // ... existing plugins
  FeaturePlugin.init({ /* options */ }),
],
```

For the UI plugin, register it in the admin panel's plugin list at `apps/panel/`.

### 18. Zeus Type Generation

After the server is running with the new GraphQL extensions:

```bash
cd plugins/<feature>-plugin
pnpm zeus
```

This generates Zeus client types in `src/plugin-server/zeus/` and `src/plugin-ui/zeus/` (or `graphql/`).

### 19. Build & Test

```bash
pnpm install          # Install workspace deps
pnpm build            # Build all packages (includes the new plugin)
pnpm start:server     # Verify server starts without errors
```

## `createDeenruvUIPlugin` Full Interface

All available options for the UI plugin:

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Plugin display name |
| `version` | `string` | Plugin version |
| `config` | `T` | Generic config object passed to components |
| `pages` | `PluginPage[]` | Full pages at `/admin-ui/extensions/<plugin>/` |
| `components` | `DeenruvUIDetailComponent[]` | Injected into detail views (e.g. product sidebar) |
| `tables` | `DeenruvUITable[]` | Custom columns, row/bulk actions on list views |
| `tabs` | `DeenruvTabs[]` | Extra tabs on detail views (e.g. customer detail) |
| `actions` | `{ inline?, dropdown? }` | Action buttons on detail views |
| `notifications` | `Notification[]` | Custom notification handlers |
| `inputs` | `PluginComponent[]` | Override custom field input components |
| `modals` | `DeenruvUIModalComponent[]` | Custom modals on specific locations |
| `widgets` | `Widget[]` | Dashboard widgets |
| `navMenuGroups` | `PluginNavigationGroup[]` | Navigation groups in sidebar |
| `navMenuLinks` | `PluginNavigationLink[]` | Navigation links in sidebar |
| `topNavigationComponents` | `PluginComponent[]` | Components in top nav bar |
| `topNavigationActionsMenu` | `NavigationAction[]` | Actions in top nav dropdown |
| `translations` | `{ ns, data }` | i18n translations (`ns` = namespace string, `data` = `{ en, pl }`) |

### `BASE_GROUP_ID` Values

Use these to place nav links/groups in the sidebar:

| ID | Value |
|----|-------|
| `BASE_GROUP_ID.SHOP` | `"shop-group"` |
| `BASE_GROUP_ID.ASSORTMENT` | `"assortment-group"` |
| `BASE_GROUP_ID.USERS` | `"users-group"` |
| `BASE_GROUP_ID.PROMOTIONS` | `"promotions-group"` |
| `BASE_GROUP_ID.SHIPPING` | `"shipping-group"` |
| `BASE_GROUP_ID.SETTINGS` | `"settings-group"` |

## Key Conventions

- **Naming:** Plugin directories are always `<feature>-plugin`. Package name is `@deenruv/<feature>-plugin`.
- **ESM imports:** All `.ts` imports in `plugin-server/` must use `.js` extensions.
- **Plugin class pattern:** Use `static init(options)` + `static options` + provider factory `useFactory: () => Plugin.options`.
- **Injection tokens:** Always `Symbol("<feature>-plugin-options")` in `constants.ts`.
- **TypeScript:** Version 5.3.3, strict mode enabled.
- **Translations:** Always provide both `en` and `pl` locales.

## Checklist

After creating a plugin, verify:

- [ ] Directory structure created with both `plugin-server/` and `plugin-ui/` (if UI needed)
- [ ] Root `tsconfig.json` with project references
- [ ] Server and UI `tsconfig.json` files with correct `outDir`
- [ ] `package.json` with `@deenruv/` scope, workspace deps, correct `exports`
- [ ] Server plugin with `@DeenruvPlugin` decorator, `PluginCommonModule` import
- [ ] `constants.ts` with `Symbol()`-based injection token
- [ ] `types.ts` with options interface
- [ ] `index.ts` re-exporting from `plugin.ts`
- [ ] UI plugin with `createDeenruvUIPlugin()` (if UI needed)
- [ ] Translations in `en/` and `pl/` with `index.ts` re-exporting JSON arrays
- [ ] Plugin registered in `apps/server/dev-config.ts`
- [ ] `pnpm install` succeeds
- [ ] `pnpm build` succeeds
- [ ] Server starts without errors
