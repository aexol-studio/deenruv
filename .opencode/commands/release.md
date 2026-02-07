---
description: "Run full release flow: install, lint, test, build, version bump, changelog, commit, tag, push"
---

Execute the release flow for the Deenruv monorepo. Follow these steps **exactly in order**, stopping immediately on any failure.

**No arguments needed.** The release summary is inferred automatically — do not prompt the user for notes.

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

## Steps

1. Install dependencies:
   ```bash
   pnpm i
   ```

2. Lint and auto-fix:
   ```bash
   pnpm run lint:fix
   ```

3. Run tests:
   ```bash
   pnpm test
   ```

4. Build all packages:
   ```bash
   pnpm run build:dev
   ```

5. Verify clean git tree — run `git status --porcelain` and abort if there is any output.

6. Bump patch version across all workspace packages:
   ```bash
   pnpm -r exec pnpm version patch
   ```

7. Read the new version from the root `package.json` `"version"` field.

8. Generate changelog:
   ```bash
   pnpm generate-changelog
   ```

9. Stage changelog and version files:
   ```bash
   git add -A
   ```

10. **Infer a release summary** before committing. Run:
    ```bash
    git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --oneline
    ```
    Use the output, the list of changed files (`git diff --stat HEAD~1`), and the generated changelog to write a concise bullet-point summary of what changed in this release (e.g., key dependency upgrades, new features, notable fixes). Do **not** prompt the user for this — infer it yourself.

11. Commit all changes with a rich message. **Execute** the following `git commit` command (substitute `{version}` and `{auto-inferred bullet points}` with real values from steps 7 and 10):

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

    Each `-m` flag appends a paragraph to the commit body. Replace the `{auto-inferred bullet point …}` placeholders with the actual summary bullets inferred in step 10 (one `-m` per bullet).

12. Push the commit:
    ```bash
    git push
    ```

13. Create and push the tag:
    ```bash
    git tag v{version}
    git push origin v{version}
    ```

Report each step's result as you go. On success, print the final version, tag name, and the auto-inferred release summary.
