import type { APIRoute } from 'astro';
import { nowPlaying } from '../../lib/spotify';

export const prerender = false;

export const GET: APIRoute = async () => {
  const body = await nowPlaying();
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=15, stale-while-revalidate=30',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
