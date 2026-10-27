// Loads db/seed into the database: the case studies and notes that started
// as Markdown, plus their cached link previews. Upserts by slug or URL, so it
// is safe to rerun; it never deletes. Use it for local development and for
// the one-time import into production.
import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';
import { connect } from './db.mjs';
import { storeMedia } from '../src/lib/link-preview-store.ts';

const seed = new URL('../db/seed/', import.meta.url);
const db = await connect();

async function readMarkdown(dir) {
  const entries = [];
  for (const file of (await readdir(new URL(dir, seed))).filter((f) => f.endsWith('.md')).sort()) {
    const text = await readFile(new URL(`${dir}${file}`, seed), 'utf8');
    const [, frontmatter = '', body = ''] = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/) ?? [];
    entries.push({ slug: file.replace(/\.md$/, ''), data: parse(frontmatter) ?? {}, body: body.trim() });
  }
  return entries;
}

// Case studies.
for (const { slug, data, body } of await readMarkdown('work/')) {
  await db.query(
    `INSERT INTO case_studies (slug, sort_order, label, title, summary, role, timeframe, stack, status, accent, metrics, body, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order), label = VALUES(label), title = VALUES(title),
       summary = VALUES(summary), role = VALUES(role), timeframe = VALUES(timeframe), stack = VALUES(stack),
       status = VALUES(status), accent = VALUES(accent), metrics = VALUES(metrics), body = VALUES(body)`,
    [slug, data.order, data.label, data.title, data.summary, data.role, data.timeframe, JSON.stringify(data.stack),
      data.status, data.accent, JSON.stringify(data.metrics), body],
  );
}

// Link previews from the cache the Markdown build used, images included.
const cache = JSON.parse(await readFile(new URL('link-previews.json', seed), 'utf8'));
for (const preview of Object.values(cache)) {
  let imageId = null;
  if (preview.status === 'ok' && preview.image) {
    const bytes = await readFile(new URL(`link-previews/${preview.image}`, seed));
    const ext = preview.image.split('.').pop();
    imageId = await storeMedia(db, bytes, `image/${ext === 'jpg' ? 'jpeg' : ext}`);
  }
  await db.query(
    `INSERT INTO link_previews (url, status, host, site_name, title, description, kind, image_media_id, fetched_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE status = VALUES(status), host = VALUES(host), site_name = VALUES(site_name), title = VALUES(title),
       description = VALUES(description), kind = VALUES(kind), image_media_id = VALUES(image_media_id), fetched_at = VALUES(fetched_at)`,
    [preview.url, preview.status, preview.host, preview.siteName ?? null, preview.title ?? null, preview.description ?? null,
      preview.kind ?? 'large', imageId, new Date(preview.fetchedAt)],
  );
}

// Notes. A case study is referenced by slug in the Markdown.
for (const { slug, data, body } of await readMarkdown('notes/')) {
  const [cs] = data.caseStudy ? await db.query('SELECT id FROM case_studies WHERE slug = ?', [data.caseStudy]) : [[]];
  await db.query(
    `INSERT INTO notes (slug, published_on, topic, body, pinned, status, link_url, case_study_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE published_on = VALUES(published_on), topic = VALUES(topic), body = VALUES(body),
       pinned = VALUES(pinned), status = VALUES(status), link_url = VALUES(link_url), case_study_id = VALUES(case_study_id)`,
    [slug, new Date(data.date).toISOString().slice(0, 10), data.topic, body, data.pinned ? 1 : 0,
      data.draft ? 'draft' : 'published', data.link ?? null, cs[0]?.id ?? null],
  );
}

const [[counts]] = await db.query(
  'SELECT (SELECT COUNT(*) FROM case_studies) AS caseStudies, (SELECT COUNT(*) FROM notes) AS notes, (SELECT COUNT(*) FROM link_previews) AS previews, (SELECT COUNT(*) FROM media) AS media',
);
console.log(`seed: ${counts.caseStudies} case studies, ${counts.notes} notes, ${counts.previews} link previews, ${counts.media} images`);
await db.end();
