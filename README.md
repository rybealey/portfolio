<p align="center">
  <img src=".github/banner.png" alt="Ry Bealey, ryanbealey.com portfolio: web infrastructure, design and payments, turned into specs, data models and working software." width="100%">
</p>

<p align="center">
  <img alt="Status: pre-launch, MVP Nov 9" src="https://img.shields.io/badge/status-pre--launch%20%C2%B7%20MVP%20Nov%209-ff8f2e?style=flat-square&labelColor=140c22">
  <img alt="Astro 7.4" src="https://img.shields.io/badge/Astro-7.4-ff3d9a?style=flat-square&logo=astro&logoColor=white&labelColor=140c22">
  <img alt="TypeScript strict" src="https://img.shields.io/badge/TypeScript-strict-33e3e8?style=flat-square&logo=typescript&logoColor=white&labelColor=140c22">
  <img alt="Node.js 22.23.4 or newer" src="https://img.shields.io/badge/Node.js-%E2%89%A522.23.4-c8ff3c?style=flat-square&logo=nodedotjs&logoColor=white&labelColor=140c22">
  <img alt="MariaDB 10.11" src="https://img.shields.io/badge/MariaDB-10.11-a77bff?style=flat-square&logo=mariadb&logoColor=white&labelColor=140c22">
  <br>
  <img alt="Docker for the local database" src="https://img.shields.io/badge/Docker-local%20DB-33e3e8?style=flat-square&logo=docker&logoColor=white&labelColor=140c22">
  <img alt="Hosted on cPanel with Passenger" src="https://img.shields.io/badge/hosting-cPanel%20%C2%B7%20Passenger-ff8f2e?style=flat-square&logo=cpanel&logoColor=white&labelColor=140c22">
  <img alt="Design system: Ryvanse" src="https://img.shields.io/badge/design-Ryvanse-ff3d9a?style=flat-square&labelColor=140c22">
  <img alt="Accessibility target: WCAG 2.2 AA" src="https://img.shields.io/badge/a11y-WCAG%202.2%20AA-c8ff3c?style=flat-square&labelColor=140c22">
</p>

<p align="center">
  The source for <a href="https://ryanbealey.com"><strong>ryanbealey.com</strong></a>: case studies, a microblog and a little personality, rendered live from MariaDB and served by Passenger on cPanel.
</p>

---

## Contents

