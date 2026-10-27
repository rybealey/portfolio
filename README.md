# ryanbealey.com

Portfolio for Ry Bealey. Astro 7 rendering on request, with case studies and Writing notes in MariaDB, served by Passenger on cPanel.

## Run it

```bash
npm install
cp .env.example .env    # then fill in the DB_ passwords (any values work locally)
npm run db:up           # MariaDB 10.11 in Docker, on 127.0.0.1:3307
npm run db:migrate
npm run db:seed
npm run dev
```

`npm run dev` regenerates `src/styles/tokens.css` from `design/tokens/` first. Never edit `tokens.css` by hand.

| Script | What it does |
| --- | --- |
| `npm run dev` | Tokens, then the Astro dev server on http://localhost:4321 |
| `npm run build` | Tokens, `astro check`, then the production build into `dist/` |
| `npm run preview` | Runs the built site through `app.cjs`, exactly as Passenger will |
| `npm run db:up` | Starts the local MariaDB in Docker and waits until it's healthy |
| `npm run db:migrate` | Applies new files in `db/migrations/`, once each |
| `npm run db:seed` | Loads `db/seed/` (the original Markdown content and link previews); safe to rerun |
| `npm run db:previews` | Fetches link previews for notes that don't have one yet (`-- --refresh` refetches all) |
| `npm run spotify:auth` | One-time Spotify login that prints a refresh token |
| `npm run package` | Build, then bundle `release/ryanbealey.tar.gz` for cPanel |

## How it fits together

- `design/tokens/ryvanse.tokens.json` is a copy of the Ryvanse design system's tokens. `ry-bealey.tokens.json` derives the portfolio's work register from it (semantic colors for dark and light, long-form type). `scripts/build-tokens.mjs` turns both into CSS custom properties.
- Case studies and notes live in MariaDB (schema in `db/migrations/`). Pages read them through `src/lib/work.ts` and `src/lib/notes.ts`, which hold lists in memory for 30 seconds; bodies are Markdown rendered by `src/lib/markdown.ts`. Images (link preview images now, note images later) are stored in the `media` table and served from `/media/<hash>.<ext>`.
- `src/components/bento/` is the home grid. Cells marked `movable` can be dragged with a mouse or pen, or moved with the grip button from the keyboard, and swap among themselves; the hero, the three case studies and the contact strip never move. A visitor's order is saved in their browser under `rb:bento`. Touch devices (phones, tablets) can't rearrange and always get the designed order. The logic lives in `src/lib/bento.ts`.
- `src/pages/api/now-playing.ts` calls Spotify with a server-side refresh token (`src/lib/spotify.ts`), caches for 30 seconds, and falls back to the last good answer, so the client secret never reaches the browser.
- Client JavaScript on the home page is about 2.5 KB gzipped, no framework.

## Content

Notes and case studies are published from the iOS and macOS apps (a separate project) through an API this site will expose. Until then, add rows directly. A note's `slug` is its permanent link and starts with its date; it carries at most one attachment (`link_url`, `case_study_id` or `image_media_id`, the database enforces it) and stays out of production while `status` is `draft`. After adding a note with a link, run `npm run db:previews` to unfurl it. New content shows within 30 seconds, without a deploy.

`db/seed/` holds the content the site started with, as Markdown. It seeds local databases and the first production import; it is not edited after that.

Each note gets a share card at `/writing/<slug>.png`, rendered on first request, and an entry in `/writing/rss.xml`. The sitemap at `/sitemap.xml` is built live too.

## Spotify setup

1. Create an app at https://developer.spotify.com/dashboard. Add the redirect URI `http://127.0.0.1:8888/callback` and pick Web API.
2. Copy `.env.example` to `.env` and fill in `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.
3. Run `npm run spotify:auth` and approve access in the browser tab it opens. The script writes `SPOTIFY_REFRESH_TOKEN` into `.env` for you.

Without these values the tile shows "Quiet right now" instead of failing.

## Deploy to cPanel (Passenger)

Astro 7 needs Node.js 22.23.4 or newer. If the server's 22.x is older, pick 24.

1. `npm run package` locally.
2. In cPanel, open **Setup Node.js App** and create an application:
   - Node.js version: 24 (or 22.23.4+)
   - Application mode: Production
   - Application root: `ryanbealey` (outside `public_html`)
   - Application URL: `ryanbealey.com`
   - Application startup file: `app.cjs`
   - Environment variables: the three `SPOTIFY_*` values, plus `DB_HOST=localhost`, `DB_PORT=3306`, `DB_NAME`, `DB_USER` and `DB_PASSWORD` for the database from cPanel → MySQL Databases
3. Upload `release/ryanbealey.tar.gz` to `~/ryanbealey` and extract it there. Don't upload `node_modules`; the Node.js selector manages that folder.
4. Back in Setup Node.js App, click **Run NPM Install**.
5. Over SSH (Terminal in cPanel works), create the tables and import the starting content once. The database values go on the command line here because cPanel's app variables don't reach the shell:

   ```bash
   source ~/nodevenv/ryanbealey/24/bin/activate && cd ~/ryanbealey
   export DB_HOST=localhost DB_PORT=3306 DB_NAME=… DB_USER=…
   read -s DB_PASSWORD && export DB_PASSWORD
   node scripts/db-migrate.mjs && node scripts/db-seed.mjs
   ```

6. Click **Restart**.
7. Add the rules from `deploy/htaccess.example` above cPanel's Passenger block in the domain's `.htaccess`.

For later deploys over SSH, upload and extract the new archive, then install, apply any new migrations (with the DB variables exported as above) and restart:

```bash
source ~/nodevenv/ryanbealey/24/bin/activate && cd ~/ryanbealey && npm ci --omit=dev && node scripts/db-migrate.mjs && touch tmp/restart.txt
```

## Still to fill in

- `src/data/site.ts`: `github`, `resumePdf` and `spotifyProfile` (links are hidden or fall back until set).
- Case-study copy (in the database), plus the Resume and Colophon pages.
- The publishing API for the iOS and macOS apps.
- GTM and GA4. Tiles already carry `data-ga-event` attributes for `resume_download` and `contact_click`.
