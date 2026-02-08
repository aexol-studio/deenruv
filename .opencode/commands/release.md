---
description: "Run full release flow: install, lint, test, build, version bump, changelog, commit, tag, push"
---

Execute the release flow for the Deenruv monorepo. Follow these steps **exactly in order**, stopping immediately on any failure.

**One optional argument:** the semver bump type — `major`, `minor`, or `patch`. Defaults to `patch` when omitted or when an unrecognized value is given.

The release summary is inferred automatically — do not prompt the user for notes.

## Argument handling

| Invocation | Resolved bump |
|---|---|
| `/release` | `patch` |
| `/release patch` | `patch` |
| `/release minor` | `minor` |
| `/release major` | `major` |
| `/release foo` | `patch` (invalid value → fallback) |

Normalize the argument to lowercase. If it is not one of `major`, `minor`, or `patch`, silently fall back to `patch`. Store the resolved value as **`{bumpType}`** and use it in the version-bump step below.

## Guardrails

- **Stop on first failure.** If any step exits non-zero, abort and report which step failed.
- **Never use `--legacy-peer-deps`.**
- **Require a clean git tree** before the version bump step — abort if there are uncommitted changes at that point.

## Changelog Contract

- The release **must** update the root `CHANGELOG.md` with entries generated from commits since the previous tag.
- The docs changelog page (`apps/docs/content/docs/guides/getting-started/changelog.mdx`) **must** be synced from the root changelog so the two stay identical.
- The release **MUST abort** if, after generation and sync, either file does not contain the `{nextVersion}` heading near the top. This is verified in Step 4e below.

## Pre-release: clean the working tree

Before starting the numbered steps, ensure the working tree is clean:

1. Check for uncommitted changes:
   ```bash
   git status --porcelain
   ```
2. If the output is **non-empty**, stage and commit everything:
   ```bash
   git add -A
   git commit -m "chore: prepare workspace before release"
   ```
3. If the output is **empty**, the tree is already clean — proceed directly.

## Pre-release stabilization: build & lint-fix loop

Before the numbered release steps, run a stabilization loop that ensures the codebase builds cleanly and passes lint. This catches generated-file drift and formatting issues that would dirty the tree later.

**Maximum attempts: 5.** If lint still fails after 5 iterations, abort the release with a clear error message listing the remaining lint violations.

**Lint errors are always blocking.** All lint violations — including pre-existing or unrelated errors — MUST be resolved before releasing. Never ignore, skip, or bypass lint failures.

1. **Build all packages:**
   ```bash
   pnpm run build:dev
   ```
   Stop on failure — a broken build must be fixed manually before releasing.

2. **Strict lint check:**
   ```bash
   pnpm run lint
   ```

3. **If lint passes** — stabilization is complete. Stage and commit any outstanding changes (build artifacts, generated files) if the tree is dirty:
   ```bash
   git add -A
   git commit -m "chore: stabilize build artifacts before release"
   ```
   Then proceed to the numbered steps below.

4. **If lint fails** — auto-fix, commit, and retry:
   ```bash
   pnpm run lint:fix
   git add -A
   git commit -m "chore: apply lint auto-fixes before release"
   ```
   Then go back to sub-step 2 (strict lint check). Each iteration consumes one attempt.

5. **If all 5 attempts are exhausted** — abort the release:
   > ❌ Release aborted: lint still failing after 5 auto-fix attempts. Fix remaining violations manually and re-run the release command.

## Steps

1. Install dependencies:
   ```bash
   pnpm i
   ```

2. Run tests:
   ```bash
   pnpm test
   ```

3. Verify clean git tree — run `git status --porcelain` and abort if there is any output.

4. **Pre-bump changelog update** — generate the changelog from commits **before** the version bump so the changelog entry captures work done since the last release.

   a. Resolve the previous tag and compute the next version:
      ```bash
      PREV_TAG=$(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)
      ```
      Read the current version from root `package.json`, then compute the next version by applying `{bumpType}` to it (e.g., `1.0.6` + `patch` → `1.0.7`). Store this as **`{nextVersion}`**.

   b. Run the changelog update script:
      ```bash
      pnpm changelog:update -- --next-version {nextVersion} --from-tag $PREV_TAG
      ```

   c. Sync changelog into docs:
      ```bash
      pnpm changelog:sync-docs
      ```

   d. Stage the changelog and docs files:
       ```bash
        git add CHANGELOG.md apps/docs/content/docs/guides/getting-started/changelog.mdx apps/docs/content/docs/guides/getting-started/changelog.pl.mdx
       ```

   e. **Verify changelog contains the new version** (see *Changelog Contract*). Run:
       ```bash
       head -n 30 CHANGELOG.md
       head -n 40 apps/docs/content/docs/guides/getting-started/changelog.mdx
       rg -n "^## <small>{nextVersion} \(" CHANGELOG.md
       rg -n "^## <small>{nextVersion} \(" apps/docs/content/docs/guides/getting-started/changelog.mdx
       ```
       Both `rg` commands must produce at least one match. If either returns no match, **abort the release immediately** with:
       > ❌ Release aborted: `{nextVersion}` heading not found in CHANGELOG.md and/or docs changelog after generation. Fix the changelog scripts and re-run.

5. Bump version across all workspace packages using the resolved bump type:
   ```bash
   pnpm -r exec pnpm version {bumpType}
   ```
   `{bumpType}` is resolved from the optional argument (default `patch`) — see **Argument handling** above.

6. Read the new version from the root `package.json` `"version"` field (should match `{nextVersion}` from step 4).

7. Generate legacy changelog (kept for compatibility):
   ```bash
   pnpm generate-changelog
   ```

8. Stage changelog and version files:
   ```bash
   git add -A
   ```

9. **Infer a release summary** before committing. Run:
   ```bash
   git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --oneline
   ```
   Use the output, the list of changed files (`git diff --stat HEAD~1`), and the generated changelog to write a concise bullet-point summary of what changed in this release (e.g., key dependency upgrades, new features, notable fixes). Do **not** prompt the user for this — infer it yourself.

10. Commit all changes with a rich message. **Execute** the following `git commit` command (substitute `{version}` and `{auto-inferred bullet points}` with real values from steps 6 and 9):

    ```bash
    git commit \
      -m "chore(release): v{version}" \
      -m "- bump workspace versions to {version}" \
      -m "- refresh changelog for {version}" \
      -m "- tag release v{version}" \
      -m "Summary:" \
      -m "{auto-inferred bullet point 1}" \
      -m "{auto-inferred bullet point 2}" \
      -m "{...more bullets as needed}"
    ```

    Each `-m` flag appends a paragraph to the commit body. Replace the `{auto-inferred bullet point …}` placeholders with the actual summary bullets inferred in step 9 (one `-m` per bullet).

11. Push the commit:
    ```bash
    git push
    ```

12. Create and push the tag:
    ```bash
    git tag v{version}
    git push origin v{version}
    ```

Report each step's result as you go. On success, print the final version, tag name, and the auto-inferred release summary.
