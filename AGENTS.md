# Repository Guidelines

> Deenruv — Open-source headless commerce framework built with TypeScript, NestJS, and GraphQL (forked from Vendure).

## Project Structure & Module Organization

```
deenruv/
├── apps/
│   ├── server/              # NestJS GraphQL API server (admin-api + shop-api)
│   ├── panel/               # React/Vite admin UI (Tailwind CSS, Zustand, React Router)
│   └── docs/                # Documentation site (Next.js + Fumadocs)
├── packages/
│   ├── core/                # Core framework (NestJS modules, entities, services)
│   ├── common/              # Shared types, utilities, generated GraphQL types
│   ├── admin-dashboard/     # Admin panel shell (layout, routing, providers)
│   ├── react-ui-devkit/     # UI SDK for building admin plugin UIs
│   ├── admin-types/         # Shared GraphQL/TypeScript types for admin
│   ├── admin-ui/            # Legacy Angular admin UI
│   ├── admin-ui-plugin/     # Plugin to serve legacy admin UI
│   ├── cli/                 # CLI tools
│   ├── create/              # Project scaffolding (`create-deenruv`)
│   ├── testing/             # E2E test utilities and helpers
│   ├── inpost/              # InPost API client library
│   ├── ui-devkit/           # Legacy Angular UI devkit
│   └── ts-node-register/    # TS-Node registration helper
├── plugins/                 # Official plugins (32+), naming: <feature>-plugin
├── e2e-common/              # Shared Vitest E2E config, test data, reporters
├── scripts/                 # Codegen, docs generation, import checks
│   ├── codegen/             # GraphQL type generation
│   ├── docs/                # TypeScript & GraphQL docs generation
│   └── changelogs/          # Changelog generation
└── docs/                    # Additional documentation files
```

### Naming Conventions

- **Plugins**: Always `<feature>-plugin` (e.g., `payments-plugin`, `seo-plugin`, `cronjobs-plugin`).
- **Packages**: Use the `@deenruv/` scope (e.g., `@deenruv/core`, `@deenruv/react-ui-devkit`).
- **Package names in `package.json`** may differ from directory names; always check.

### Plugin Architecture

Each plugin can extend both the server and the React admin UI:

```
plugins/<feature>-plugin/
├── src/
│   ├── plugin-server/       # Server-side logic
│   │   ├── index.ts         # Plugin definition (DeenruvPlugin)
│   │   ├── types.ts         # Configuration types
│   │   ├── services/        # NestJS services
│   │   ├── controllers/     # REST controllers
│   │   ├── handlers/        # Payment/shipping handlers
│   │   └── extensions/      # GraphQL schema extensions
│   └── plugin-ui/           # Admin UI extensions
│       ├── index.ts         # UI plugin (createDeenruvUIPlugin)
│       ├── components/      # React components
│       └── locales/         # i18n translations (JSON)
├── e2e/                     # E2E tests (*.e2e-spec.ts)
├── package.json
└── README.md
```

### Official Plugins (32)

| Plugin | Description |
|--------|-------------|
| `payments-plugin` | Mollie & Stripe payment integrations |
| `email-plugin` | Event-driven email system |
| `asset-server-plugin` | Local file serving + image transforms (S3/MinIO) |
| `elasticsearch-plugin` | Elasticsearch product search |
| `job-queue-plugin` | Background job processing (BullMQ/PubSub) |
| `przelewy24-plugin` | Przelewy24 + BLIK payments |
| `reviews-plugin` | Product reviews system |
| `seo-plugin` | SEO metadata management |
| `dashboard-widgets-plugin` | Admin dashboard widgets |
| `inpost-plugin` | InPost shipping integration |
| `cronjobs-plugin` | Scheduled cron jobs |
| `harden-plugin` | Security hardening |
| `merchant-plugin` | Multi-merchant product feeds (Google/Facebook) |
| `newsletter-plugin` | Newsletter subscriptions |
| `sentry-plugin` | Sentry error tracking |
| `stellate-plugin` | Stellate CDN/caching |
| `replicate-plugin` | Replicate AI integration |
| `replicate-simple-bg-plugin` | Simple background removal via Replicate |
| `redis-strategy-plugin` | Redis-based cache/session strategy |
| `wfirma-plugin` | wFirma invoicing integration |
| `upsell-plugin` | Upsell/cross-sell product suggestions |
| `order-reminder-plugin` | Order reminder notifications |
| `order-attributes-plugin` | Custom order attributes |
| `product-badges-plugin` | Product badge labels |
| `product-options-fields-plugin` | Extended product option fields |
| `method-modal-plugin` | Payment/shipping method selection modals |
| `facet-harmonica-plugin` | Facet filtering UI (harmonica style) |
| `copy-order-plugin` | Duplicate/copy existing orders |
| `in-realization-plugin` | Order realization tracking |
| `phone-number-validation` | Phone number validation |
| `apollo-cache` | Apollo server caching utilities |
| `deenruv-examples-plugin` | Example/demo plugin for development |

