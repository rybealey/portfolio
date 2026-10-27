#!/bin/bash
# Deploys ryanbealey.com to the Passenger app on cPanel. cPanel's Git Version
# Control runs this through .cpanel.yml on "Deploy HEAD Commit".
#
# It builds in cPanel's copy of the repository, then copies only what the
# live app needs into the app root, so the running site never sees a
# half-built folder. Database migrations stay manual; see the README.
#
# The paths can be overridden from the environment for a dry run elsewhere.
set -euo pipefail

CPANEL_HOME="${CPANEL_HOME:-/home/ryanblkt}"
APP_ROOT="${APP_ROOT:-$CPANEL_HOME/ryanbealey}"
NODE_ENV_ACTIVATE="${NODE_ENV_ACTIVATE:-$CPANEL_HOME/nodevenv/ryanbealey/24/bin/activate}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() { echo "deploy: $*"; }

# Makes sure each package's native binary loads in the folder given first.
# npm skips an optional dependency it can't install without saying why, so
# when one is missing this installs its Linux build by name, which either
# fixes it or makes npm report the real cause, such as the disk quota.
ensure_native() {
  local dir="$1" out
  shift
  out="$(cd "$dir" && node "$REPO/deploy/check-native.cjs" "$@")"
  [ -z "$out" ] && return 0
  local -a builds
  mapfile -t builds <<<"$out"
  log "npm skipped native builds in $dir; installing ${builds[*]}"
  (cd "$dir" && npm install --no-save --omit=dev --no-audit --no-fund --libc=glibc "${builds[@]}")
  out="$(cd "$dir" && node "$REPO/deploy/check-native.cjs" "$@")"
  if [ -n "$out" ]; then
    echo "deploy: still missing after a direct install: $out" >&2
    exit 1
  fi
}

# Empties node_modules. In a folder set up as a Node.js app it is a link into
# the app's environment, so empty what it points to and keep the link.
clear_node_modules() {
  if [ -L "$1/node_modules" ]; then
    rm -rf "$1/node_modules/"* "$1/node_modules/".[!.]*
  else
    rm -rf "$1/node_modules"
  fi
}

# Node 24 from Setup Node.js App, so the build uses the app's own runtime.
if [ "${SKIP_NODE_ENV:-}" != "1" ]; then
  if [ ! -f "$NODE_ENV_ACTIVATE" ]; then
    echo "deploy: no Node.js app at $NODE_ENV_ACTIVATE. Create it in Setup Node.js App first (Node 24, root ryanbealey, startup file app.cjs)." >&2
    exit 1
  fi
  # The activate script reads variables that may be unset.
  set +u
  # shellcheck disable=SC1090
  source "$NODE_ENV_ACTIVATE"
  set -u
fi
log "node $(node --version), npm $(npm --version)"

log "building in $REPO"
cd "$REPO"
if [ -L "$REPO/node_modules" ]; then
  log "note: $REPO is also set up as a Node.js app (node_modules links to $(readlink "$REPO/node_modules")). Only $APP_ROOT needs to be one."
fi
# The build needs no dev dependencies, which keeps the install small.
npm ci --omit=dev --no-audit --no-fund
ensure_native "$REPO" lightningcss
npm run build

log "copying the build to $APP_ROOT"
mkdir -p "$APP_ROOT/scripts" "$APP_ROOT/src/lib" "$APP_ROOT/tmp"
rsync -a --delete "$REPO/dist/" "$APP_ROOT/dist/"
rsync -a --delete "$REPO/db/" "$APP_ROOT/db/"
cp "$REPO/app.cjs" "$REPO/package.json" "$REPO/package-lock.json" "$APP_ROOT/"
cp "$REPO/scripts/db.mjs" "$REPO/scripts/db-migrate.mjs" "$REPO/scripts/db-seed.mjs" "$REPO/scripts/db-previews.mjs" "$APP_ROOT/scripts/"
cp "$REPO/src/lib/link-preview.ts" "$REPO/src/lib/link-preview-store.ts" "$APP_ROOT/src/lib/"

# The account's disk quota is tight, so drop the build's dependencies once
# the build is copied; the next deploy reinstalls them.
clear_node_modules "$REPO"
rm -rf "$REPO/dist"

log "installing runtime dependencies in $APP_ROOT"
cd "$APP_ROOT"
# npm install rather than npm ci: the Node.js selector keeps node_modules as
# a symlink into its own environment, and npm ci would delete it.
npm install --omit=dev --no-audit --no-fund
# Share cards render with resvg, and the About page's photo goes through sharp.
ensure_native "$APP_ROOT" @resvg/resvg-js sharp

touch "$APP_ROOT/tmp/restart.txt"
log "restarted Passenger"

log "if this release adds a file to db/migrations, apply it over SSH:"
log "  cd $APP_ROOT && node scripts/db-migrate.mjs   (with the DB_ variables exported, see the README)"
