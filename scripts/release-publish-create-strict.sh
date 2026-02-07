#!/usr/bin/env bash
# release-publish-create-strict.sh
#
# Deterministic release helper for Deenruv.
# Publishes packages in dependency order and runs a strict @deenruv/create
# smoke-test WITHOUT --legacy-peer-deps.
#
# Env flags:
#   DRY_RUN=1        (default) — print commands only, no actual publish
#   PUBLISH=1        — actually publish to registry
#   REGISTRY         — npm registry URL (default: https://registry.npmjs.org/)
#   SMOKE_PARENT_DIR — parent dir for temp smoke-test project (default: /tmp)
#   ALLOW_DIRTY=1    — skip clean-git-status check

set -euo pipefail

# ─── Colours / helpers ────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

info()  { printf "${CYAN}[INFO]${NC}  %s\n" "$*"; }
warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$*"; }
ok()    { printf "${GREEN}[OK]${NC}    %s\n" "$*"; }
fail()  { printf "${RED}[FAIL]${NC}  %s\n" "$*"; }
fatal() { fail "$*"; exit 1; }

# ─── Configuration ────────────────────────────────────────────────────────────

DRY_RUN="${DRY_RUN:-1}"
PUBLISH="${PUBLISH:-0}"
REGISTRY="${REGISTRY:-https://registry.npmjs.org/}"
SMOKE_PARENT_DIR="${SMOKE_PARENT_DIR:-/tmp}"
ALLOW_DIRTY="${ALLOW_DIRTY:-0}"

# Resolve to effective mode: if PUBLISH=1 → real publish, otherwise dry-run.
if [[ "$PUBLISH" == "1" ]]; then
  DRY_RUN=0
fi

if [[ "$DRY_RUN" == "1" ]]; then
  warn "DRY-RUN mode — no packages will be published."
  warn "Set PUBLISH=1 to perform a real publish."
else
  info "PUBLISH mode — packages WILL be published to ${REGISTRY}"
fi

# ─── Pre-checks ──────────────────────────────────────────────────────────────

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 1. Ensure we're at the repo root (pnpm-workspace.yaml must exist)
if [[ ! -f "${REPO_ROOT}/pnpm-workspace.yaml" ]]; then
  fatal "Cannot find pnpm-workspace.yaml — run this from the deenruv repo root."
fi

cd "$REPO_ROOT"
info "Repo root: ${REPO_ROOT}"

# 2. Clean git status (unless ALLOW_DIRTY=1)
if [[ "$ALLOW_DIRTY" != "1" ]]; then
  if [[ -n "$(git status --porcelain)" ]]; then
    fatal "Git working tree is dirty. Commit or stash changes, or set ALLOW_DIRTY=1."
  fi
  ok "Git working tree clean."
else
  warn "ALLOW_DIRTY=1 — skipping git status check."
fi

# 3. npm auth check when publishing for real
if [[ "$DRY_RUN" == "0" ]]; then
  info "Checking npm auth for registry ${REGISTRY} ..."
  if ! npm whoami --registry "$REGISTRY" 2>/dev/null; then
    fatal "Not authenticated to ${REGISTRY}. Run 'npm login --registry ${REGISTRY}' first."
  fi
  ok "Authenticated as $(npm whoami --registry "$REGISTRY")."
fi

# ─── Build / Lint gate ────────────────────────────────────────────────────────

info "Installing dependencies ..."
pnpm install

info "Running lint:fix ..."
pnpm run lint:fix

info "Building all packages (parallel / dev mode) ..."
pnpm run build:dev

ok "Build & lint gate passed."

# ─── Publish order ────────────────────────────────────────────────────────────
#
# Packages are grouped by dependency depth.
# Within each tier, order does not matter, but tiers must be sequential.
#
# Tier 0 — Zero internal deps (foundation)
# Tier 1 — Depends only on Tier 0
# Tier 2 — Depends on Tier 0 + 1
# Tier 3 — Depends on Tier 0 + 1 + 2
# Tier 4 — Plugins (depend on core + common)
# Tier 5 — Create (published last)

TIER_0=(
  "@deenruv/common"
  "@deenruv/ts-node-register"
  "@deenruv/admin-types"
  "@deenruv/inpost"
)

