// Stores link previews and images in MariaDB. Takes a connection so the
// command-line scripts and the site (and later the posting API) share it.
// Erasable TypeScript only: Node runs this file directly.
import { createHash } from 'node:crypto';
import type { Connection, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { fetchLinkPreview } from './link-preview.ts';

type Db = Pick<Connection | Pool, 'query'>;

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MAX_IMAGE_BYTES = 5_000_000;

async function dimensions(bytes: Buffer): Promise<{ width: number | null; height: number | null }> {
  try {
    const { default: sharp } = await import('sharp');
    const meta = await sharp(bytes).metadata();
    return { width: meta.width ?? null, height: meta.height ?? null };
  } catch {
    return { width: null, height: null };
  }
}

/** Stores image bytes once, keyed by their hash. Returns the media id. */
export async function storeMedia(db: Db, bytes: Buffer, contentType: string): Promise<number> {
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const [found] = await db.query<RowDataPacket[]>('SELECT id FROM media WHERE sha256 = ?', [sha256]);
  if (found[0]) return found[0]['id'] as number;
  const { width, height } = await dimensions(bytes);
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO media (sha256, content_type, width, height, bytes) VALUES (?, ?, ?, ?, ?)',
    [sha256, contentType, width, height, bytes],
  );
  return result.insertId;
}

export async function downloadImage(url: string): Promise<{ bytes: Buffer; contentType: string }> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000), headers: { Accept: 'image/*' } });
  const contentType = (res.headers.get('content-type') ?? '').split(';')[0]!.trim();
  if (!res.ok || !IMAGE_TYPES.has(contentType)) throw new Error(`image ${res.status} ${contentType || 'unknown type'}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new Error('image over 5 MB');
  return { bytes, contentType };
}

/**
 * Fetches a URL's preview and stores it, unless it is already stored.
 * A failed fetch is stored too, so the note shows a plain link and the URL
 * isn't refetched on every request. Pass refresh to fetch again.
 */
export async function ensureLinkPreview(db: Db, url: string, { refresh = false } = {}): Promise<'stored' | 'cached' | 'failed'> {
  if (!refresh) {
    const [rows] = await db.query<RowDataPacket[]>('SELECT id FROM link_previews WHERE url_hash = SHA2(?, 256)', [url]);
    if (rows.length) return 'cached';
  }
  try {
    const preview = await fetchLinkPreview(url);
    let imageId: number | null = null;
    if (preview.imageUrl) {
      try {
        const image = await downloadImage(preview.imageUrl);
        imageId = await storeMedia(db, image.bytes, image.contentType);
      } catch {
        // The card falls back to text only.
      }
    }
    await db.query(
      `INSERT INTO link_previews (url, status, host, site_name, title, description, kind, image_media_id, fetched_at)
       VALUES (?, 'ok', ?, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE status = 'ok', host = VALUES(host), site_name = VALUES(site_name), title = VALUES(title),
         description = VALUES(description), kind = VALUES(kind), image_media_id = VALUES(image_media_id), fetched_at = NOW()`,
      [url, preview.host, preview.siteName, preview.title, preview.description, preview.kind, imageId],
    );
    return 'stored';
  } catch {
    const host = new URL(url).hostname.replace(/^www\./, '');
    await db.query(
      `INSERT INTO link_previews (url, status, host, fetched_at) VALUES (?, 'failed', ?, NOW())
       ON DUPLICATE KEY UPDATE status = 'failed', fetched_at = NOW()`,
      [url, host],
    );
    return 'failed';
  }
}
