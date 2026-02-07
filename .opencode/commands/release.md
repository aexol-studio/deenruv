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

4. Bump version across all workspace packages using the resolved bump type:
   ```bash
   pnpm -r exec pnpm version {bumpType}
   ```
   `{bumpType}` is resolved from the optional argument (default `patch`) — see **Argument handling** above.

5. Read the new version from the root `package.json` `"version"` field.

6. Generate changelog:
   ```bash
   pnpm generate-changelog
   ```

7. Stage changelog and version files:
   ```bash
   git add -A
   ```

8. **Infer a release summary** before committing. Run:
   ```bash
   git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --oneline
   ```
   Use the output, the list of changed files (`git diff --stat HEAD~1`), and the generated changelog to write a concise bullet-point summary of what changed in this release (e.g., key dependency upgrades, new features, notable fixes). Do **not** prompt the user for this — infer it yourself.

9. Commit all changes with a rich message. **Execute** the following `git commit` command (substitute `{version}` and `{auto-inferred bullet points}` with real values from steps 5 and 8):

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

   Each `-m` flag appends a paragraph to the commit body. Replace the `{auto-inferred bullet point …}` placeholders with the actual summary bullets inferred in step 8 (one `-m` per bullet).

10. Push the commit:
    ```bash
    git push
    ```

11. Create and push the tag:
    ```bash
    git tag v{version}
    git push origin v{version}
    ```

Report each step's result as you go. On success, print the final version, tag name, and the auto-inferred release summary.
