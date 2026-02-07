---
description: "Run commit flow: install, build, lint, test, stage, and commit with auto-inferred message"
---

Execute the commit flow for the Deenruv monorepo. Follow these steps **exactly in order**, stopping immediately on any failure.

**No arguments needed.** The commit summary is inferred automatically — do not prompt the user for notes.

## Guardrails

- **Stop on first failure.** If any step exits non-zero, abort and report which step failed.
- **Never use `--legacy-peer-deps`.**
- **No version bump, changelog generation, tag creation, or push.** This is a commit-only workflow.

## Pre-commit stabilization: build & lint-fix loop

Before the numbered commit steps, run a stabilization loop that ensures the codebase builds cleanly and passes lint. This catches generated-file drift and formatting issues before committing.

**Maximum attempts: 5.** If lint still fails after 5 iterations, abort with a clear error message listing the remaining lint violations.

1. **Build all packages:**
   ```bash
   pnpm run build:dev
   ```
   Stop on failure — a broken build must be fixed manually before committing.

2. **Strict lint check:**
   ```bash
   pnpm run lint
   ```

3. **If lint passes** — stabilization is complete. Proceed to the numbered steps below.

4. **If lint fails** — auto-fix and retry:
   ```bash
   pnpm run lint:fix
   ```
   Then go back to sub-step 2 (strict lint check). Each iteration consumes one attempt.

5. **If all 5 attempts are exhausted** — abort:
   > ❌ Commit aborted: lint still failing after 5 auto-fix attempts. Fix remaining violations manually and re-run the commit command.

## Steps

1. Install dependencies:
   ```bash
   pnpm i
   ```

2. Run tests:
   ```bash
   pnpm test
   ```

3. Stage all changes:
   ```bash
   git add -A
   ```

4. Check for staged changes:
   ```bash
   git diff --cached --quiet
   ```
   If the exit code is **0** (nothing staged / no changes), abort:
   > ℹ️ Nothing to commit — working tree is clean.

5. **Infer a commit summary** from the staged diff. Run:
   ```bash
   git diff --cached --stat
   git diff --cached --no-color
   git log -5 --oneline
   ```
   Analyze the staged changes and recent commit history. Determine:
   - A concise **subject line** following [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: ...`, `fix: ...`, `chore: ...`, `refactor: ...`). If changes span multiple scopes, use the most prominent one or omit the scope.
   - A bullet-point **body** summarizing the key changes (one bullet per logical change).

   Do **not** prompt the user — infer everything yourself.

6. Commit with a rich message. **Execute** the following `git commit` command (substitute `{subject}` and the bullet points with real values from step 5):

   ```bash
   git commit \
     -m "{subject}" \
     -m "{auto-inferred bullet point 1}" \
     -m "{auto-inferred bullet point 2}" \
     -m "{...more bullets as needed}"
   ```

   Each `-m` flag appends a paragraph to the commit body. Replace the placeholders with actual inferred bullets (one `-m` per bullet).

7. Read back the commit:
   ```bash
   git log -1 --format="%H%n%n%B"
   ```

Report each step's result as you go. On success, print the **commit hash** and the **auto-inferred commit summary**.
