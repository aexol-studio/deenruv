---
name: e2e-test
description: Write E2E tests for Deenruv plugins using Vitest and @deenruv/testing utilities
---

# Writing E2E Tests for Deenruv Plugins

Use this skill when:
- Writing E2E tests for a new or existing plugin
- Bootstrapping a test server with `@deenruv/testing`
- Debugging E2E test failures or timeouts
- Understanding the testing patterns and shared config

## Test Structure

```
plugins/<feature>-plugin/
├── e2e/
│   ├── feature.e2e-spec.ts                    # E2E test file
│   ├── fixtures/                              # Test fixtures (CSV, assets)
│   │   ├── e2e-products-minimal.csv
│   │   └── assets/
│   └── graphql/
│       └── generated-e2e-admin-types.ts       # Generated types (optional)
└── package.json                               # Must have e2e script

e2e-common/
├── vitest.config.mts          # Shared Vitest config (SWC for decorators)
├── test-config.ts             # Auto-assigns unique port per suite (starts 3010)
├── e2e-initial-data.ts        # Seed data: tax rates, shipping, countries, collections
└── tsconfig.e2e.json          # TypeScript config for E2E
```

## Package.json Scripts

Every plugin with E2E tests needs these scripts:

```json
{
  "scripts": {
    "test": "vitest --run",
    "e2e": "cross-env PACKAGE=feature-plugin vitest --config ../../e2e-common/vitest.config.mts --run",
    "e2e:watch": "cross-env PACKAGE=feature-plugin vitest --config ../../e2e-common/vitest.config.mts"
  }
}
```

The shared `vitest.config.mts` includes SWC for NestJS decorator support and sets timeouts based on `E2E_DEBUG`.

## Core Pattern: Full E2E Test

```typescript
// plugins/feature-plugin/e2e/feature.e2e-spec.ts
import { mergeConfig } from "@deenruv/core";
import { createTestEnvironment } from "@deenruv/testing";
import gql from "graphql-tag";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { initialData } from "../../../e2e-common/e2e-initial-data";
import {
  testConfig,
  TEST_SETUP_TIMEOUT_MS,
} from "../../../e2e-common/test-config.js";
import { FeaturePlugin } from "../src/plugin-server";

describe("FeaturePlugin", () => {
  const { server, adminClient, shopClient } = createTestEnvironment(
    mergeConfig(testConfig(), {
      plugins: [
        FeaturePlugin.init({
          /* plugin options */
        }),
      ],
    }),
  );

  beforeAll(async () => {
    await server.init({
      initialData,
      productsCsvPath: path.join(__dirname, "fixtures/e2e-products-minimal.csv"),
      customerCount: 1,
    });
    await adminClient.asSuperAdmin();
  }, TEST_SETUP_TIMEOUT_MS);

  afterAll(async () => {
    await server.destroy();
  });

  it("should create a feature via admin API", async () => {
    const result = await adminClient.query(CREATE_FEATURE, {
      input: { name: "Test Feature", enabled: true },
    });
    expect(result.createFeature).toEqual(
      expect.objectContaining({ name: "Test Feature", enabled: true }),
    );
  });

  it("should list features with pagination", async () => {
    const result = await adminClient.query(LIST_FEATURES, {
      options: { take: 10 },
    });
    expect(result.features.items).toHaveLength(1);
    expect(result.features.totalItems).toBe(1);
  });
});

// --- GraphQL documents (inline or in separate file) ---

const CREATE_FEATURE = gql`
  mutation CreateFeature($input: CreateFeatureInput!) {
    createFeature(input: $input) {
      id
      name
      enabled
    }
  }
`;

const LIST_FEATURES = gql`
  query ListFeatures($options: FeatureListOptions) {
    features(options: $options) {
      items {
        id
        name
        enabled
      }
      totalItems
    }
  }
`;
```

**Key details from the real codebase:**
- `createTestEnvironment()` is called at describe scope (not inside beforeAll)
- `mergeConfig(testConfig(), { ... })` merges shared config with plugin-specific overrides
- `testConfig()` auto-assigns a unique port so parallel test suites don't collide
- `adminClient.asSuperAdmin()` logs in as superadmin after server init
- `TEST_SETUP_TIMEOUT_MS` is 120s normally, 30min with `E2E_DEBUG=true`

## SimpleGraphQLClient API

The `adminClient` and `shopClient` are `SimpleGraphQLClient` instances with these methods:

| Method | Description |
|--------|-------------|
| `query(doc, variables?)` | Execute any GraphQL query or mutation |
| `asSuperAdmin()` | Login as superadmin |
| `asUserWithCredentials(user, pass)` | Login as specific user |
| `asAnonymousUser()` | Logout to anonymous |
| `setChannelToken(token)` | Set channel for multi-channel tests |
| `queryStatus(doc, variables?)` | Get HTTP status code (for error testing) |
| `fileUploadMutation({ mutation, filePaths, mapVariables })` | Upload files via multipart |
| `fetch(url, options?)` | Raw HTTP fetch (includes auth headers) |

## ErrorResultGuard for Union Types

When a mutation returns a union type (`Success | ErrorResult`), use `createErrorResultGuard` to narrow the type and auto-fail on unexpected results:

```typescript
import { createErrorResultGuard, ErrorResultGuard } from "@deenruv/testing";

const orderGuard: ErrorResultGuard<OrderFragment> =
  createErrorResultGuard((input) => !!input.lines);

// In tests:
orderGuard.assertSuccess(result);   // narrows to success type, fails if error
orderGuard.assertErrorResult(result); // narrows to error type, fails if success
```

## Running Tests

```bash
# All tests from repo root
pnpm test

# E2E for a specific plugin
cd plugins/feature-plugin && pnpm e2e

# Watch mode
cd plugins/feature-plugin && pnpm e2e:watch

# Debug mode (30min timeout)
E2E_DEBUG=true pnpm e2e

# Specific database backend (default: sqljs)
DB=postgres pnpm e2e
```

## Debugging Tips

- **Timeout errors**: Set `E2E_DEBUG=true` for 30-minute timeouts
- **`Bindings not found`**: Run `pnpm rebuild @swc/core`
- **SQLjs data**: Check `__data__/` directory in plugin folder for cached DB files
- **Port conflicts**: `testConfig()` auto-assigns ports, but manual overrides can collide
- **Server logs**: Pass `logger: new DefaultLogger({ level: LogLevel.Info })` in mergeConfig

## Checklist

- [ ] Test file named `*.e2e-spec.ts` in `e2e/` directory
- [ ] `e2e` script added to plugin `package.json` using shared vitest config
- [ ] `createTestEnvironment` called at describe scope with `mergeConfig(testConfig(), ...)`
- [ ] Plugin added to config via `plugins: [FeaturePlugin.init({...})]`
- [ ] `server.init({ initialData })` called in `beforeAll` with `TEST_SETUP_TIMEOUT_MS`
- [ ] `adminClient.asSuperAdmin()` called after `server.init()`
- [ ] `server.destroy()` called in `afterAll`
- [ ] Tests are self-contained and order-independent
- [ ] GraphQL documents defined with `gql` from `graphql-tag`
- [ ] `pnpm e2e` passes from the plugin directory