## Build, Test, and Development Commands

### Prerequisites

- **Node.js** >= 18
- **pnpm** (workspace-enabled, version 10.7.0+)
- **Docker** & Docker Compose

### First-Time Setup

```bash
pnpm install                  # Install all dependencies
pnpm server-docker-up         # Start Postgres, Redis, MinIO
pnpm build                    # Build all packages (sequential, respects deps)
pnpm server-populate          # Seed database with sample data
pnpm start                    # Start server + admin panel
```

### All Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all workspace dependencies |
| `pnpm build` | Build all packages sequentially (respects dependency order) |
| `pnpm build:dev` | Build all packages in parallel (faster, for dev) |
| `pnpm start` | Start server + admin panel concurrently |
| `pnpm start:server` | Start only the NestJS API server |
| `pnpm start:admin-ui` | Start only the React admin panel (Vite dev server) |
| `pnpm watch` | Watch mode for `react-ui-devkit` + `admin-dashboard` |
| `pnpm test` | Run all tests (Vitest, sequential across workspace) |
| `pnpm lint` | Lint all packages |
| `pnpm lint:fix` | Auto-fix lint issues across all packages |
| `pnpm codegen` | Generate GraphQL/TypeScript types from schemas |
| `pnpm docs:dev` | Start documentation dev server (Next.js, port 3001) |
| `pnpm docs:build` | Generate docs + build documentation site |
| `pnpm docs:codegen` | Generate TypeScript + GraphQL documentation |
| `pnpm server-docker-up` | Start Docker services (Postgres, Redis, MinIO) |
| `pnpm server-docker-down` | Stop Docker services and remove volumes |
| `pnpm server-populate` | Seed database with development data |
| `pnpm clean` | Remove all `node_modules` and `dist` directories |
| `pnpm check-imports` | Validate import paths across packages |
| `pnpm check-core-type-defs` | Validate core type definitions |
| `pnpm translate` | Run dev-translate for i18n |

### Server-Specific Commands (from `apps/server/`)

| Command | Description |
|---------|-------------|
| `pnpm run start` | Start server + worker concurrently |
| `pnpm run populate` | Seed the database |
| `pnpm run migration:generate` | Generate a new TypeORM migration |
| `pnpm run migration:run` | Run pending migrations |
| `pnpm run migration:revert` | Revert the last migration |
| `pnpm run load-test:1k` | Run load test with 1,000 items |
| `pnpm run load-test:10k` | Run load test with 10,000 items |

### Panel-Specific Commands (from `apps/panel/`)

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start Vite dev server |
| `pnpm run build` | TypeScript check + Vite production build |
| `pnpm run zeus:local` | Generate Zeus GraphQL client from local API |
| `pnpm run toc` | Generate i18n resource type-of-content |
| `pnpm run interface` | Generate i18n resource interface types |

### Development URLs

| Service | URL |
|---------|-----|
| Admin GraphQL API | http://localhost:3000/admin-api |
| Shop GraphQL API | http://localhost:3000/shop-api |
| React Admin Panel | http://localhost:3001/admin-ui/ |
| Legacy Admin Panel | http://localhost:3000/admin/ |
| Docs Dev Server | http://localhost:3001 |
| MinIO Console | http://localhost:9090 |

**Default credentials**: `superadmin` / `superadmin`

## Coding Style & Naming Conventions

### Language & Module System

- **TypeScript** throughout (ESM modules). The root `package.json` has `"type": "module"`.
- Prefer **explicit types**; avoid `any`. Use `unknown` + type guards when type is uncertain.
- TypeScript version: **5.3.3** (pinned in root).

### Linting & Formatting

- **ESLint** with `typescript-eslint` and **Prettier** integration.
- Run `pnpm lint` before every PR. Auto-fix with `pnpm lint:fix`.
- Prettier plugins: `prettier-plugin-tailwindcss` (for panel).
- ESLint plugins: `eslint-plugin-import`, `eslint-plugin-jsdoc`, `eslint-plugin-prefer-arrow`, `eslint-plugin-tailwindcss`.

### Formatting Rules (Panel/React)

- **2-space indent**
- **Single quotes**
- **Semicolons**: yes
- **Trailing commas**: yes

### Import Rules

- **Never** import `react-i18next` directly in admin UI code. Use `useTranslation` from `@deenruv/react-ui-devkit`.
- Use workspace protocol references: `"@deenruv/core": "workspace:*"` or `"workspace:^"`.
- Avoid circular dependencies between packages.

