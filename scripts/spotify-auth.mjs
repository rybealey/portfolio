// One-time helper: gets a Spotify refresh token for the "now playing" tile.
//
// 1. Create an app at https://developer.spotify.com/dashboard
//    - Redirect URI: http://127.0.0.1:8888/callback (Spotify no longer accepts "localhost")
//    - API: Web API
// 2. Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env
// 3. Run `npm run spotify:auth`, open the printed link, approve.
// 4. Copy the printed SPOTIFY_REFRESH_TOKEN into .env and into cPanel.
import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first (see .env.example).');
  process.exit(1);
}

const PORT = 8888;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ['user-read-currently-playing', 'user-read-recently-played'];
const state = randomBytes(16).toString('hex');

const authorize = new URL('https://accounts.spotify.com/authorize');
authorize.search = new URLSearchParams({
  client_id: id,
  response_type: 'code',
  redirect_uri: REDIRECT,
  scope: SCOPES.join(' '),
  state,
}).toString();

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', REDIRECT);
  if (url.pathname !== '/callback') {
    res.writeHead(404).end();
    return;
  }
  const finish = (status, message) => {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }).end(message);
    server.close();
  };
  if (url.searchParams.get('state') !== state) return finish(400, 'State mismatch. Run the script again.');
  const code = url.searchParams.get('code');
  if (!code) return finish(400, `Spotify said: ${url.searchParams.get('error') ?? 'no code returned'}`);

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT }),
  });
  const json = await tokenRes.json();
  if (!tokenRes.ok || !json.refresh_token) {
    console.error(json);
    return finish(500, 'Token exchange failed. Check the terminal.');
  }
  console.log('\nAdd this to .env and to cPanel > Setup Node.js App > Environment variables:\n');
  console.log(`SPOTIFY_REFRESH_TOKEN=${json.refresh_token}\n`);
  finish(200, 'Done. The refresh token is in your terminal; you can close this tab.');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Open this link and approve access:\n');
  console.log(authorize.toString());
});
