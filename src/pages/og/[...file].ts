// GET /og/<page>.png: the share card for a page without its own, e.g.
// /og/about.png or /og/work/serverizz-web.png. See src/lib/og.ts.
import type { APIRoute } from 'astro';
import { cardFor, pagePath, renderCard } from '../../lib/og';

export const GET: APIRoute = async ({ params }) => {
  const file = params.file ?? '';
  if (!file.endsWith('.png')) return new Response('Not found', { status: 404 });
  const path = pagePath(file);
  const card = await cardFor(path);
  if (!card) return new Response('Not found', { status: 404 });
  return new Response(await renderCard(path, card), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
  });
};
