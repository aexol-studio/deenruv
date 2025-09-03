# Repository Guidelines

## Project Structure & Module Organization
- apps/: runnable apps. `apps/server` (Nest/GraphQL API) and `apps/panel` (React/Vite admin UI).
- packages/: shared libraries (e.g., `core`, `admin-dashboard`, `react-ui-devkit`, `testing`).
- plugins/: optional server/UI plugins (naming: `<feature>-plugin`).
- docs/: documentation source; scripts/: codegen, docs, and checks; e2e-common/: Vitest e2e config.

## Build, Test, and Development Commands
- Install: `pnpm i` (Node >= 18; pnpm workspace).
- Build all: `pnpm build` (per‑package builds).
- Start locally: `pnpm server-docker-up` → `pnpm server-populate` → `pnpm start`.
  - Separately: `pnpm start:server`, `pnpm start:admin-ui`.
- Lint: `pnpm lint` | Auto‑fix: `pnpm lint:fix`.
- Tests: `pnpm test` (Vitest across workspace).
- Codegen: `pnpm codegen` (GraphQL/TypeScript types).

## Coding Style & Naming Conventions
- Language: TypeScript (ESM). Prefer explicit types; avoid `any`.
- Linting: ESLint (typescript-eslint) with Prettier integration. Run `pnpm lint` before PRs.
- Formatting (panel): 2‑space indent, single quotes, semicolons, trailing commas.
- Imports: do not import `react-i18next` directly in admin UI; use `useTranslation` from `@deenruv/react-ui-devkit`.
- Files: test files end with `.spec.ts`; e2e with `.e2e-spec.ts`.

## Testing Guidelines
- Unit tests: colocated next to sources (`*.spec.ts`). Run with `pnpm test` or from a package directory.
- E2E tests: live in `e2e/` folders of packages/plugins (`*.e2e-spec.ts`), use `@deenruv/testing`. Shared config in `e2e-common/`.
- Coverage: keep meaningful assertions for new code; prefer fast, deterministic tests.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `chore:`). Changelog is generated from history.
- PRs must include: clear description, rationale, and scope; linked issue(s); screenshots/GIFs for admin UI changes; test updates; passing CI (`pnpm build`, `pnpm lint`, `pnpm test`).
- Keep PRs focused and small; note breaking changes under a “BREAKING CHANGE:” footer when applicable.

## Security & Configuration Tips
- Local services via `docker-compose.yml`: Postgres, Redis, MinIO. Use `pnpm server-docker-up`/`down` to manage.
- Development server config in `apps/server/dev-config.ts`. Avoid committing secrets; prefer env variables or Docker secrets.

