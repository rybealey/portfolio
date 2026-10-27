// Plumbing for the publishing API under /api/v1, which the iOS and macOS
// apps use to post, edit and delete notes and case studies: per-device token
// auth, JSON responses and errors, and the version check that stops one
// device from overwriting another's newer edit. Routes: src/pages/api/v1.
import { createHash } from 'node:crypto';
import type { APIContext, APIRoute } from 'astro';
import { z } from 'astro/zod';
import { db, rows } from './db';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export const notFound = (what: string) => new ApiError(404, 'not_found', `No ${what} with that slug`);

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: {
      ...(body === null ? {} : { 'Content-Type': 'application/json; charset=utf-8' }),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  });

export interface Token {
  id: number;
  name: string;
}

// Tokens are rb_ plus 32 random bytes in base64url (scripts/api-token.mjs).
// Only their SHA-256 is stored, so the lookup is by hash.
async function authenticate(request: Request): Promise<Token> {
  const presented = request.headers.get('authorization')?.match(/^Bearer (rb_[A-Za-z0-9_-]{43})$/)?.[1];
  if (!presented) throw new ApiError(401, 'unauthorized', 'Send a device token as Authorization: Bearer rb_…');
  const hash = createHash('sha256').update(presented).digest('hex');
  const [token] = await rows<Token>('SELECT id, name FROM api_tokens WHERE token_hash = ? AND revoked_at IS NULL', [hash]);
  if (!token) throw new ApiError(401, 'unauthorized', 'Unknown or revoked token');
  await db().query('UPDATE api_tokens SET last_used_at = NOW() WHERE id = ?', [token.id]);
  return token;
}

function errorResponse(error: unknown): Response {
  const body = (status: number, code: string, message: string, details?: unknown) =>
    json({ error: { code, message, ...(details ? { details } : {}) } }, status, status === 401 ? { 'WWW-Authenticate': 'Bearer' } : {});
  if (error instanceof ApiError) return body(error.status, error.code, error.message);
  if (error instanceof z.ZodError) {
    const details = error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
    return body(422, 'invalid', 'Some fields are invalid', details);
  }
  const sqlCode = (error as { code?: unknown }).code;
  if (sqlCode === 'ER_DUP_ENTRY') return body(409, 'conflict', 'That slug is already taken');
  console.error('API error', error);
  return body(500, 'server_error', 'Something went wrong on the server');
}

/** Wraps a route handler with token auth and JSON error responses. */
export const route =
  (handler: (context: APIContext, token: Token) => Promise<Response>): APIRoute =>
  async (context) => {
    try {
      return await handler(context, await authenticate(context.request));
    } catch (error) {
      return errorResponse(error);
    }
  };

export async function readJson<T extends z.ZodType>(request: Request, schema: T): Promise<z.output<T>> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    throw new ApiError(415, 'unsupported_media_type', 'Send JSON with Content-Type: application/json');
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ApiError(400, 'bad_json', 'The body is not valid JSON');
  }
  return schema.parse(body);
}

// Each note and case study has a version that every API edit raises by one.
// Responses carry it as an ETag; an edit or delete that sends it back as
// If-Match fails with 412 if the row changed since, e.g. from the other
// device. The write itself is conditional on the version too (WHERE version
// = ?), so two devices can't both pass the check.
export const etag = (version: number) => `"${version}"`;

export const versionConflict = () =>
  new ApiError(412, 'version_conflict', 'It changed since you loaded it; fetch it again and reapply your edit');

/** The version a write may apply to: the current one, if If-Match allows it. */
export function expectedVersion(request: Request, current: number): number {
  const ifMatch = request.headers.get('if-match');
  if (ifMatch && ifMatch !== '*' && ifMatch !== etag(current)) throw versionConflict();
  return current;
}

/** Today's date in Austin, as YYYY-MM-DD. */
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date());

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** The first few words of some Markdown, as a slug. */
export function slugify(markdown: string, words = 6): string {
  return markdown
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, words)
    .join('-');
}
