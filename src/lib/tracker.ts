// The job application tracker's data: one row per role researched or
// applied to (table applications), plus small state documents for its
// automations (table tracker_state). Used by the locked /tracker page and by
// the tracker API under /api/v1/applications, which Claude sessions and the
// mail check write through. Reads skip the site cache: the page is private,
// and every view should show the latest rows.
import type { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { z } from 'astro/zod';
import { ApiError, today, versionConflict } from './api';
import { db, rows } from './db';

export const STATUSES = ['Shortlisted', 'Needs you', 'Approved', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn', 'Skipped'] as const;
export type Status = (typeof STATUSES)[number];

export interface Application {
  slug: string;
  company: string;
  role: string;
  location: string | null;
  pay: string | null;
  experience: string | null;
  tier: number | null;
  rank: number | null;
  status: Status;
  url: string | null;
  why: string | null;
  notes: string | null;
  appliedOn: string | null;
  ats: string | null;
  found: string | null;
  version: number;
  updatedAt: string;
}

interface Row extends RowDataPacket {
  id: number;
  version: number;
  slug: string;
  company: string;
  role: string;
  location: string | null;
  pay: string | null;
  experience: string | null;
  tier: number | null;
  rank: number | null;
  status: Status;
  url: string | null;
  why: string | null;
  notes: string | null;
  applied_on: string | null;
  ats: string | null;
  found: string | null;
  updated_at: Date;
}

const toApplication = (row: Row): Application => ({
  slug: row.slug,
  company: row.company,
  role: row.role,
  location: row.location,
  pay: row.pay,
  experience: row.experience,
  tier: row.tier,
  rank: row.rank,
  status: row.status,
  url: row.url,
  why: row.why,
  notes: row.notes,
  appliedOn: row.applied_on,
  ats: row.ats,
  found: row.found,
  version: row.version,
  updatedAt: new Date(row.updated_at).toISOString(),
});

// Fields --------------------------------------------------------------------

const isDate = (value: string) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'a date as YYYY-MM-DD').refine(isDate, 'not a real date');
const optionalText = (max: number) => z.string().trim().max(max).nullable().transform((value) => value || null);

// Slugs from the tracker's artifact days are lowercase words and digits
// joined by hyphens, sometimes with dots or underscores.
export const slugSchema = z.string().regex(/^[a-z0-9][a-z0-9._-]{0,199}$/, 'lowercase letters, digits, dots, underscores and hyphens');

const fields = {
  company: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(300),
  location: optionalText(300),
  pay: optionalText(300),
  experience: optionalText(5_000),
  tier: z.number().int().min(1).max(9).nullable(),
  rank: z.number().int().min(0).max(4_000_000_000).nullable(),
  status: z.enum(STATUSES),
  url: z.url({ protocol: /^https?$/ }).max(2048).nullable(),
  why: optionalText(10_000),
  notes: optionalText(200_000),
  appliedOn: date.nullable(),
  ats: optionalText(200),
  found: optionalText(300),
};

export const ApplicationCreate = z.strictObject({
  slug: slugSchema,
  ...fields,
  location: fields.location.default(null),
  pay: fields.pay.default(null),
  experience: fields.experience.default(null),
  tier: fields.tier.default(null),
  rank: fields.rank.default(null),
  status: fields.status.default('Shortlisted'),
  url: fields.url.default(null),
  why: fields.why.default(null),
  notes: fields.notes.default(null),
  appliedOn: fields.appliedOn.default(null),
  ats: fields.ats.default(null),
  found: fields.found.default(null),
});
export type ApplicationCreate = z.output<typeof ApplicationCreate>;

// A patch changes only the fields sent. appendNote adds a sentence to the
// end of notes, the way rejections and next steps are logged.
export const ApplicationPatch = z.strictObject({
  ...fields,
  appendNote: z.string().trim().min(1).max(5_000),
}).partial();
export type ApplicationPatch = z.output<typeof ApplicationPatch>;

export const BatchRequest = z.strictObject({
  items: z
    .array(
      z.strictObject({
        slug: slugSchema,
        // The version last read; the item fails, and the whole batch with it,
        // if the row has changed since. Leave it out to create or to overwrite.
        version: z.number().int().min(1).optional(),
        fields: z.record(z.string(), z.unknown()),
      }),
    )
    .min(1)
    .max(100),
});

const COLUMNS: Record<keyof typeof fields, string> = {
  company: 'company',
  role: 'role',
  location: 'location',
  pay: 'pay',
  experience: 'experience',
  tier: 'tier',
  rank: '`rank`',
  status: 'status',
  url: 'url',
  why: 'why',
  notes: 'notes',
  appliedOn: 'applied_on',
  ats: 'ats',
  found: 'found',
};

/** Joins a note onto the end of existing notes, with a space, as the tracker's notes read. */
export const appendNote = (notes: string | null, note: string) => (notes?.trim() ? `${notes.trim()} ${note}` : note);

/** A note added from the tracker page, dated like the rest. */
export const pageNote = (text: string) => `${today()} (page): ${text.trim()}`;

// Reads ---------------------------------------------------------------------

type Queryable = Pick<PoolConnection, 'query'>;

async function rowBySlug(conn: Queryable, slug: string, lock = false): Promise<Row | undefined> {
  const [result] = await conn.query<Row[]>(`SELECT * FROM applications WHERE slug = ?${lock ? ' FOR UPDATE' : ''}`, [slug]);
  return result[0];
}

export async function getApplication(slug: string): Promise<Application> {
  const row = await rowBySlug(db(), slug);
  if (!row) throw new ApiError(404, 'not_found', 'No application with that slug');
  return toApplication(row);
}

export const SORTS = {
  recent: { label: 'Recently updated', sql: 'updated_at DESC, id DESC' },
  applied: { label: 'Applied, newest', sql: 'applied_on IS NULL, applied_on DESC, id DESC' },
  oldest: { label: 'Applied, oldest', sql: 'applied_on IS NULL, applied_on ASC, id ASC' },
  rank: { label: 'Rank', sql: '`rank` IS NULL, `rank` ASC, id ASC' },
  company: { label: 'Company, A to Z', sql: 'company ASC, role ASC' },
} as const;
export type Sort = keyof typeof SORTS;

export const LOCATIONS = {
  remote: { label: 'Remote', sql: "location LIKE '%remote%'" },
  austin: { label: 'Austin', sql: "location LIKE '%austin%'" },
  elsewhere: { label: 'Elsewhere, on site', sql: "(location IS NULL OR (location NOT LIKE '%remote%' AND location NOT LIKE '%austin%'))" },
} as const;
export type LocationFilter = keyof typeof LOCATIONS;

export const PAGE_SIZES = [25, 50, 100] as const;

export interface Filters {
  q?: string | undefined;
  statuses?: Status[] | undefined;
  tier?: number | undefined;
  ats?: string | undefined;
  found?: string | undefined;
  location?: LocationFilter | undefined;
  appliedFrom?: string | undefined;
  appliedTo?: string | undefined;
  updatedSince?: string | undefined;
  sort?: Sort | undefined;
  page?: number | undefined;
  perPage?: number | undefined;
}

/**
 * Filters from a query string, shared by the page and the API. Strict mode
 * (the API) refuses bad values; the page just drops them.
 */
export function parseFilters(params: URLSearchParams, strict: boolean, defaults: { perPage: number }): Filters {
  const bad = (message: string) => {
    if (strict) throw new ApiError(422, 'invalid', message);
    return undefined;
  };
  const rawStatuses = params.getAll('status').filter(Boolean);
  const statuses = rawStatuses.filter((s): s is Status => (STATUSES as readonly string[]).includes(s));
  if (statuses.length !== rawStatuses.length) bad(`status is one of ${STATUSES.join(', ')}`);
  const int = (name: string) => {
    const raw = params.get(name);
    if (raw === null || raw === '') return undefined;
    return /^\d+$/.test(raw) ? Number(raw) : bad(`${name} is a whole number`);
  };
  const day = (name: string) => {
    const raw = params.get(name) || undefined;
    return !raw || (/^\d{4}-\d{2}-\d{2}$/.test(raw) && isDate(raw)) ? raw : bad(`${name} is a date as YYYY-MM-DD`);
  };
  const pick = <T extends string>(name: string, allowed: Record<T, unknown>) => {
    const raw = params.get(name) || undefined;
    return !raw || raw in allowed ? (raw as T | undefined) : bad(`${name} is one of ${Object.keys(allowed).join(', ')}`);
  };
  const since = params.get('since') || undefined;
  return {
    q: params.get('q')?.trim().slice(0, 200) || undefined,
    statuses,
    tier: int('tier'),
    ats: params.get('ats') || undefined,
    found: params.get('found') || undefined,
    location: pick<LocationFilter>('location', LOCATIONS),
    appliedFrom: day('appliedFrom'),
    appliedTo: day('appliedTo'),
    updatedSince: !since || !Number.isNaN(Date.parse(since)) ? since : bad('since is an ISO 8601 time'),
    sort: pick<Sort>('sort', SORTS),
    page: int('page'),
    perPage: int('perPage') ?? defaults.perPage,
  };
}

// The ATS column reads like "LinkedIn Easy Apply (Lever)" or "Greenhouse";
// filtering goes by its first word, the platform family.
export const atsFamily = (ats: string | null) => ats?.trim().split(/[\s(]/)[0] || 'Unknown';

function whereClause(filters: Filters): { sql: string; params: unknown[] } {
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (filters.q) {
    const like = `%${filters.q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    clauses.push('(company LIKE ? OR role LIKE ? OR location LIKE ? OR notes LIKE ? OR why LIKE ?)');
    params.push(like, like, like, like, like);
  }
  if (filters.statuses?.length) {
    clauses.push(`status IN (${filters.statuses.map(() => '?').join(', ')})`);
    params.push(...filters.statuses);
  }
  if (filters.tier) {
    clauses.push('tier = ?');
    params.push(filters.tier);
  }
  if (filters.ats) {
    if (filters.ats === 'Unknown') clauses.push("(ats IS NULL OR TRIM(ats) = '')");
    else {
      clauses.push("(ats = ? OR ats LIKE CONCAT(?, ' %') OR ats LIKE CONCAT(?, '(%'))");
      params.push(filters.ats, filters.ats, filters.ats);
    }
  }
  if (filters.found) {
    clauses.push('found = ?');
    params.push(filters.found);
  }
  if (filters.location) clauses.push(LOCATIONS[filters.location].sql);
  if (filters.appliedFrom) {
    clauses.push('applied_on >= ?');
    params.push(filters.appliedFrom);
  }
  if (filters.appliedTo) {
    clauses.push('applied_on <= ?');
    params.push(filters.appliedTo);
  }
  if (filters.updatedSince) {
    clauses.push('updated_at > ?');
    params.push(new Date(filters.updatedSince));
  }
  return { sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

export async function listApplications(filters: Filters, maxPerPage = 100): Promise<{ applications: Application[]; total: number; page: number; perPage: number; pages: number }> {
  const perPage = Math.min(Math.max(filters.perPage ?? 50, 1), maxPerPage);
  const where = whereClause(filters);
  const [count] = await rows<{ n: number }>(`SELECT COUNT(*) AS n FROM applications ${where.sql}`, where.params);
  const total = Number(count?.n ?? 0);
  const pages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(filters.page ?? 1, 1), pages);
  const order = SORTS[filters.sort ?? 'recent'].sql;
  const found = await rows<Row>(`SELECT * FROM applications ${where.sql} ORDER BY ${order} LIMIT ? OFFSET ?`, [...where.params, perPage, (page - 1) * perPage]);
  return { applications: found.map(toApplication), total, page, perPage, pages };
}

/** Rows per status across the whole tracker. */
export async function statusCounts(): Promise<Record<Status, number>> {
  const counts = Object.fromEntries(STATUSES.map((status) => [status, 0])) as Record<Status, number>;
  for (const row of await rows<{ status: Status; n: number }>('SELECT status, COUNT(*) AS n FROM applications GROUP BY status')) {
    counts[row.status] = Number(row.n);
  }
  return counts;
}

/** The values the page's filters offer, with how many rows have each. */
export async function filterOptions() {
  const tally = (pairs: { key: string; n: number }[]) => {
    const totals = new Map<string, number>();
    for (const { key, n } of pairs) totals.set(key, (totals.get(key) ?? 0) + Number(n));
    return [...totals].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  };
  const ats = await rows<{ ats: string | null; n: number }>('SELECT ats, COUNT(*) AS n FROM applications GROUP BY ats');
  const found = await rows<{ found: string | null; n: number }>('SELECT found, COUNT(*) AS n FROM applications WHERE found IS NOT NULL GROUP BY found');
  const tiers = await rows<{ tier: number; n: number }>('SELECT tier, COUNT(*) AS n FROM applications WHERE tier IS NOT NULL GROUP BY tier ORDER BY tier');
  return {
    ats: tally(ats.map((row) => ({ key: atsFamily(row.ats), n: row.n }))),
    found: tally(found.map((row) => ({ key: row.found!, n: row.n }))),
    tiers: tiers.map((row) => ({ value: row.tier, count: Number(row.n) })),
  };
}

// Writes --------------------------------------------------------------------

function columnsFor(input: Partial<Record<keyof typeof fields, unknown>>): Record<string, unknown> {
  const set: Record<string, unknown> = {};
  for (const [key, column] of Object.entries(COLUMNS) as [keyof typeof fields, string][]) {
    if (input[key] !== undefined) set[column.replaceAll('`', '')] = input[key];
  }
  return set;
}

async function insert(conn: Queryable, input: ApplicationCreate) {
  const set = columnsFor(input);
  await conn.query('INSERT INTO applications SET ?', [{ slug: input.slug, ...set }]);
}

// Applies a patch to a row read at `version`; the UPDATE names that version,
// so a concurrent edit can't be overwritten.
async function patchRow(conn: Queryable, row: Row, patch: ApplicationPatch, version: number) {
  const { appendNote: note, ...rest } = patch;
  const set = columnsFor(rest);
  if (note) set['notes'] = appendNote((rest.notes !== undefined ? rest.notes : row.notes) ?? null, note);
  if (!Object.keys(set).length) return;
  const [result] = await conn.query<ResultSetHeader>('UPDATE applications SET ?, version = version + 1 WHERE id = ? AND version = ?', [set, row.id, version]);
  if (!result.affectedRows) throw versionConflict();
}

export async function createApplication(input: ApplicationCreate): Promise<Application> {
  await insert(db(), input);
  return getApplication(input.slug);
}

/** Updates a row if it is still at `expected` (or at any version when that's undefined). */
export async function updateApplication(slug: string, patch: ApplicationPatch, expected?: number): Promise<Application> {
  const row = await rowBySlug(db(), slug);
  if (!row) throw new ApiError(404, 'not_found', 'No application with that slug');
  if (expected !== undefined && expected !== row.version) throw versionConflict();
  await patchRow(db(), row, patch, row.version);
  return getApplication(slug);
}

export async function deleteApplication(slug: string, expected?: number) {
  const row = await rowBySlug(db(), slug);
  if (!row) throw new ApiError(404, 'not_found', 'No application with that slug');
  const [result] = await db().query<ResultSetHeader>('DELETE FROM applications WHERE id = ? AND version = ?', [row.id, expected ?? row.version]);
  if (!result.affectedRows) throw versionConflict();
}

/**
 * Creates or patches up to 100 rows in one transaction: a row that exists is
 * patched (checked against `version` when given), one that doesn't is
 * created. Any failure rolls the whole batch back.
 */
export async function applyBatch(request: z.output<typeof BatchRequest>) {
  const conn = await db().getConnection();
  const results: { slug: string; action: 'created' | 'updated' | 'unchanged'; version: number }[] = [];
  try {
    await conn.beginTransaction();
    for (const [index, item] of request.items.entries()) {
      const at = (message: string) => `items.${index} (${item.slug}): ${message}`;
      const row = await rowBySlug(conn, item.slug, true);
      if (row) {
        if (item.version !== undefined && item.version !== row.version) throw new ApiError(412, 'version_conflict', at(`changed since version ${item.version}; it is at ${row.version}`));
        const patch = ApplicationPatch.parse(item.fields);
        await patchRow(conn, row, patch, row.version);
        const after = await rowBySlug(conn, item.slug);
        results.push({ slug: item.slug, action: after!.version === row.version ? 'unchanged' : 'updated', version: after!.version });
      } else {
        if (item.version !== undefined) throw new ApiError(404, 'not_found', at('no such row to update'));
        const parsed = ApplicationCreate.safeParse({ slug: item.slug, ...item.fields });
        if (!parsed.success) throw new ApiError(422, 'invalid', at(parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')));
        await insert(conn, parsed.data);
        results.push({ slug: item.slug, action: 'created', version: 1 });
      }
    }
    await conn.commit();
    return results;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// State documents -------------------------------------------------------------

export const stateKey = z.string().regex(/^[a-z0-9][a-z0-9_-]{0,99}$/);

export async function getState(key: string): Promise<{ value: unknown; version: number; updatedAt: string }> {
  const [row] = await rows<{ value: unknown; version: number; updated_at: Date }>('SELECT value, version, updated_at FROM tracker_state WHERE `key` = ?', [key]);
  if (!row) throw new ApiError(404, 'not_found', 'No state with that key');
  // MariaDB marks a JSON-checked column as JSON, so mysql2 may already have parsed it.
  const value = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
  return { value, version: row.version, updatedAt: new Date(row.updated_at).toISOString() };
}

/** Writes a state document, creating it at version 1 or replacing it if still at `expected`. */
export async function putState(key: string, value: unknown, expected?: number) {
  const json = JSON.stringify(value);
  if (json.length > 64_000) throw new ApiError(413, 'too_large', 'Keep state documents under 64 KB');
  const [existing] = await rows<{ version: number }>('SELECT version FROM tracker_state WHERE `key` = ?', [key]);
  if (!existing) {
    if (expected !== undefined) throw new ApiError(404, 'not_found', 'No state with that key');
    await db().query('INSERT INTO tracker_state (`key`, value) VALUES (?, ?)', [key, json]);
  } else {
    const version = expected ?? existing.version;
    const [result] = await db().query<ResultSetHeader>('UPDATE tracker_state SET value = ?, version = version + 1 WHERE `key` = ? AND version = ?', [json, key, version]);
    if (!result.affectedRows) throw versionConflict();
  }
  return getState(key);
}
