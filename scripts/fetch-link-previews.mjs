// Unfurls the links shared in notes, once, before dev and build.
//
// Results are cached in src/data/link-previews.json and each preview image
// is saved under src/assets/link-previews/, so the site serves optimized
// copies from its own domain and keeps working if a source page changes or
// disappears. Commit both. Already-fetched links are skipped; run with
// --refresh to fetch everything again. A failed fetch never fails the build:
// the note shows a plain link instead.
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { fetchLinkPreview } from '../src/lib/link-preview.ts';

const root = new URL('../', import.meta.url);
const notesDir = new URL('src/content/notes/', root);
const cacheFile = new URL('src/data/link-previews.json', root);
const imageDir = new URL('src/assets/link-previews/', root);
const refresh = process.argv.includes('--refresh');

const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };
const MAX_IMAGE_BYTES = 5_000_000;

const cache = JSON.parse(await readFile(cacheFile, 'utf8').catch(() => '{}'));

const links = new Set();
for (const file of await readdir(notesDir)) {
  if (!file.endsWith('.md')) continue;
  const text = await readFile(new URL(file, notesDir), 'utf8');
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const link = frontmatter.match(/^link:\s*['"]?(\S+?)['"]?\s*$/m)?.[1];
  if (link) links.add(link);
}

async function downloadImage(url, name) {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000), headers: { Accept: 'image/*' } });
  const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
  const ext = IMAGE_TYPES[type];
  if (!res.ok || !ext) throw new Error(`image ${res.status} ${type || 'unknown type'}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new Error('image over 5 MB');
  await mkdir(imageDir, { recursive: true });
  const file = `${name}.${ext}`;
  await writeFile(new URL(file, imageDir), bytes);
  return file;
}

let fetched = 0;
for (const url of links) {
  if (cache[url] && !refresh) continue;
  const name = createHash('sha1').update(url).digest('hex').slice(0, 12);
  try {
    const preview = await fetchLinkPreview(url);
    let image = null;
    if (preview.imageUrl) {
      try {
        image = await downloadImage(preview.imageUrl, name);
      } catch (error) {
        console.warn(`link previews: ${url}: ${error.message}; showing it without an image`);
      }
    }
    cache[url] = { status: 'ok', ...preview, image, fetchedAt: new Date().toISOString() };
  } catch (error) {
    console.warn(`link previews: ${url}: ${error.message}; showing a plain link`);
    cache[url] = { status: 'failed', url, host: new URL(url).hostname.replace(/^www\./, ''), fetchedAt: new Date().toISOString() };
  }
  fetched++;
}

// Drop entries no note links to any more.
for (const url of Object.keys(cache)) if (!links.has(url)) delete cache[url];

const sorted = Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)));
await mkdir(new URL('src/data/', root), { recursive: true });
await writeFile(cacheFile, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`link previews: ${links.size} links, ${fetched} fetched`);
