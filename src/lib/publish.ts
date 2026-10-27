// Reads and writes notes, case studies and images for the publishing API.
// Unlike getNotes() and getCaseStudies(), these see drafts and unpublished
// case studies, return raw Markdown, and skip the cache; every write clears
// the cache so the site shows the change at once.
import type { ResultSetHeader } from 'mysql2/promise';
import { z } from 'astro/zod';
import { ApiError, expectedVersion, notFound, slugify, slugPattern, today, versionConflict } from './api';
import { db, invalidate, rows } from './db';
import { ensureLinkPreview, storeMedia } from './link-preview-store';
import { TOPICS, mediaPath, type TopicKey } from './notes';
import { ACCENTS, CASE_STUDY_STATUSES } from './work';

const SITE = import.meta.env.SITE;
const absolute = (path: string) => new URL(path, SITE).href;
const iso = (date: Date) => date.toISOString();
const isDate = (value: string) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

export const TOPIC_KEYS = Object.keys(TOPICS) as [TopicKey, ...TopicKey[]];
export const NOTE_STATUSES = ['draft', 'published'] as const;

// Notes ---------------------------------------------------------------------

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'a date as YYYY-MM-DD').refine(isDate, 'not a real date');

// A note carries at most one attachment, as the notes table enforces.
const attachment = z
  .discriminatedUnion('type', [
    z.strictObject({ type: z.literal('link'), url: z.url({ protocol: /^https?$/ }).max(2048) }),
    z.strictObject({ type: z.literal('caseStudy'), slug: z.string().regex(slugPattern) }),
    z.strictObject({
      type: z.literal('image'),
      sha256: z.string().regex(/^[0-9a-f]{64}$/, 'the sha256 from POST /api/v1/media'),
      alt: z.string().trim().min(1).max(300),
      caption: z.string().trim().max(300).nullable().default(null),
    }),
  ])
  .nullable();

const noteFields = {
  publishedOn: date,
  topic: z.enum(TOPIC_KEYS),
  body: z.string().trim().min(1).max(60_000),
  pinned: z.boolean(),
  status: z.enum(NOTE_STATUSES),
  attachment,
};

export const NoteCreate = z.strictObject({
  ...noteFields,
  // The permalink. Starts with the date; made from the body when left out.
  slug: z
    .string()
    .max(160)
    .regex(slugPattern, 'lowercase words joined by hyphens')
    .regex(/^\d{4}-\d{2}-\d{2}-/, 'starts with the date, YYYY-MM-DD-')
    .optional(),
  publishedOn: date.optional(),
  pinned: z.boolean().default(false),
  status: z.enum(NOTE_STATUSES).default('draft'),
  attachment: attachment.default(null),
});

// The slug is the permalink, so an edit can't change it.
export const NotePatch = z.strictObject(noteFields).partial();

interface NoteRow {
  id: number;
  slug: string;
  published_on: string;
  topic: TopicKey;
  body: string;
  pinned: number;
  status: (typeof NOTE_STATUSES)[number];
  link_url: string | null;
  cs_slug: string | null;
  im_sha: string | null;
  im_type: string | null;
  im_width: number | null;
  im_height: number | null;
  image_alt: string | null;
  image_caption: string | null;
  lp_status: 'ok' | 'failed' | null;
  lp_title: string | null;
  lp_site_name: string | null;
  lp_description: string | null;
  version: number;
  created_at: Date;
  updated_at: Date;
}

const NOTE_QUERY = `
  SELECT n.id, n.version, n.slug, n.published_on, n.topic, n.body, n.pinned, n.status, n.link_url, n.image_alt, n.image_caption,
         n.created_at, n.updated_at, cs.slug AS cs_slug,
         im.sha256 AS im_sha, im.content_type AS im_type, im.width AS im_width, im.height AS im_height,
         lp.status AS lp_status, lp.title AS lp_title, lp.site_name AS lp_site_name, lp.description AS lp_description
  FROM notes n
  LEFT JOIN case_studies cs ON cs.id = n.case_study_id
  LEFT JOIN media im ON im.id = n.image_media_id
  LEFT JOIN link_previews lp ON lp.url_hash = n.link_url_hash`;

