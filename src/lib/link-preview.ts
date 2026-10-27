// Reads a page's Open Graph and Twitter card tags into a link preview.
// Pure fetch-and-parse with no storage, so it can run from the pre-build
// script today and from a save hook later if notes move to a database.
// Erasable TypeScript only: Node runs this file directly.

export type PreviewKind = 'large' | 'summary' | 'video';

export interface LinkPreview {
  url: string;
  host: string;
  siteName: string | null;
  title: string | null;
  description: string | null;
  /** Absolute URL of the preview image, if the page names one. */
  imageUrl: string | null;
  kind: PreviewKind;
}

/** One entry in src/data/link-previews.json; `image` is a file in src/assets/link-previews. */
export type CachedPreview =
  | (LinkPreview & { status: 'ok'; image: string | null; fetchedAt: string })
  | { status: 'failed'; url: string; host: string; fetchedAt: string };

const USER_AGENT = 'Mozilla/5.0 (compatible; ryanbealey.com link preview; +https://ryanbealey.com)';
const MAX_HTML_BYTES = 1_000_000;

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decode(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name: string) => ENTITIES[name.toLowerCase()] ?? match)
    .replace(/\s+/g, ' ')
    .trim();
}

function attributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of tag.matchAll(/([a-zA-Z:_-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    attrs[match[1]!.toLowerCase()] = match[3] ?? match[4] ?? match[5] ?? '';
  }
  return attrs;
}

/** Collects meta tags keyed by property or name, first value wins. */
function readMeta(html: string): Map<string, string> {
  const head = html.slice(0, html.search(/<\/head>/i) >>> 0 || html.length);
  const meta = new Map<string, string>();
  for (const tag of head.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    const key = (attrs['property'] ?? attrs['name'] ?? '').toLowerCase();
    const content = attrs['content'];
    if (key && content && !meta.has(key)) meta.set(key, decode(content));
  }
  return meta;
}

async function readCapped(res: Response, limit: number): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (size < limit) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.byteLength;
  }
  await reader.cancel().catch(() => {});
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export async function fetchLinkPreview(url: string, timeoutMs = 8000): Promise<LinkPreview> {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (!(res.headers.get('content-type') ?? '').includes('html')) throw new Error('Not an HTML page');

  const html = await readCapped(res, MAX_HTML_BYTES);
  const meta = readMeta(html);
  const pick = (...keys: string[]) => keys.map((k) => meta.get(k)).find(Boolean) ?? null;
  const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];

  const finalUrl = new URL(res.url || url);
  const rawImage = pick('og:image:secure_url', 'og:image', 'og:image:url', 'twitter:image', 'twitter:image:src');
  let imageUrl: string | null = null;
  if (rawImage) {
    try {
      imageUrl = new URL(rawImage, finalUrl).href;
    } catch {}
  }

  const card = pick('twitter:card');
  const type = pick('og:type') ?? '';
  const isVideo = type.startsWith('video') || card === 'player' || meta.has('og:video') || meta.has('og:video:url');
  const kind: PreviewKind = isVideo ? 'video' : card === 'summary' ? 'summary' : 'large';

  // Publishers often end titles with their own name ("Post title | Astro");
  // the card shows the site separately, so drop the repeat.
  const siteName = pick('og:site_name');
  let title = pick('og:title', 'twitter:title') ?? (titleTag ? decode(titleTag) : null);
  if (title && siteName) {
    const suffix = new RegExp(`\\s+[|·:–—-]\\s+${siteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    title = title.replace(suffix, '') || title;
  }

  return {
    url,
    host: finalUrl.hostname.replace(/^www\./, ''),
    siteName,
    title,
    description: pick('og:description', 'twitter:description', 'description'),
    imageUrl,
    kind,
  };
}
