#!/usr/bin/env bash
# Installs the Hallmark design skill (https://github.com/nutlope/hallmark, MIT) at a
# pinned commit, for Claude Code (~/.claude/skills/hallmark) and Codex/other agents
# (~/.agents/skills/hallmark). Projects' design-language skill drives it.
#
#   scripts/install-hallmark.sh              # install the pinned version
#   HALLMARK_REF=<sha> scripts/install-hallmark.sh   # try another version
#   HALLMARK_DEST="dir1/hallmark dir2/hallmark" ...   # install somewhere else
#
# Safe to rerun: it does nothing when every destination already has the pinned version.
# Bump HALLMARK_PIN on purpose (read the changelog, rerun selftest), like any dependency.
# Optional, for Hallmark's screenshot checks: npm i -g puppeteer-core, plus Chrome.
set -euo pipefail
HALLMARK_PIN="04977e15f3dfd6ee4b74c887dac3eb52665d6c92" # v2.0.0, 2026-11-11
REF="${HALLMARK_REF:-$HALLMARK_PIN}"
read -ra DESTS <<<"${HALLMARK_DEST:-$HOME/.claude/skills/hallmark $HOME/.agents/skills/hallmark}"
for dest in "${DESTS[@]}"; do
  [[ "$(basename "$dest")" == hallmark ]] || { echo "install-hallmark: refusing $dest (must end in /hallmark)" >&2; exit 1; }
done

current=1
for dest in "${DESTS[@]}"; do
  [[ "$(cat "$dest/.hallmark-ref" 2>/dev/null)" == "$REF" ]] || current=0
done
if [[ $current == 1 ]]; then echo "Hallmark $REF is already installed."; exit 0; fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
git -C "$WORK" init -q
git -C "$WORK" remote add origin https://github.com/nutlope/hallmark.git
git -C "$WORK" fetch -q --depth 1 origin "$REF"
git -C "$WORK" checkout -q FETCH_HEAD
[[ -f "$WORK/skills/hallmark/SKILL.md" ]] || { echo "install-hallmark: no skills/hallmark/SKILL.md at $REF" >&2; exit 1; }

for dest in "${DESTS[@]}"; do
  rm -rf "$dest"
  mkdir -p "$(dirname "$dest")"
  cp -R "$WORK/skills/hallmark" "$dest"
  echo "$REF" > "$dest/.hallmark-ref"
  echo "Installed Hallmark $REF -> $dest"
done