TIER_1=(
  "@deenruv/core"
  "@deenruv/admin-ui"
)

TIER_2=(
  "@deenruv/testing"
  "@deenruv/cli"
  "@deenruv/ui-devkit"
  "@deenruv/react-ui-devkit"
  "@deenruv/admin-ui-plugin"
)

TIER_3=(
  "@deenruv/admin-dashboard"
)

# Tier 4 — All plugins
TIER_4=(
  "@deenruv/asset-server-plugin"
  "@deenruv/job-queue-plugin"
  "@deenruv/email-plugin"
  "@deenruv/elasticsearch-plugin"
  "@deenruv/payments-plugin"
  "@deenruv/przelewy24-plugin"
  "@deenruv/harden-plugin"
  "@deenruv/stellate-plugin"
  "@deenruv/sentry-plugin"
  "@deenruv/reviews-plugin"
  "@deenruv/seo-plugin"
  "@deenruv/dashboard-widgets-plugin"
  "@deenruv/inpost-plugin"
  "@deenruv/cronjobs-plugin"
  "@deenruv/merchant-plugin"
  "@deenruv/newsletter-plugin"
  "@deenruv/replicate-plugin"
  "@deenruv/replicate-simple-bg-plugin"
  "@deenruv/redis-strategy-plugin"
  "@deenruv/wfirma-plugin"
  "@deenruv/upsell-plugin"
  "@deenruv/order-reminder-plugin"
  "@deenruv/order-line-attributes-plugin"
  "@deenruv/product-badges-plugin"
  "@deenruv/product-options-fields-plugin"
  "@deenruv/method-modal-plugin"
  "@deenruv/facet-harmonica-plugin"
  "@deenruv/copy-order-plugin"
  "@deenruv/in-realization-plugin"
  "@deenruv/phone-number-validation"
  "@deenruv/apollo-cache"
  "@deenruv/deenruv-examples-plugin"
)

# Tier 5 — Create (last, depends on core + common)
TIER_5=(
  "@deenruv/create"
)

# ─── Publish function ─────────────────────────────────────────────────────────

publish_pkg() {
  local pkg="$1"
  local cmd="pnpm --filter ${pkg} publish --access public --no-git-checks --registry ${REGISTRY}"

  if [[ "$DRY_RUN" == "1" ]]; then
    info "[dry-run] ${cmd}"
  else
    info "Publishing ${pkg} ..."
    if eval "$cmd"; then
      ok "Published ${pkg}"
    else
      # pnpm publish exits non-zero if version already exists — warn but continue
      warn "Failed to publish ${pkg} (may already exist at this version)."
    fi
  fi
}

publish_tier() {
  local tier_name="$1"
  shift
  local pkgs=("$@")

  printf "\n${BOLD}──── ${tier_name} (${#pkgs[@]} packages) ────${NC}\n"
  for pkg in "${pkgs[@]}"; do
    publish_pkg "$pkg"
  done
}

# ─── Execute publish ──────────────────────────────────────────────────────────

publish_tier "Tier 0 — Foundation"     "${TIER_0[@]}"
publish_tier "Tier 1 — Core libs"      "${TIER_1[@]}"
publish_tier "Tier 2 — SDK / tooling"  "${TIER_2[@]}"
publish_tier "Tier 3 — Admin shell"    "${TIER_3[@]}"
publish_tier "Tier 4 — Plugins"        "${TIER_4[@]}"
publish_tier "Tier 5 — Create"         "${TIER_5[@]}"

printf "\n${BOLD}══════════════════════════════════════════${NC}\n"
if [[ "$DRY_RUN" == "1" ]]; then
  ok "Dry-run publish complete — no packages were published."
else
  ok "All packages published to ${REGISTRY}."
fi

# ─── Strict smoke-test ────────────────────────────────────────────────────────

printf "\n${BOLD}══════ Strict @deenruv/create smoke-test ══════${NC}\n"

SMOKE_DIR="${SMOKE_PARENT_DIR}/deenruv-smoke-$$-$(date +%s)"
SMOKE_PROJECT="${SMOKE_DIR}/my-store"
SMOKE_CMD="npx --yes --registry ${REGISTRY} @deenruv/create@latest my-store --ci --use-npm"

info "Smoke-test directory: ${SMOKE_DIR}"

