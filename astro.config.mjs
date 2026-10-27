// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// Pages prerender to static HTML. Only routes that opt out with
// `export const prerender = false` (the Spotify endpoint) run on the
// Node server that Passenger starts through app.cjs.
export default defineConfig({
  site: 'https://ryanbealey.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  adapter: node({ mode: 'standalone' }),
  integrations: [sitemap()],
  env: {
    schema: {
      SPOTIFY_CLIENT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      SPOTIFY_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      SPOTIFY_REFRESH_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
