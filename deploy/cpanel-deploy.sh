#!/bin/bash
# Deploys ryanbealey.com on cPanel. cPanel's Git Version Control runs this
# through .cpanel.yml on "Deploy HEAD Commit".
#
# The Node.js app runs from cPanel's copy of the repository itself, so this
# builds a copy of the source in a staging folder and swaps the finished
# dist/ in. Astro empties its output folder before building, so building in
# place would take the site down for the length of the build, or for good if
# the build failed. Database migrations stay manual; see the README.
#
# The paths can be overridden from the environment for a dry run elsewhere.
set -euo pipefail

CPANEL_HOME="${CPANEL_HOME:-/home/ryanblkt}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_PATH="${REPO#"$CPANEL_HOME"/}"
NODE_ENV_ACTIVATE="${NODE_ENV_ACTIVATE:-$CPANEL_HOME/nodevenv/$APP_PATH/24/bin/activate}"
STAGE="${STAGE:-$CPANEL_HOME/.cache/portfolio-build}"

log() { echo "deploy: $*"; }

# Where npm runs. Setup Node.js App makes node_modules a symlink to
# <env>/lib/node_modules, and npm, run in the app folder, replaces that link
# with a plain folder. Run it in <env>/lib instead, so it installs into the
# folder the link points to.
NPM_DIR="$REPO"
if [ -L "$REPO/node_modules" ]; then
  NPM_DIR="$(dirname "$(readlink -f "$REPO/node_modules")")"
fi
# --no-save keeps npm from rewriting package-lock.json, which may be a link
# back to the repository's copy, and a changed file there blocks deploys.
npm_install() {
  local f
  for f in package.json package-lock.json; do
    [ "$REPO/$f" -ef "$NPM_DIR/$f" ] || cp "$REPO/$f" "$NPM_DIR/$f"
  done
  (cd "$NPM_DIR" && npm install --omit=dev --no-save --no-audit --no-fund "$@")
}

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
  npm_install --libc=glibc "${builds[@]}"
  out="$(cd "$dir" && node "$REPO/deploy/check-native.cjs" "$@")"
  if [ -n "$out" ]; then
    echo "deploy: still missing after a direct install: $out" >&2
    exit 1
  fi
}

# Node 24 from Setup Node.js App, so the build uses the app's own runtime.
if [ "${SKIP_NODE_ENV:-}" != "1" ]; then
  if [ ! -f "$NODE_ENV_ACTIVATE" ]; then
    echo "deploy: no Node.js app at $NODE_ENV_ACTIVATE. Create it in Setup Node.js App first (Node 24, root $APP_PATH, startup file app.cjs)." >&2
    exit 1
  fi
  # The activate script reads variables that may be unset.
  set +u
  # shellcheck disable=SC1090
  source "$NODE_ENV_ACTIVATE"
  set -u
fi
# CloudLinux caps each process at 4 GB of address space, reserved or not.
# glibc reserves 64 MB per thread for its allocator, and the build's Rust
# tools start a thread per CPU, so on a many-core server the build runs out
# without allocating much. WebAssembly's trap handler reserves 10 GB on its own.
export MALLOC_ARENA_MAX=2 RAYON_NUM_THREADS=4 TOKIO_WORKER_THREADS=4 UV_THREADPOOL_SIZE=4
export NODE_OPTIONS="--disable-wasm-trap-handler${NODE_OPTIONS:+ $NODE_OPTIONS}"

log "node $(node --version), npm $(npm --version)"

log "installing dependencies in $NPM_DIR"
cd "$REPO"
# The build needs no dev dependencies, so one install serves both.
npm_install
# lightningcss for the build; resvg for share cards and sharp for the About
# page's photo at runtime.
ensure_native "$REPO" lightningcss @resvg/resvg-js sharp

log "building in $STAGE"
mkdir -p "$STAGE"
rsync -a --delete \
  --exclude /.git --exclude /node_modules --exclude /dist --exclude /.astro --exclude /tmp \
  "$REPO/" "$STAGE/src/"
ln -sfn "$REPO/node_modules" "$STAGE/src/node_modules"
# The copy has no .git, so pass the commit date for the home page's "Updated" tile.
SITE_COMMITTED_AT="$(git -C "$REPO" log -1 --format=%cI 2>/dev/null || true)"
export SITE_COMMITTED_AT
(cd "$STAGE/src" && npm run build)

# Swap the new build in with two renames on the same disk, then restart, so
# the running app is without a dist/ for only an instant.
log "swapping in the new build"
rm -rf "$STAGE/dist.old"
if [ -d "$REPO/dist" ]; then mv "$REPO/dist" "$STAGE/dist.old"; fi
mv "$STAGE/src/dist" "$REPO/dist"
mkdir -p "$REPO/tmp"
touch "$REPO/tmp/restart.txt"
log "restarted Passenger"
rm -rf "$STAGE/dist.old"

log "if this release adds a file to db/migrations, apply it over SSH:"
log "  cd $REPO && node scripts/db-migrate.mjs   (with the DB_ variables exported, see the README)"