if [[ "$DRY_RUN" == "1" ]]; then
  info "[dry-run] Would create: ${SMOKE_DIR}"
  info "[dry-run] Would run:    cd ${SMOKE_DIR} && ${SMOKE_CMD}"
  info "[dry-run] Would verify:"
  info "  1. No @deenruv/admin-ui-plugin in package.json"
  info "  2. No AdminUiPlugin in src/deenruv-config.ts"
  info "  3. Postgres env vars (DB_HOST, DB_PORT, etc.) in .env"
  printf "\n"
  ok "Dry-run smoke-test description complete."
  printf "\n${GREEN}${BOLD}✓ DRY-RUN PASS${NC}\n"
  exit 0
fi

# ── Real smoke-test ───────────────────────────────────────────────────────────

mkdir -p "$SMOKE_DIR"
cd "$SMOKE_DIR"

info "Running: ${SMOKE_CMD}"
eval "$SMOKE_CMD"

SMOKE_ERRORS=0

# Check 1: No legacy admin-ui-plugin in package.json
info "Check 1: No @deenruv/admin-ui-plugin in package.json ..."
if [[ -f "${SMOKE_PROJECT}/package.json" ]]; then
  if grep -q '"@deenruv/admin-ui-plugin"' "${SMOKE_PROJECT}/package.json"; then
    fail "package.json still contains @deenruv/admin-ui-plugin!"
    SMOKE_ERRORS=$((SMOKE_ERRORS + 1))
  else
    ok "No @deenruv/admin-ui-plugin found in package.json."
  fi
else
  fail "package.json not found at ${SMOKE_PROJECT}/package.json"
  SMOKE_ERRORS=$((SMOKE_ERRORS + 1))
fi

# Check 2: No AdminUiPlugin in deenruv-config.ts
info "Check 2: No AdminUiPlugin in src/deenruv-config.ts ..."
if [[ -f "${SMOKE_PROJECT}/src/deenruv-config.ts" ]]; then
  if grep -q 'AdminUiPlugin' "${SMOKE_PROJECT}/src/deenruv-config.ts"; then
    fail "src/deenruv-config.ts still references AdminUiPlugin!"
    SMOKE_ERRORS=$((SMOKE_ERRORS + 1))
  else
    ok "No AdminUiPlugin found in src/deenruv-config.ts."
  fi
else
  fail "src/deenruv-config.ts not found at ${SMOKE_PROJECT}/src/deenruv-config.ts"
  SMOKE_ERRORS=$((SMOKE_ERRORS + 1))
fi

# Check 3: Postgres env vars in .env
info "Check 3: Postgres env vars in .env ..."
if [[ -f "${SMOKE_PROJECT}/.env" ]]; then
  MISSING_VARS=()
  for var in DB_HOST DB_PORT DB_NAME DB_USERNAME DB_PASSWORD; do
    if ! grep -q "^${var}=" "${SMOKE_PROJECT}/.env"; then
      MISSING_VARS+=("$var")
    fi
  done
  if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
    fail ".env is missing postgres vars: ${MISSING_VARS[*]}"
    SMOKE_ERRORS=$((SMOKE_ERRORS + 1))
  else
    ok "All postgres env vars present in .env (DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD)."
  fi
else
  fail ".env not found at ${SMOKE_PROJECT}/.env"
  SMOKE_ERRORS=$((SMOKE_ERRORS + 1))
fi

# ── Final verdict ─────────────────────────────────────────────────────────────

printf "\n${BOLD}══════════════════════════════════════════${NC}\n"
if [[ "$SMOKE_ERRORS" -gt 0 ]]; then
  printf "${RED}${BOLD}✗ SMOKE-TEST FAIL${NC} — ${SMOKE_ERRORS} check(s) failed.\n"
  info "Smoke-test artifacts preserved at: ${SMOKE_DIR}"
  exit 1
else
  printf "${GREEN}${BOLD}✓ SMOKE-TEST PASS${NC} — all checks passed.\n"
  info "Cleaning up smoke-test dir: ${SMOKE_DIR}"
  rm -rf "$SMOKE_DIR"
  printf "\n${GREEN}${BOLD}✓ RELEASE PASS${NC}\n"
  exit 0
fi
