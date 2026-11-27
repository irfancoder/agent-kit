#!/usr/bin/env bash
# Installs agent-kit's machine-wide skills, once per machine (safe to rerun):
# - kickstart: linked from this checkout, so `git pull` updates it;
# - Hallmark, at the pinned version (scripts/install-hallmark.sh).
# Each goes in ~/.claude/skills (Claude Code) and ~/.agents/skills (other agents).
set -euo pipefail
KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
for root in "$HOME/.claude/skills" "$HOME/.agents/skills"; do
  mkdir -p "$root"
  link="$root/kickstart"
  if [[ -e "$link" && ! -L "$link" ]]; then
    echo "install-skills: $link exists and isn't a link; leaving it" >&2
    exit 1
  fi
  ln -sfn "$KIT_DIR/skills/kickstart" "$link"
  echo "Linked kickstart -> $link"
done
"$KIT_DIR/scripts/install-hallmark.sh"
