// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import { execFileSync } from 'node:child_process';

// The date of the commit being built, for the home page's "Updated" tile.
// The cPanel deploy builds a copy without .git, so it passes the date in.
const committedAt = (() => {
  if (process.env.SITE_COMMITTED_AT) return process.env.SITE_COMMITTED_AT;
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null;
  } catch {
    return null;
  }
})();

// Every page renders on request on the Node server that Passenger starts
// through app.cjs, reading case studies and notes from MariaDB, so content
// published from the apps shows up without a deploy. Static files in
// public/ and the built CSS and JS are still served straight from disk.
export default defineConfig({
  site: 'https://ryanbealey.com',
  output: 'server',
  trailingSlash: 'never',
  // Case studies live under /work/; the home page is the work index.
  redirects: {
    '/work': { status: 301, destination: '/' },
  },
  // Pages are built whole before sending, so a failure mid-page returns a
  // real 500 instead of a 200 that stops halfway.
  adapter: node({ mode: 'standalone', experimentalDisableStreaming: true }),
  vite: {
    define: { __SITE_COMMITTED_AT__: JSON.stringify(committedAt) },
  },
  env: {
    schema: {
      SPOTIFY_CLIENT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      SPOTIFY_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      SPOTIFY_REFRESH_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      DB_HOST: envField.string({ context: 'server', access: 'secret', default: '127.0.0.1' }),
      DB_PORT: envField.number({ context: 'server', access: 'secret', default: 3306 }),
      DB_NAME: envField.string({ context: 'server', access: 'secret' }),
      DB_USER: envField.string({ context: 'server', access: 'secret' }),
      DB_PASSWORD: envField.string({ context: 'server', access: 'secret' }),
      // The contact form (src/lib/contact.ts). Messages are always saved;
      // with these set they're also emailed through SMTP2Go's API.
      SMTP2GO_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
