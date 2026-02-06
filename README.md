<p align="center">
  <h1 align="center">Deenruv</h1>
  <p align="center">
    <strong>The headless commerce framework that gets out of your way.</strong>
  </p>
  <p align="center">
    TypeScript &bull; NestJS &bull; GraphQL &bull; React Admin &bull; 32+ Plugins
  </p>
  <p align="center">
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
    <a href="https://deenruv.com/docs"><img src="https://img.shields.io/badge/docs-deenruv.com-blue" alt="Documentation" /></a>
    <a href="https://deenruv.com/admin-ui"><img src="https://img.shields.io/badge/demo-admin%20panel-green" alt="Demo" /></a>
  </p>
</p>

---

Most commerce platforms force you into their way of doing things. Deenruv doesn't. It gives you a production-ready e-commerce backend with a GraphQL API, a modern React admin panel, and a plugin system that lets you extend *everything* — without fighting the framework.

Built on NestJS and TypeORM, battle-tested in production, and fully open-source.

## Why Deenruv?

- **GraphQL-first** — Shop API + Admin API, fully typed, ready for any frontend
- **Plugin architecture** — 32+ official plugins, or build your own in minutes
- **Modern admin panel** — React, Tailwind CSS, extensible via plugins with a full UI SDK
- **Multi-channel & multi-language** — sell everywhere, in every language
- **Production-ready** — role-based access control, job queues, event-driven emails, asset management
- **TypeScript end-to-end** — from database entities to admin UI components

## Get Running in 5 Minutes

```bash
# Prerequisites: Node.js >= 18, pnpm, Docker

pnpm install              # Install dependencies
pnpm server-docker-up     # Start Postgres, Redis, MinIO
pnpm build                # Build all packages
pnpm server-populate      # Seed with sample data
pnpm start                # Launch server + admin panel
```

Then open:
| | |
|---|---|
| Admin Panel | [localhost:3001/admin-ui](http://localhost:3001/admin-ui/) |
| Admin GraphQL API | [localhost:3000/admin-api](http://localhost:3000/admin-api) |
| Shop GraphQL API | [localhost:3000/shop-api](http://localhost:3000/shop-api) |
| **Login** | `superadmin` / `superadmin` |

## Plugin Ecosystem

Every feature is a plugin. Use the official ones, or create your own:

| Plugin | What it does |
|--------|-------------|
| [payments](plugins/payments-plugin/) | Stripe, Mollie, Przelewy24 + BLIK |
| [email](plugins/email-plugin/) | Event-driven transactional emails |
| [asset-server](plugins/asset-server-plugin/) | File uploads, image transforms, S3/MinIO |
| [elasticsearch](plugins/elasticsearch-plugin/) | Full-text product search |
| [job-queue](plugins/job-queue-plugin/) | Background jobs with BullMQ/PubSub |
| [reviews](plugins/reviews-plugin/) | Product reviews and ratings |
| [seo](plugins/seo-plugin/) | SEO metadata management |
| [inpost](plugins/inpost-plugin/) | InPost shipping integration |
| [cronjobs](plugins/cronjobs-plugin/) | Scheduled tasks |
| [harden](plugins/harden-plugin/) | Security hardening for production |
| [sentry](plugins/sentry-plugin/) | Error tracking |
| [merchant](plugins/merchant-plugin/) | Multi-merchant product feeds (Google/Facebook) |
| [dashboard-widgets](plugins/dashboard-widgets-plugin/) | Custom admin dashboard widgets |
| [newsletter](plugins/newsletter-plugin/) | Newsletter subscriptions |
| [upsell](plugins/upsell-plugin/) | Cross-sell and upsell suggestions |
| ...and [17 more](plugins/) | |

### Build Your Own Plugin

Each plugin can extend both the server and the admin UI:

```
plugins/my-plugin/
├── src/
│   ├── plugin-server/       # NestJS services, controllers, GraphQL extensions
│   └── plugin-ui/           # React components, i18n, admin pages
├── e2e/                     # End-to-end tests
└── package.json
```

See the [Plugin Development Guide](apps/docs/content/docs/guides/developer-guide/plugins.mdx) and the [UI SDK docs](packages/react-ui-devkit/README.md) for details.

## Project Structure

```
deenruv/
├── apps/
│   ├── server/              # NestJS GraphQL API server
│   ├── panel/               # React/Vite admin UI (Tailwind, Zustand)
│   └── docs/                # Docs site (Next.js + Fumadocs)
├── packages/
│   ├── core/                # Core framework (entities, services, modules)
│   ├── common/              # Shared types & generated GraphQL types
│   ├── react-ui-devkit/     # UI SDK for building admin plugin UIs
│   ├── testing/             # E2E test utilities
│   └── ...                  # admin-dashboard, admin-types, cli, etc.
├── plugins/                 # 32+ official plugins
└── e2e-common/              # Shared E2E test config and fixtures
```

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm start` | Start server + admin panel |
| `pnpm start:server` | Start only the API server |
| `pnpm start:admin-ui` | Start only the React admin panel |
| `pnpm watch` | Watch mode for UI packages |
| `pnpm build` | Build all packages (sequential, respects deps) |
| `pnpm test` | Run all tests (Vitest) |
| `pnpm lint` | Lint everything |
| `pnpm codegen` | Generate GraphQL/TypeScript types |
| `pnpm server-docker-up` | Start Postgres, Redis, MinIO |
| `pnpm server-docker-down` | Stop Docker services |

## Testing

**Unit tests** are colocated with source files (`*.spec.ts`). Run them with `pnpm test`.

**E2E tests** live in `e2e/` directories (`*.e2e-spec.ts`) and use `@deenruv/testing`. Set `E2E_DEBUG=true` for extended timeouts when debugging.

## Contributing

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new payment provider
fix: resolve order calculation bug
docs: update plugin documentation
```

See our [PR template](.github/PULL_REQUEST_TEMPLATE.md) for guidelines. PRs go to the `develop` branch.

## Documentation

- [Full Documentation](https://deenruv.com/docs)
- [Live Admin Panel Demo](https://deenruv.com/admin-ui)
- [Live Storefront Demo](https://deenruv.com/storefront)
- [Admin UI SDK Reference](packages/react-ui-devkit/README.md)
- [Plugin Development Guide](apps/docs/content/docs/guides/developer-guide/plugins.mdx)

## Attribution

Deenruv is derived from [Vendure](https://github.com/vendure-ecommerce/vendure), created by [Michael Bromley](https://github.com/michaelbromley) and licensed under MIT. Forked in 2025, it has since undergone significant development. We gratefully acknowledge the foundational work of the Vendure project and its contributors.

## License

MIT — see [LICENSE](LICENSE).