### File Naming

- Test files: `*.spec.ts` (unit tests, colocated with source).
- E2E test files: `*.e2e-spec.ts` (in `e2e/` directories).
- React components: PascalCase filenames (e.g., `OrderDetail.tsx`).
- Server modules: kebab-case (e.g., `order-line.service.ts`).

### Key Libraries by Area

| Area | Libraries |
|------|-----------|
| **Server** | NestJS, TypeORM, GraphQL (Apollo Server), BullMQ |
| **Panel** | React 18, Vite, Tailwind CSS, Zustand, React Router, React Hook Form, Zod/Yup, Recharts, Framer Motion, Lucide icons |
| **Docs** | Next.js 16, Fumadocs, React 19 |
| **Testing** | Vitest, `@deenruv/testing` |
| **Codegen** | graphql-code-generator, graphql-zeus |

## Code Generation

GraphQL Code Generator creates TypeScript types from the GraphQL schemas:

```bash
pnpm codegen
```

This generates:
- `packages/common/src/generated-types.ts` — Admin API types
- `packages/common/src/generated-shop-types.ts` — Shop API types
- E2E test types for packages with e2e tests

Always run `pnpm codegen` after modifying GraphQL schemas or adding new API fields.

## Testing Guidelines

### Unit Tests

- **Colocated** with source files using the `.spec.ts` suffix.
- Run all tests: `pnpm test` (from root, sequential across workspace).
- Run tests for a specific package: `cd packages/<name> && pnpm test`.
- Framework: **Vitest**.
- Keep assertions meaningful; prefer fast, deterministic tests.

> **Tip:** If you get `Error: Bindings not found.`, run `pnpm rebuild @swc/core`.

### End-to-End Tests

- Live in `e2e/` folders within packages and plugins.
- File suffix: `*.e2e-spec.ts`.
- Use `@deenruv/testing` utilities for server bootstrapping, fixtures, and assertions.
- Shared configuration in `e2e-common/`:
  - `vitest.config.mts` — Vitest E2E config
  - `vitest.config.bench.ts` — Benchmark config
  - `test-config.ts` — Shared server test configuration
  - `e2e-initial-data.ts` — Seed data for E2E tests
  - `tsconfig.e2e.json` — TypeScript config for E2E
  - `custom-reporter.js` — Custom Vitest reporter

> **Debug tip:** Set `E2E_DEBUG=true` environment variable to increase timeouts when debugging E2E tests.

### Test Conventions

- Write tests for all new features and bug fixes.
- Test file must be adjacent to the source file it tests.
- E2E tests should be self-contained: set up and tear down their own data.
- Do not rely on test execution order.

## Commit & Pull Request Guidelines

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new payment provider
fix: resolve order calculation bug
docs: update plugin documentation
chore: update dependencies
refactor: simplify tax calculation logic
test: add e2e tests for shipping module
```

Changelog is auto-generated from commit history.

### Branch Strategy

- `main` — Latest stable release.
- `develop` — Testing ground for features/bugfixes before merging to `main`.

### Pull Request Checklist

PRs must include:
- Clear **description**, **rationale**, and **scope**.
- Linked **issue(s)** when applicable.
- **Screenshots/GIFs** for admin UI changes.
- **Test updates** for new features or bug fixes.
- **Passing CI**: `pnpm build`, `pnpm lint`, `pnpm test` must all pass.
- Keep PRs **focused and small**; one logical change per PR.
- Note breaking changes under a `BREAKING CHANGE:` footer when applicable.

## Security & Configuration

### Docker Services (Local Development)

Managed via `docker-compose.yml`. Start with `pnpm server-docker-up`, stop with `pnpm server-docker-down`.

| Service | Port(s) | Credentials |
|---------|---------|-------------|
| **PostgreSQL** 16.3 | 5432 | user: `deenruv`, password: `deenruv`, db: `deenruv` |
| **Redis** 7.2 | 6379 | No password (local only) |
| **MinIO** (S3-compatible) | 9000 (API), 9090 (console) | user: `root`, password: `password` |

### Server Configuration

- Development config: `apps/server/dev-config.ts` (contains `DeenruvConfig`).
- Environment variables override defaults:
  - `APP_ENV` — Set to `LOCAL` for development.
  - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_SCHEMA` — Database connection.
  - `SUPERADMIN_IDENTIFIER`, `SUPERADMIN_PASSWORD` — Admin credentials.
  - `REDIS_PASSWORD` — Redis password (non-local environments).

### Security Rules

- **Never** commit secrets, API keys, or passwords to the repository.
- Use environment variables or Docker secrets for sensitive configuration.
- The `harden-plugin` provides security hardening for production deployments.
