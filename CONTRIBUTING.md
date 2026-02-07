# Contributing to Deenruv

## Prerequisites

- Node.js >= 18
- pnpm 10.7.0+
- Docker & Docker Compose

## Installing Dependencies

```bash
pnpm install
```

**Strict rule:** never use `--legacy-peer-deps`. All dependency conflicts must be resolved properly.

## Release Flow

### 1. Prepare

Start from a **clean git working tree** (no uncommitted changes).

Run the following pre-steps to ensure everything is in order:

```bash
pnpm i
pnpm run lint:fix
pnpm test
pnpm run build:dev
```

### 2. Bump Version & Changelog

```bash
pnpm -r exec pnpm version patch
pnpm generate-changelog
git add -A
```

### 3. Commit, Tag & Push

Use the `chore(release)` commit convention with a descriptive body:

```bash
git commit -m "chore(release): v{version}" -m "- bump workspace versions to {version}
- refresh changelog for {version}
- tag release v{version}"
git push
git tag v{version}
git push origin v{version}
```

Replace `{version}` with the actual version number (e.g., `2.1.3`).

**Strict rule:** never use `--legacy-peer-deps` during any release step.

## OpenCode `/release` Command

If you use [OpenCode](https://opencode.ai), you can run the entire release flow with a single command:

```
/release
```

No arguments needed — the command auto-infers a release summary from recent commits, changed files, and the generated changelog entry, then embeds it in the commit body.

This executes: `pnpm i` → `lint:fix` → `test` → `build:dev` → version bump → `generate-changelog` → commit → tag → push.

**Requirements:**
- Clean git working tree (no uncommitted changes before version bump).
- Never uses `--legacy-peer-deps`.
- Stops on the first failing step and reports which step failed.