function noteJson(row: NoteRow) {
  let attached: Record<string, unknown> | null = null;
  if (row.link_url) {
    attached = {
      type: 'link',
      url: row.link_url,
      // null until the preview is fetched; status 'failed' shows a plain link.
      preview: row.lp_status
        ? { status: row.lp_status, title: row.lp_title, siteName: row.lp_site_name, description: row.lp_description }
        : null,
    };
  } else if (row.cs_slug) {
    attached = { type: 'caseStudy', slug: row.cs_slug };
  } else if (row.im_sha && row.im_type) {
    attached = {
      type: 'image',
      sha256: row.im_sha,
      url: absolute(mediaPath(row.im_sha, row.im_type)),
      width: row.im_width,
      height: row.im_height,
      alt: row.image_alt,
      caption: row.image_caption,
    };
  }
  return {
    slug: row.slug,
    url: absolute(`/writing/${row.slug}`),
    publishedOn: row.published_on,
    topic: row.topic,
    body: row.body,
    pinned: Boolean(row.pinned),
    status: row.status,
    attachment: attached,
    version: row.version,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

export async function listNotes() {
  return (await rows<NoteRow>(`${NOTE_QUERY} ORDER BY n.published_on DESC, n.slug DESC`)).map(noteJson);
}

async function noteRow(slug: string): Promise<NoteRow> {
  const [row] = await rows<NoteRow>(`${NOTE_QUERY} WHERE n.slug = ?`, [slug]);
  if (!row) throw notFound('note');
  return row;
}

export async function getNote(slug: string) {
  const row = await noteRow(slug);
  return { note: noteJson(row), version: row.version };
}

type Attachment = z.output<typeof attachment>;

async function attachmentColumns(value: Attachment) {
  const columns = { link_url: null as string | null, case_study_id: null as number | null, image_media_id: null as number | null, image_alt: null as string | null, image_caption: null as string | null };
  if (value?.type === 'link') columns.link_url = value.url;
  if (value?.type === 'caseStudy') {
    const [study] = await rows<{ id: number }>('SELECT id FROM case_studies WHERE slug = ?', [value.slug]);
    if (!study) throw new ApiError(422, 'invalid', `No case study with the slug ${value.slug}`);
    columns.case_study_id = study.id;
  }
  if (value?.type === 'image') {
    const [image] = await rows<{ id: number }>('SELECT id FROM media WHERE sha256 = ?', [value.sha256]);
    if (!image) throw new ApiError(422, 'invalid', 'No uploaded image with that sha256; upload it to /api/v1/media first');
    Object.assign(columns, { image_media_id: image.id, image_alt: value.alt, image_caption: value.caption });
  }
  return columns;
}

// Runs an UPDATE or DELETE that names the expected version; no row changed
// means another edit got there first.
async function writeVersioned(sql: string, params: unknown[]) {
  const [result] = await db().query<ResultSetHeader>(sql, params);
  if (!result.affectedRows) throw versionConflict();
}

// Fetches the link's preview card now, so the note shows it from the first
// view. A failure is recorded and the note shows a plain link.
async function previewLink(value: Attachment | undefined) {
  if (value?.type === 'link') await ensureLinkPreview(db(), value.url).catch((error) => console.error('Link preview failed', error));
}

async function uniqueNoteSlug(publishedOn: string, body: string) {
  const base = `${publishedOn}-${slugify(body) || 'note'}`.slice(0, 150).replace(/-+$/, '');
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    if (!(await rows('SELECT 1 FROM notes WHERE slug = ?', [slug])).length) return slug;
  }
}

export async function createNote(input: z.output<typeof NoteCreate>) {
  const publishedOn = input.publishedOn ?? today();
  const slug = input.slug ?? (await uniqueNoteSlug(publishedOn, input.body));
  const columns = await attachmentColumns(input.attachment);
  await db().query(
    `INSERT INTO notes (slug, published_on, topic, body, pinned, status, link_url, case_study_id, image_media_id, image_alt, image_caption)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [slug, publishedOn, input.topic, input.body, input.pinned ? 1 : 0, input.status,
      columns.link_url, columns.case_study_id, columns.image_media_id, columns.image_alt, columns.image_caption],
  );
  await previewLink(input.attachment);
  invalidate();
  return getNote(slug);
}

export async function updateNote(slug: string, patch: z.output<typeof NotePatch>, request: Request) {
  const row = await noteRow(slug);
  const version = expectedVersion(request, row.version);
  const set: Record<string, unknown> = {};
  if (patch.publishedOn !== undefined) set['published_on'] = patch.publishedOn;
  if (patch.topic !== undefined) set['topic'] = patch.topic;
  if (patch.body !== undefined) set['body'] = patch.body;
  if (patch.pinned !== undefined) set['pinned'] = patch.pinned ? 1 : 0;
  if (patch.status !== undefined) set['status'] = patch.status;
  if (patch.attachment !== undefined) Object.assign(set, await attachmentColumns(patch.attachment));
  if (Object.keys(set).length) {
    await writeVersioned('UPDATE notes SET ?, version = version + 1 WHERE id = ? AND version = ?', [set, row.id, version]);
    await previewLink(patch.attachment);
    invalidate();
  }
  return getNote(slug);
}

export async function deleteNote(slug: string, request: Request) {
  const row = await noteRow(slug);
  await writeVersioned('DELETE FROM notes WHERE id = ? AND version = ?', [row.id, expectedVersion(request, row.version)]);
  invalidate();
}

// Case studies -----------------------------------------------------------------

const text = (max: number) => z.string().trim().min(1).max(max);

const caseStudyFields = {
  order: z.number().int().min(0).max(65_535),
  label: text(40),
  title: text(200),
  summary: text(500),
  role: text(120),
  timeframe: text(80),
  stack: z.array(text(60)).max(30),
  status: z.enum(CASE_STUDY_STATUSES),
  accent: z.enum(ACCENTS),
  metrics: z.array(text(120)).max(12),
  body: z.string().max(1_000_000),
  published: z.boolean(),
};

export const CaseStudyCreate = z.strictObject({
  ...caseStudyFields,
  slug: z.string().max(120).regex(slugPattern, 'lowercase words joined by hyphens'),
  // Last in the list when left out.
  order: caseStudyFields.order.optional(),
  stack: caseStudyFields.stack.default([]),
  metrics: caseStudyFields.metrics.default([]),
  body: caseStudyFields.body.default(''),
  published: z.boolean().default(false),
});

// The slug is the case study's URL, so an edit can't change it.
export const CaseStudyPatch = z.strictObject(caseStudyFields).partial();

interface CaseStudyRow {
  id: number;
  slug: string;
  sort_order: number;
  label: string;
  title: string;
  summary: string;
  role: string;
  timeframe: string;
  stack: string | string[];
  status: (typeof CASE_STUDY_STATUSES)[number];
  accent: (typeof ACCENTS)[number];
  metrics: string | string[];
  body: string;
  published: number;
  version: number;
  created_at: Date;
  updated_at: Date;
}

// MariaDB returns JSON columns as strings.
const list = (value: string | string[]) => (typeof value === 'string' ? (JSON.parse(value) as string[]) : value);

const caseStudyJson = (row: CaseStudyRow) => ({
  slug: row.slug,
  url: absolute(`/work/${row.slug}`),
  order: row.sort_order,
  label: row.label,
  title: row.title,
  summary: row.summary,
  role: row.role,
  timeframe: row.timeframe,
  stack: list(row.stack),
  status: row.status,
  accent: row.accent,
  metrics: list(row.metrics),
  body: row.body,
  published: Boolean(row.published),
  version: row.version,
  createdAt: iso(row.created_at),
  updatedAt: iso(row.updated_at),
});

export async function listCaseStudies() {
  return (await rows<CaseStudyRow>('SELECT * FROM case_studies ORDER BY sort_order, slug')).map(caseStudyJson);
}

async function caseStudyRow(slug: string): Promise<CaseStudyRow> {
  const [row] = await rows<CaseStudyRow>('SELECT * FROM case_studies WHERE slug = ?', [slug]);
  if (!row) throw notFound('case study');
  return row;
}

export async function getCaseStudyForApi(slug: string) {
  const row = await caseStudyRow(slug);
  return { caseStudy: caseStudyJson(row), version: row.version };
}

export async function createCaseStudy(input: z.output<typeof CaseStudyCreate>) {
  const order = input.order ?? (await rows<{ next: number }>('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM case_studies'))[0]!.next;
  await db().query(
    `INSERT INTO case_studies (slug, sort_order, label, title, summary, role, timeframe, stack, status, accent, metrics, body, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [input.slug, order, input.label, input.title, input.summary, input.role, input.timeframe, JSON.stringify(input.stack),
      input.status, input.accent, JSON.stringify(input.metrics), input.body, input.published ? 1 : 0],
  );
  invalidate();
  return getCaseStudyForApi(input.slug);
}

export async function updateCaseStudy(slug: string, patch: z.output<typeof CaseStudyPatch>, request: Request) {
  const row = await caseStudyRow(slug);
  const version = expectedVersion(request, row.version);
  const set: Record<string, unknown> = {};
  const columns = { order: 'sort_order', label: 'label', title: 'title', summary: 'summary', role: 'role', timeframe: 'timeframe',
    status: 'status', accent: 'accent', body: 'body' } as const;
  for (const [field, column] of Object.entries(columns)) {
    const value = patch[field as keyof typeof columns];
    if (value !== undefined) set[column] = value;
  }
  if (patch.stack !== undefined) set['stack'] = JSON.stringify(patch.stack);
  if (patch.metrics !== undefined) set['metrics'] = JSON.stringify(patch.metrics);
  if (patch.published !== undefined) set['published'] = patch.published ? 1 : 0;
  if (Object.keys(set).length) {
    await writeVersioned('UPDATE case_studies SET ?, version = version + 1 WHERE id = ? AND version = ?', [set, row.id, version]);
    invalidate();
  }
  return getCaseStudyForApi(slug);
}

export async function deleteCaseStudy(slug: string, request: Request) {
  const row = await caseStudyRow(slug);
  const version = expectedVersion(request, row.version);
  const [use] = await rows<{ n: number }>('SELECT COUNT(*) AS n FROM notes WHERE case_study_id = ?', [row.id]);
  if (use && use.n > 0) {
    const notes = use.n === 1 ? '1 note attaches' : `${use.n} notes attach`;
    throw new ApiError(409, 'in_use', `${notes} this case study; change their attachment first, or unpublish it instead`);
  }
  await writeVersioned('DELETE FROM case_studies WHERE id = ? AND version = ?', [row.id, version]);
  invalidate();
}

// Images ----------------------------------------------------------------------

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'] as const;
export const MAX_UPLOAD_BYTES = 15_000_000;
const MAX_EDGE = 2400;

/**
 * Stores an uploaded image for notes and Markdown bodies. Photos are turned
 * upright, scaled to at most 2400 px on the long edge and re-encoded, which
 * also drops EXIF metadata such as a phone's GPS location. GIFs are kept as
 * they are so animation survives.
 */
export async function storeUpload(bytes: Buffer, contentType: (typeof IMAGE_TYPES)[number]) {
  const { default: sharp } = await import('sharp');
  let meta;
  try {
    meta = await sharp(bytes).metadata();
  } catch {
    throw new ApiError(422, 'not_an_image', 'The body is not an image sharp can read (convert HEIC to JPEG first)');
  }
  let stored = bytes;
  if (contentType !== 'image/gif') {
    const image = sharp(bytes).rotate().resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true });
    const encode = { 'image/jpeg': () => image.jpeg({ quality: 85, mozjpeg: true }), 'image/png': () => image.png(),
      'image/webp': () => image.webp({ quality: 85 }), 'image/avif': () => image.avif({ quality: 60 }) }[contentType];
    stored = await encode().toBuffer();
  } else if (!meta.format || meta.format !== 'gif') {
    throw new ApiError(422, 'not_an_image', 'The body is not a GIF');
  }
  const id = await storeMedia(db(), stored, contentType);
  const [row] = await rows<{ sha256: string; content_type: string; width: number | null; height: number | null }>(
    'SELECT sha256, content_type, width, height FROM media WHERE id = ?',
    [id],
  );
  return {
    sha256: row!.sha256,
    url: absolute(mediaPath(row!.sha256, row!.content_type)),
    contentType: row!.content_type,
    width: row!.width,
    height: row!.height,
    bytes: stored.byteLength,
  };
}
