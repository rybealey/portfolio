// The About page's portrait as WebP, one file per width, written at build
// time into dist/client. See src/lib/headshot.ts for why.
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { HEADSHOT_WIDTHS, headshotSource } from '../lib/headshot';

export const prerender = true;

export const getStaticPaths = (() =>
  headshotSource() ? HEADSHOT_WIDTHS.map((width) => ({ params: { width: String(width) } })) : []) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const source = headshotSource();
  if (!source) return new Response(null, { status: 404 });
  const webp = await sharp(source)
    .resize({ width: Number(params.width), withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  return new Response(new Uint8Array(webp), { headers: { 'Content-Type': 'image/webp' } });
};
