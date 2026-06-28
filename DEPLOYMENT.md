# Deploying to cPanel / CloudLinux

This app runs on cPanel under **Phusion Passenger** (CloudLinux Node.js
Selector). Passenger boots [`app.js`](app.js), which starts Next.js in
production from the `.next/` build.

Two pieces work together:

| File | Role |
| --- | --- |
| [`deploy/cpanel-deploy.sh`](deploy/cpanel-deploy.sh) | The deploy steps: activate the Node env, `npm ci`, `npm run build`, restart Passenger. Single source of truth. |
| [`.cpanel.yml`](.cpanel.yml) | Runs the script when you click **Deploy HEAD Commit** in cPanel. |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Runs the script automatically over SSH on every push to `main`. |

---

## One-time setup

### 1. Create the Git repository in cPanel

cPanel → **Git™ Version Control** → **Create**:

- **Clone a Repository:** on
- **Clone URL:** `https://github.com/rybealey/portfolio.git`
  (private repo? add a read-only **deploy key** to GitHub first — see note below)
- **Repository Path:** e.g. `repositories/portfolio` → creates
  `/home/<user>/repositories/portfolio`. **Note this full path.**

### 2. Create the Node.js application

cPanel → **Setup Node.js App** → **Create Application**:

- **Node.js version:** 20 LTS or 22 (Next.js 16 needs Node ≥ 20.9)
- **Application mode:** Production
- **Application root:** the **same path** as the repo above
  (`repositories/portfolio`)
- **Application URL:** your domain / subdomain
- **Application startup file:** `app.js`

Click **Create**, then copy the **"Enter to the virtual environment"** command
it shows — it looks like:

```
source /home/<user>/nodevenv/repositories/portfolio/22/bin/activate && cd /home/<user>/repositories/portfolio
```

The `source .../bin/activate` part is your `NODEVENV_ACTIVATE` value (below).

### 3. First build

The deploy script handles installs/builds, so just run it once from SSH:

```bash
cd ~/repositories/portfolio
NODEVENV_ACTIVATE="/home/<user>/nodevenv/repositories/portfolio/22/bin/activate" \
  bash deploy/cpanel-deploy.sh
```

Visit your domain to confirm it serves. (Or use cPanel → Git Version Control →
**Deploy HEAD Commit**, which runs `.cpanel.yml` → the same script.)

---

## Automatic deploy on push

Add these in GitHub → repo **Settings → Secrets and variables → Actions →
New repository secret**:

| Secret | Value |
| --- | --- |
| `CPANEL_SSH_HOST` | server hostname or IP (cPanel → SSH Access) |
| `CPANEL_SSH_USER` | your cPanel username |
| `CPANEL_SSH_PORT` | SSH port (often not 22 — check with your host); omit to default to 22 |
| `CPANEL_SSH_KEY` | a **private** SSH key whose public half is authorized on the server |
| `CPANEL_APP_PATH` | full app path, e.g. `/home/<user>/repositories/portfolio` |
| `CPANEL_NODEVENV_ACTIVATE` | the `source` path, e.g. `/home/<user>/nodevenv/repositories/portfolio/22/bin/activate` |

**SSH key:** in cPanel → **SSH Access → Manage SSH Keys**, generate or import a
key, **authorize** the public key, and put the **private** key in
`CPANEL_SSH_KEY`.

Once the secrets exist, every push to `main` runs the workflow: it SSHes in,
`git reset --hard origin/main`, rebuilds, and restarts Passenger. You can also
trigger it manually from the **Actions** tab (Run workflow).

---

## Notes

- **Private repo:** the server needs read access to fetch. Add a GitHub
  **deploy key** (cPanel SSH public key → repo **Settings → Deploy keys**), and
  use the SSH clone URL (`git@github.com:rybealey/portfolio.git`) in step 1.
- **Env vars** for the running app go in **Setup Node.js App** (not committed).
- **Restart manually:** `touch ~/repositories/portfolio/tmp/restart.txt`.
- The build needs devDependencies; the script installs them with
  `npm ci --include=dev` even if the environment forces `NODE_ENV=production`.
