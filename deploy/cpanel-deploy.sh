#!/usr/bin/env bash
#
# Build and restart the Next.js app under cPanel / CloudLinux (Phusion
# Passenger). This is the single source of deploy truth — it is invoked by:
#   * .cpanel.yml            — when you click "Deploy HEAD Commit" in cPanel
#   * .github/workflows/deploy.yml — automatically on every push to main (SSH)
#
# Run from the application root: the git checkout that is ALSO set as the
# "Application root" in cPanel's Setup Node.js App.
set -euo pipefail

APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_ROOT"
echo "==> Deploying $APP_ROOT"

# --- Activate the CloudLinux Node.js virtualenv ------------------------------
# So npm/node use the Node version you selected for the app. Easiest: copy the
# `source ...../bin/activate` command cPanel shows under Setup Node.js App and
# set it as the NODEVENV_ACTIVATE env var. Otherwise we try to find it by the
# CloudLinux naming convention (~/nodevenv/<app-root-relative-to-home>/<ver>).
activate=""
if [ -n "${NODEVENV_ACTIVATE:-}" ]; then
  activate="$NODEVENV_ACTIVATE"
else
  rel="${APP_ROOT#"$HOME"/}"
  activate="$(ls -d "$HOME"/nodevenv/"$rel"/*/bin/activate 2>/dev/null | sort -V | tail -n1 || true)"
fi

if [ -n "$activate" ] && [ -f "$activate" ]; then
  echo "==> Activating Node env: $activate"
  # shellcheck disable=SC1090
  source "$activate"
else
  echo "WARN: Node virtualenv activate script not found; using node on PATH." >&2
  echo "      Set NODEVENV_ACTIVATE to the path cPanel shows for this app." >&2
fi

echo "==> node $(node -v) / npm $(npm -v)"

# --- Install deps + build ----------------------------------------------------
# --include=dev forces devDependencies (tailwind, typescript, eslint config)
# to install even if the environment defaults NODE_ENV to production — the
# build needs them. `next build` itself produces a production build.
npm ci --include=dev
npm run build

# --- Restart Passenger -------------------------------------------------------
# Passenger reloads the app when this file's mtime changes.
mkdir -p tmp
touch tmp/restart.txt
echo "==> Deployed. Passenger will load the new build on the next request."
