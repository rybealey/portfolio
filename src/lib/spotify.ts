// Server-only Spotify client for the "now playing" tile. Uses the
// authorization-code refresh token from `npm run spotify:auth`, so the
// client secret never reaches the browser.
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from 'astro:env/server';

export type NowPlaying =
  | {
      state: 'playing' | 'recent';
      title: string;
      artist: string;
      album: string;
      art: string | null;
      /** ISO time; when the recent track finished, or now while playing. */
      at: string;
    }
  | { state: 'off' };

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1/me/player';
const CACHE_MS = 30_000;

let token: { value: string; expires: number } | null = null;
let cached: { body: NowPlaying; expires: number } | null = null;
let inflight: Promise<NowPlaying> | null = null;

export const isConfigured = () => Boolean(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET && SPOTIFY_REFRESH_TOKEN);

async function accessToken(): Promise<string> {
  if (token && token.expires > Date.now()) return token.value;
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN! }),
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  // Refresh a minute early so a request never races the expiry.
  token = { value: json.access_token, expires: Date.now() + (json.expires_in - 60) * 1000 };
  return token.value;
}

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string; width: number }[] };
}

const toTrack = (track: SpotifyTrack, state: 'playing' | 'recent', at: string): NowPlaying => ({
  state,
  title: track.name,
  artist: track.artists.map((a) => a.name).join(', '),
  album: track.album.name,
  // Images come largest first; the tile is at most ~300px wide at 2x.
  art: track.album.images.find((i) => i.width <= 640)?.url ?? track.album.images[0]?.url ?? null,
  at,
});

async function get(path: string): Promise<Response> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${await accessToken()}` },
    signal: AbortSignal.timeout(5000),
  });
  if (res.status === 401) token = null;
  return res;
}

async function load(): Promise<NowPlaying> {
  const current = await get('/currently-playing?additional_types=track');
  if (current.status === 200) {
    const json = (await current.json()) as { is_playing: boolean; currently_playing_type: string; item: SpotifyTrack | null };
    // Podcasts and ads come back without a track item; fall through to history.
    if (json.is_playing && json.currently_playing_type === 'track' && json.item) {
      return toTrack(json.item, 'playing', new Date().toISOString());
    }
  } else if (current.status !== 204) {
    throw new Error(`Spotify currently-playing failed: ${current.status}`);
  }

  const recent = await get('/recently-played?limit=1');
  if (!recent.ok) throw new Error(`Spotify recently-played failed: ${recent.status}`);
  const json = (await recent.json()) as { items: { track: SpotifyTrack; played_at: string }[] };
  const last = json.items[0];
  return last ? toTrack(last.track, 'recent', last.played_at) : { state: 'off' };
}

/** Cached for 30s and de-duplicated, so traffic spikes never hit Spotify's rate limit. */
export async function nowPlaying(): Promise<NowPlaying> {
  if (!isConfigured()) return { state: 'off' };
  if (cached && cached.expires > Date.now()) return cached.body;
  inflight ??= load()
    .then((body) => {
      cached = { body, expires: Date.now() + CACHE_MS };
      return body;
    })
    .catch((error: unknown) => {
      console.error(error);
      // Serve the last good answer through a Spotify outage, if there is one.
      return cached?.body ?? { state: 'off' as const };
    })
    .finally(() => (inflight = null));
  return inflight;
}
