# ryanbealey.com

Portfolio for Ry Bealey. Astro 7, static pages plus one server endpoint (Spotify), served by Passenger on cPanel.

## Run it

```bash
npm install
npm run dev
```

`npm run dev` regenerates `src/styles/tokens.css` from `design/tokens/` first. Never edit `tokens.css` by hand.

| Script | What it does |
| --- | --- |
| `npm run dev` | Tokens, then the Astro dev server on http://localhost:4321 |
| `npm run build` | Tokens, `astro check`, then the production build into `dist/` |
| `npm run preview` | Runs the built site through `app.cjs`, exactly as Passenger will |
| `npm run spotify:auth` | One-time Spotify login that prints a refresh token |
| `npm run package` | Build, then bundle `release/ryanbealey.tar.gz` for cPanel |

## How it fits together

- `design/tokens/ryvanse.tokens.json` is a copy of the Ryvanse design system's tokens. `ry-bealey.tokens.json` derives the portfolio's work register from it (semantic colors for dark and light, long-form type). `scripts/build-tokens.mjs` turns both into CSS custom properties.
- `src/content/work/` holds the case studies. The schema in `src/content.config.ts` fails the build on a missing field.
- `src/components/bento/` is the home grid. Cells marked `movable` can be dragged with a mouse or pen, or moved with the grip button from the keyboard, and swap among themselves; the hero, the three case studies and the contact strip never move. A visitor's order is saved in their browser under `rb:bento`. Touch devices (phones, tablets) can't rearrange and always get the designed order. The logic lives in `src/lib/bento.ts`.
- `src/pages/api/now-playing.ts` is the only on-demand route. It calls Spotify with a server-side refresh token (`src/lib/spotify.ts`), caches for 30 seconds, and falls back to the last good answer, so the client secret never reaches the browser.
- Client JavaScript on the home page is about 2.5 KB gzipped, no framework.

## Spotify setup

1. Create an app at https://developer.spotify.com/dashboard. Add the redirect URI `http://127.0.0.1:8888/callback` and pick Web API.
2. Copy `.env.example` to `.env` and fill in `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.
3. Run `npm run spotify:auth`, open the link, approve, and paste the printed `SPOTIFY_REFRESH_TOKEN` into `.env`.

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
   - Environment variables: the three `SPOTIFY_*` values
3. Upload `release/ryanbealey.tar.gz` to `~/ryanbealey` and extract it there. Don't upload `node_modules`; the Node.js selector manages that folder.
4. Back in Setup Node.js App, click **Run NPM Install**, then **Restart**.
5. Add the rules from `deploy/htaccess.example` above cPanel's Passenger block in the domain's `.htaccess`.

For later deploys over SSH, upload and extract the new archive, then:

```bash
source ~/nodevenv/ryanbealey/24/bin/activate && cd ~/ryanbealey && npm ci --omit=dev && touch tmp/restart.txt
```

## Still to fill in

- `src/data/site.ts`: `github`, `resumePdf` and `spotifyProfile` (links are hidden or fall back until set).
- Case-study copy in `src/content/work/`, plus the About, Resume and Colophon pages.
- GTM and GA4. Tiles already carry `data-ga-event` attributes for `resume_download` and `contact_click`.
