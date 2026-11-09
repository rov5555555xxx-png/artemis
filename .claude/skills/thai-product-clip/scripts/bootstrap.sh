#!/usr/bin/env bash
# Installs the thai-product-clip skill at user level (~/.claude/skills) from the artemis repo
# and prepares its tools, so every new cloud session can make clips right away.
# Run from the directory that holds the repo checkout (the environment setup script does this).
set -e
REPO=${REPO_DIR:-artemis}
BRANCH=${SKILL_BRANCH:-ccr-625e0525-vpojae}
DEST=/root/.claude/skills/thai-product-clip
[ -d "$REPO/.git" ] || { echo "skip: $REPO not checked out"; exit 0; }
cd "$REPO"
if [ ! -d .claude/skills/thai-product-clip ]; then
  git fetch -q origin "$BRANCH" || true
  SRC=$(mktemp -d)
  git archive "origin/$BRANCH" .claude/skills/thai-product-clip | tar -x -C "$SRC"
  SKILL_SRC="$SRC/.claude/skills/thai-product-clip"
else
  SKILL_SRC=.claude/skills/thai-product-clip
fi
mkdir -p "$(dirname "$DEST")"; rm -rf "$DEST"; cp -r "$SKILL_SRC" "$DEST"
bash "$DEST/scripts/setup.sh"
echo "thai-product-clip ready at $DEST"
