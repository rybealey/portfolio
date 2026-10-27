// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';

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
    },
  },
});
