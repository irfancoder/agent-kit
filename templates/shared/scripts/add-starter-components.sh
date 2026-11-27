#!/usr/bin/env bash
# Installs the starter component set from the IRFANCODER shadcn registry into apps/web.
# The registry is private and is read through GitHub's contents API (main branch): set
# IRFANCODER_REGISTRY_TOKEN to a GitHub token that can read irfancoder/agent-kit.
# IRFANCODER_REGISTRY_URL overrides where it is fetched from (selftest serves it locally).
set -euo pipefail
cd "$(dirname "$0")/../apps/web"
export IRFANCODER_REGISTRY_URL="${IRFANCODER_REGISTRY_URL:-https://api.github.com/repos/irfancoder/agent-kit/contents/registry/public/r}"
# Falls back to the GitHub CLI login, then to a dummy value for a local, unauthenticated registry.
export IRFANCODER_REGISTRY_TOKEN="${IRFANCODER_REGISTRY_TOKEN:-$(gh auth token 2>/dev/null || echo none)}"
STARTER=(button input label field textarea select checkbox switch dialog dropdown-menu popover tooltip tabs table card badge toast empty-state)
pnpm exec shadcn add --yes --overwrite "${STARTER[@]/#/@irfancoder/}"
