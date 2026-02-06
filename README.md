# Deenruv

> Open-source headless commerce framework built with TypeScript, NestJS, and GraphQL.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Deenruv is a modern, headless e-commerce framework forked from Vendure. It provides a flexible, extensible platform for building custom e-commerce solutions with a plugin-based architecture.

## Features

- 🛒 Complete e-commerce backend (products, orders, customers, payments, shipping)
- 🔌 Plugin architecture for extending functionality
- 🎨 Modern React-based admin panel with plugin UI system
- 📊 GraphQL API (Shop + Admin)
- 🌐 Multi-channel and multi-language support
- 🔐 Role-based access control
- 📧 Event-driven email system

## Project Structure

```
deenruv/
├── apps/
│   ├── server/          # NestJS GraphQL API server
│   ├── panel/           # React/Vite admin UI
│   └── docs/            # Documentation (Next.js + Fumadocs)
├── packages/
│   ├── core/            # Core framework
│   ├── common/          # Shared types and utilities
│   ├── admin-dashboard/ # Admin panel shell
│   ├── react-ui-devkit/ # UI SDK for building admin plugins
│   ├── admin-types/     # Shared GraphQL/TypeScript types
│   ├── cli/             # CLI tools
│   └── ...
├── plugins/             # Official plugins (32+)
├── e2e-common/          # Shared config for package e2e tests
├── scripts/             # Codegen, docs, and checks
└── docs/                # Additional documentation
```

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm (workspace-enabled)
- Docker & Docker Compose

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Infrastructure

```bash
pnpm server-docker-up
```

This starts:
- **PostgreSQL** (port 5432) — user: `deenruv`, password: `deenruv`, db: `deenruv`
- **Redis** (port 6379) — no password
- **MinIO** (port 9000, console 9090) — user: `root`, password: `password`

### 3. Build the Project

```bash
pnpm build
```

### 4. Populate Database

```bash
pnpm server-populate
```

### 5. Start Development

```bash
pnpm start
```

This starts both the server and admin panel:
- **API Server**: http://localhost:3000/admin-api (GraphQL Playground)
- **Shop API**: http://localhost:3000/shop-api
- **Admin Panel (React)**: http://localhost:3001/admin-ui/
- **Admin Panel (Legacy)**: http://localhost:3000/admin/
- **Default credentials**: `superadmin` / `superadmin`

### Development Commands

| Command | Description |
|---------|-------------|
| `pnpm start` | Start server + admin panel |
| `pnpm start:server` | Start only the API server |
| `pnpm start:admin-ui` | Start only the React admin panel |
| `pnpm watch` | Watch mode for react-ui-devkit + admin-dashboard |
| `pnpm build` | Build all packages (sequential) |
| `pnpm build:dev` | Build all packages (parallel) |
| `pnpm test` | Run all tests (Vitest) |
| `pnpm lint` | Lint all packages |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm codegen` | Generate GraphQL/TypeScript types |
| `pnpm docs:dev` | Start docs dev server |
| `pnpm server-docker-up` | Start Docker services |
| `pnpm server-docker-down` | Stop Docker services |

## Creating Plugins

Deenruv uses a plugin architecture. Each plugin can extend both the server and admin UI:

```
plugins/my-plugin/
├── src/
│   ├── plugin-server/    # Server-side logic
│   │   ├── index.ts      # Plugin definition (DeenruvPlugin)
│   │   ├── types.ts      # Configuration types
│   │   ├── services/     # NestJS services
│   │   ├── controllers/  # REST controllers
│   │   ├── handlers/     # Payment/shipping handlers
│   │   └── extensions/   # GraphQL schema extensions
│   └── plugin-ui/        # Admin UI extensions
│       ├── index.ts      # UI plugin (createDeenruvUIPlugin)
│       ├── components/   # React components
│       └── locales/      # i18n translations
├── package.json
└── README.md
```

See [`@deenruv/react-ui-devkit`](packages/react-ui-devkit/README.md) for the full UI SDK documentation.

## Official Plugins

| Plugin | Description |
|--------|-------------|
| [payments-plugin](plugins/payments-plugin/) | Mollie & Stripe payment integrations |
| [email-plugin](plugins/email-plugin/) | Event-driven email system |
| [asset-server-plugin](plugins/asset-server-plugin/) | Local file serving + image transforms |
| [elasticsearch-plugin](plugins/elasticsearch-plugin/) | Elasticsearch product search |
| [job-queue-plugin](plugins/job-queue-plugin/) | Background job processing (BullMQ/PubSub) |
| [przelewy24-plugin](plugins/przelewy24-plugin/) | Przelewy24 + BLIK payments |
| [reviews-plugin](plugins/reviews-plugin/) | Product reviews system |
| [seo-plugin](plugins/seo-plugin/) | SEO metadata management |
| [dashboard-widgets-plugin](plugins/dashboard-widgets-plugin/) | Admin dashboard widgets |
| [inpost-plugin](plugins/inpost-plugin/) | InPost shipping integration |
| [cronjobs-plugin](plugins/cronjobs-plugin/) | Scheduled cron jobs |
| [harden-plugin](plugins/harden-plugin/) | Security hardening |
| [merchant-plugin](plugins/merchant-plugin/) | Multi-merchant support |
| [newsletter-plugin](plugins/newsletter-plugin/) | Newsletter subscriptions |
| [sentry-plugin](plugins/sentry-plugin/) | Sentry error tracking |
| And [17 more...](plugins/) | |

## Testing

### Unit Tests

Unit tests are co-located with source files using the `.spec.ts` suffix. Run all tests from the root:

```bash
pnpm test
```

Or run tests for a specific package from its directory.

> **Tip:** If you get `Error: Bindings not found.`, run `pnpm rebuild @swc/core`.

### End-to-End Tests

E2E tests live in `e2e/` folders within packages and plugins (`*.e2e-spec.ts`) and use `@deenruv/testing`. Shared configuration is in `e2e-common/`.

When **debugging e2e tests**, set `E2E_DEBUG=true` to increase timeouts.

## Code Generation

[graphql-code-generator](https://github.com/dotansimha/graphql-code-generator) is used to create TypeScript types from GraphQL schemas:

```bash
pnpm codegen
```

This generates:
- [`packages/common/src/generated-types.ts`](./packages/common/src/generated-types.ts) — Admin API types
- [`packages/common/src/generated-shop-types.ts`](./packages/common/src/generated-shop-types.ts) — Shop API types
- E2E test types for packages with e2e tests

## Contributing

Please read our [PR template](.github/PULL_REQUEST_TEMPLATE.md) before submitting a pull request.

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new payment provider
fix: resolve order calculation bug
docs: update plugin documentation
chore: update dependencies
```

### Branches

- `main` — The latest stable release
- `develop` — Testing ground for finished features/bugfixes before merging to main

## Documentation

- [Online Docs](https://deenruv.com/docs)
- [Admin UI SDK](packages/react-ui-devkit/README.md)
- [Plugin Development Guide](apps/docs/content/docs/guides/developer-guide/plugins.mdx)
- [Demo Admin Panel](https://deenruv.com/admin-ui)
- [Demo Storefront](https://deenruv.com/storefront)

## Attribution

Deenruv is derived from [Vendure](https://github.com/vendure-ecommerce/vendure),
an open-source headless commerce framework created by
[Michael Bromley](https://github.com/michaelbromley) and licensed under the
MIT License. The original project was forked in 2025 and has since undergone
significant modifications. We gratefully acknowledge the foundational work of
the Vendure project and its contributors.

## License

MIT — see [LICENSE](LICENSE) file.
