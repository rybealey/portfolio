// Serves images stored in the media table: link preview images now, note
// images from the iOS app later. The file name is the content hash, so a
// response never changes and can be cached for a year.
import type { APIRoute } from 'astro';
import { rows } from '../../lib/db';

export const GET: APIRoute = async ({ params }) => {
  const sha = params.file?.match(/^([0-9a-f]{64})\.[a-z]+$/)?.[1];
  if (!sha) return new Response('Not found', { status: 404 });

  const [image] = await rows<{ content_type: string; bytes: Buffer }>('SELECT content_type, bytes FROM media WHERE sha256 = ?', [sha]);
  if (!image) return new Response('Not found', { status: 404 });

  return new Response(new Uint8Array(image.bytes), {
    headers: {
      'Content-Type': image.content_type,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