- [What's inside](#whats-inside)
- [Stack](#stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Content and the database](#content-and-the-database)
- [Publishing API](#publishing-api)
- [Design system](#design-system)
- [Spotify setup](#spotify-setup)
- [Deploy to cPanel](#deploy-to-cpanel)
- [Status and roadmap](#status-and-roadmap)

## What's inside

- **Bento home page.** A 12-column grid on CSS grid and container queries. The small tiles can be rearranged with a mouse, a pen or the keyboard (grip button, then the arrow keys), with each visitor's order saved in their browser. The hero, the case studies and the contact strip stay put, and touch devices always get the designed layout.
- **Case studies** at `/work/<slug>`. A home tile morphs into its case study's header through a cross-document View Transition.
- **Writing, a microblog.** Short, dated notes with one optional attachment: a link preview, a case study card or an image. Notes have permalinks, topic pages and month archives, an RSS feed, and a 1200×630 share card for each note.
- **Live content.** Case studies and notes live in MariaDB and every page renders on request, so new content shows within 30 seconds without a deploy.
- **Now playing.** A Spotify tile shows the current or last played track through a server-side endpoint, so the client secret never reaches the browser.
- **Light and dark.** Follows the system setting, defaults to light, remembers a visitor's choice, and fades between themes.
- **⌘K command palette** for jumping to any page, plus a skip link, visible focus and `prefers-reduced-motion` respected throughout.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | [Astro 7](https://astro.build), TypeScript strict, `output: 'server'` with the Node adapter in standalone mode |
| Data | MariaDB 10.11 through `mysql2`; Docker locally, cPanel's database in production |
| Rendering | Markdown bodies rendered per request with `marked`, code colored by Shiki through theme-aware CSS variables |
| Styling | Plain CSS with cascade layers; custom properties generated from the design system's tokens |
| Images | Astro's image endpoint for site images (AVIF and WebP); stored images served by content hash |
| Share cards | Satori and resvg, rendered on first request and kept in memory |
| Fonts | Atkinson Hyperlegible, JetBrains Mono and Unbounded, self-hosted |
| Client JavaScript | About 5.5 KB gzipped on the home page, no framework |
| Hosting | cPanel and WHM, with Phusion Passenger running `app.cjs` |

## Getting started

You'll need Node.js 22.23.4 or newer and Docker.

```bash
npm install
cp .env.example .env    # then fill in the DB_ passwords; any values work locally
npm run db:up           # MariaDB 10.11 in Docker on 127.0.0.1:3307
npm run db:migrate      # create the tables
npm run db:seed         # load the starting content from db/seed/
npm run dev             # http://localhost:4321
```

`npm run dev` and `npm run build` regenerate `src/styles/tokens.css` from `design/tokens/` first. Never edit `tokens.css` by hand.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Tokens, then the Astro dev server on http://localhost:4321 |
| `npm run build` | Tokens, then the production build into `dist/`. Needs no dev dependencies, and sets the memory limits CloudLinux needs, so it runs on the server too |
| `npm run preview` | Runs the built site through `app.cjs`, exactly as Passenger will |
| `npm run check` | Type-checks `.astro` and `.ts` files (run it before committing) |
| `npm run db:up` | Starts the local MariaDB in Docker and waits until it's healthy |
| `npm run db:migrate` | Applies new files in `db/migrations/`, once each |
| `npm run db:seed` | Loads `db/seed/`; safe to rerun, never deletes |
| `npm run db:previews` | Fetches link previews for notes that don't have one yet (`-- --refresh` refetches all) |
| `npm run api:token` | Creates, lists and revokes publishing API tokens (`-- create "Ry's iPhone"`, `-- list`, `-- revoke 3`) |
| `npm run spotify:auth` | One-time Spotify login that saves a refresh token to `.env` |
| `npm run package` | Type-check, build, then bundle `release/ryanbealey.tar.gz` for cPanel |

`node scripts/render-banner.mjs` redraws this README's banner.

## Project structure

```text
.
├── app.cjs                 Passenger startup file; loads the built server
├── docker-compose.yml      Local MariaDB 10.11
├── db/
│   ├── migrations/         Numbered SQL files; add new ones, never edit old ones
│   └── seed/               The starting content as Markdown, plus cached link previews
├── deploy/                 cPanel deploy script and Apache rules for the Passenger app
├── design/tokens/          Ryvanse tokens and the derived work-register tokens
├── public/                 Fonts, favicon, robots.txt, llms.txt
├── scripts/                Tokens, database, Spotify, banner and release scripts
└── src/
    ├── assets/             Images processed by Astro, such as the About headshot
    ├── components/         Header, footer, palette, bento grid, tiles, Writing parts
    ├── data/               Site settings and the About page content
    ├── layouts/            Base page shell and the Writing layout
    ├── lib/                Database access, notes, case studies, Markdown, link previews, Spotify, bento logic
    ├── pages/              Routes, including /api/v1 (publishing), /api/now-playing, /media and /sitemap.xml
    └── styles/             Global CSS and the generated tokens
```

## Content and the database

Case studies and notes are published from companion iOS and macOS apps (a separate project) through the [publishing API](#publishing-api).

| Table | Holds |
| --- | --- |
| `case_studies` | One row per case study: order, label, title, summary, status, accent, metrics and a Markdown body. Only `published` rows appear. |
| `notes` | One row per note. The `slug` is the permalink and starts with the date. At most one attachment (`link_url`, `case_study_id` or `image_media_id`), and an image needs `image_alt`; the database enforces both. Drafts stay out of production. |
| `link_previews` | The unfurled preview for each shared URL, fetched once. |
| `media` | Images stored once by SHA-256 and served from `/media/<hash>.<ext>` with a year-long cache. |
| `api_tokens` | One row per device allowed to use the publishing API. Only a hash of each token is kept. |

- **Reading.** Pages read through `src/lib/work.ts` and `src/lib/notes.ts`, which hold lists in memory for 30 seconds.
- **Previews.** The API unfurls a note's link when it's posted. For a link added straight to the database, run `npm run db:previews`.
- **Changing the schema.** Add a numbered file to `db/migrations/` and run `npm run db:migrate`. Never edit a migration that has already run anywhere.
- **Seed files.** `db/seed/` seeds local databases and the first production import. It isn't edited after that.

## Publishing API

JSON over HTTPS at `https://ryanbealey.com/api/v1`, for the iOS and macOS apps. Every request needs a device token, and responses are never cached. The code is in `src/lib/api.ts`, `src/lib/publish.ts` and `src/pages/api/v1/`.

### Device tokens

Each device gets its own token, so one can be revoked without touching the others. Create them over SSH, with the DB variables exported as for migrations (see [First deploy](#first-deploy)):

```bash
node scripts/api-token.mjs create "Ry's iPhone"
```

The token (`rb_` plus 43 characters) is printed once and only its hash is stored. Keep it in the device's Keychain and send it as `Authorization: Bearer rb_…`. `list` shows each token's last use; `revoke <id>` cuts a device off at once.

### Endpoints

| Method and path | Does |
| --- | --- |
| `GET /api/v1` | Checks the token; returns the device name and the allowed topics, statuses and accents |
| `GET /api/v1/notes` | Every note, drafts included, newest first |
| `POST /api/v1/notes` | Creates a note; `201` with `Location` |
| `GET` · `PATCH` · `DELETE /api/v1/notes/{slug}` | Reads, edits (only the fields sent) or deletes one note |
| `GET /api/v1/case-studies` | Every case study, unpublished included, in order |
| `POST /api/v1/case-studies` | Creates a case study |
| `GET` · `PATCH` · `DELETE /api/v1/case-studies/{slug}` | Reads, edits or deletes one; delete is refused (`409`) while a note attaches it |
| `POST /api/v1/media` | Uploads one image as the raw body with its `Content-Type`; returns its `sha256` and `url` |

A note:

```json
{
  "topic": "build",
  "body": "Markdown, up to 60,000 characters.",
  "status": "published",
  "pinned": false,
  "publishedOn": "2026-10-27",
  "attachment": { "type": "link", "url": "https://example.com/post" }
}
```

- **Required:** `topic` (`billing`, `web`, `support` or `build`) and `body`. `status` defaults to `draft`, `publishedOn` to today in Austin, and `slug` to the date plus the body's first words. A slug you send must start with the date.
- **Attachment:** at most one, or `null`. `{ "type": "link", "url" }` unfurls the link when saved. `{ "type": "caseStudy", "slug" }` attaches a case study. `{ "type": "image", "sha256", "alt", "caption" }` attaches an image uploaded first to `/api/v1/media`.
- **Slugs don't change.** They're the permalink, so `PATCH` refuses `slug`. Create a new note and delete the old one instead.

A case study needs `slug`, `label`, `title`, `summary`, `role`, `timeframe`, `status` (`shipped`, `live`, `phased`, `prototype` or `in-progress`) and `accent` (`billing`, `web` or `fin`). `stack` and `metrics` are lists of strings, `body` is Markdown, `order` defaults to last, and `published` defaults to `false`.

### Images

Upload JPEG, PNG, WebP, GIF or AVIF, up to 15 MB. Photos are turned upright, scaled to at most 2400 px on the long edge and re-encoded, which also strips EXIF data such as GPS location. GIFs are stored as sent. Convert HEIC to JPEG on the device first. Identical images are stored once.

### Edits from two devices

Every note and case study has a `version`, also sent as the `ETag` header. Send it back as `If-Match` on `PATCH` or `DELETE`. If the row changed since, say from the other device, the request fails with `412` and nothing is written. Fetch it again and reapply the edit. Without `If-Match`, the last write wins.

### Errors

Errors come back as `{ "error": { "code", "message", "details"? } }`:

| Status | When |
| --- | --- |
| `401` | Missing, unknown or revoked token |
| `404` | No note or case study with that slug |
| `409` | Slug taken, or deleting a case study a note attaches |
| `412` | `If-Match` version is out of date |
| `413` · `415` | Upload too big, or the wrong `Content-Type` |
| `422` | Invalid fields; `details` lists each with its path |

Writes clear the site's 30-second content cache in the process that handled them. Passenger can run more than one process, so another may show the old version for up to 30 seconds.

## Design system

The site uses the Ryvanse design system in a quieter "work" register. `design/tokens/ryvanse.tokens.json` is a copy of its tokens, and `ry-bealey.tokens.json` derives the portfolio's semantic colors for light and dark plus its long-form type. `scripts/build-tokens.mjs` turns both into the CSS custom properties in `src/styles/tokens.css`. Change the token files, not the generated CSS.

## Spotify setup

1. Create an app at https://developer.spotify.com/dashboard. Add the redirect URI `http://127.0.0.1:8888/callback` and pick Web API.
2. Fill in `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env`.
3. Run `npm run spotify:auth` and approve access in the browser tab it opens. The script writes `SPOTIFY_REFRESH_TOKEN` into `.env` for you.

Without these values the tile shows "Quiet right now" instead of failing.

## Deploy to cPanel

The site runs as a Passenger app from **Setup Node.js App**, straight from cPanel's Git copy of this repository. Don't use cPanel's container-based application deploy: it needs rootless containers, which this server doesn't allow, and it treats the site as static. Astro 7 needs Node.js 22.23.4 or newer; the app uses 24.

### First deploy

1. In **Git Version Control**, click **Create** and clone `https://github.com/rybealey/portfolio.git` into `repositories/portfolio`.
2. In **Setup Node.js App**, create an application:
   - Node.js version: 24
   - Application mode: Production
   - Application root: `repositories/portfolio`
   - Application URL: `ryanbealey.com`
   - Application startup file: `app.cjs`
   - Passenger log file: `logs/portfolio-passenger.log`, so app errors land somewhere the account can read
   - Environment variables: the three `SPOTIFY_*` values, plus `DB_HOST=localhost`, `DB_PORT=3306`, `DB_NAME`, `DB_USER` and `DB_PASSWORD` for the database from cPanel → MySQL Databases
   - Also `MALLOC_ARENA_MAX=2` and `NODE_OPTIONS=--disable-wasm-trap-handler`. CloudLinux caps each process at 4 GB of address space, counting memory that's only reserved, and without these the share cards and image resizing reserve past it and crash the app. The build sets the same limits for itself.
3. Back in **Git Version Control → Manage → Pull or Deploy**, click **Deploy HEAD Commit**. cPanel runs `.cpanel.yml`, which runs `deploy/cpanel-deploy.sh`. The script:
   1. Installs dependencies into the app's Node.js environment with its Node 24.
   2. Builds a copy of the source in `~/.cache/portfolio-build`. Astro empties its output folder before building, so building in place would take the site down, and a failed build would leave it down.
   3. Swaps the new `dist/` into the repository and restarts Passenger. A failed build stops before this step and leaves the live site as it was.

   After installing, it loads the native modules (lightningcss for the build, resvg and sharp at runtime). npm skips an optional dependency it can't install without saying why, so if one is missing the script installs its Linux build by name. That either fixes it or shows npm's real error in the deploy log.
4. Over SSH (cPanel's Terminal works), create the tables and import the starting content once. The database values go on the command line because cPanel's app variables don't reach the shell:

   ```bash
   source ~/nodevenv/repositories/portfolio/24/bin/activate && cd ~/repositories/portfolio
   export DB_HOST=localhost DB_PORT=3306 DB_NAME=… DB_USER=…
   read -s DB_PASSWORD && export DB_PASSWORD
   node scripts/db-migrate.mjs && node scripts/db-seed.mjs
   ```

5. Add the rules from `deploy/htaccess.example` above cPanel's Passenger block in the domain's `.htaccess`.

If the app is changed in Setup Node.js App and Passenger keeps the old settings, restart it as root. cPanel keeps Passenger's registry in a non-default folder:

```bash
PASSENGER_INSTANCE_REGISTRY_DIR=/var/run/ea-passenger-runtime passenger-config restart-app /home/ryanblkt/repositories/portfolio
```

### Later deploys

1. Push to GitHub.
2. In **Git Version Control → Manage → Pull or Deploy**, click **Update from Remote**, then **Deploy HEAD Commit**. If cPanel says the repository can't deploy although it's clean, its status is stale; deploy from the command line instead: `uapi --user=ryanblkt VersionControlDeployment create repository_root=/home/ryanblkt/repositories/portfolio`.
3. Migrations stay manual. If the release adds a file to `db/migrations/`, apply it over SSH with the DB variables exported as above: `cd ~/repositories/portfolio && node scripts/db-migrate.mjs`.

The deploy log is in `~/.cpanel/logs/`, and the app's own log in `~/logs/portfolio-passenger.log`.

## Status and roadmap

The MVP is planned to launch on **Nov 9, 2026**.

- [x] Bento home page, light and dark themes, ⌘K palette, page transitions
- [x] About page with timeline, toolkit and headshot
- [x] Writing: feed, permalinks, topic pages, month archives, link previews, share cards, RSS
- [x] Live content from MariaDB, with Docker for local development
- [x] Spotify now playing
- [x] Production database set up on cPanel, then the first deploy
- [x] Publishing API for the iOS and macOS apps
- [ ] Full case-study write-ups, plus the Resume and Colophon pages
- [ ] GTM and GA4 (tiles already carry `data-ga-event` attributes for `resume_download` and `contact_click`)
- [x] GitHub profile in `src/data/site.ts`
- [x] Resume PDF, rendered from `/resume`'s print view by `npm run resume:pdf` (Resume links keep going to the page)
