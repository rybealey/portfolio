// Small JSON documents the tracker's automations keep, such as the mail
// check's progress (key: mailcheck). GET reads one; PUT replaces it with the
// request body, refusing with 412 if If-Match names an older version.
import { ApiError, etag, json, route, versionConflict } from '../../../../lib/api';
import { getState, putState, stateKey } from '../../../../lib/tracker';

function keyFrom(params: Record<string, string | undefined>) {
  const parsed = stateKey.safeParse(params['key']);
  if (!parsed.success) throw new ApiError(404, 'not_found', 'No state with that key');
  return parsed.data;
}

export const GET = route(async ({ params }) => {
  const state = await getState(keyFrom(params));
  return json(state, 200, { ETag: etag(state.version) });
}, 'tracker');

export const PUT = route(async ({ params, request }) => {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    throw new ApiError(415, 'unsupported_media_type', 'Send JSON with Content-Type: application/json');
  }
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw new ApiError(400, 'bad_json', 'The body is not valid JSON');
  }
  const header = request.headers.get('if-match');
  let expected: number | undefined;
  if (header && header !== '*') {
    expected = Number(header.replaceAll('"', ''));
    if (!Number.isInteger(expected) || expected < 1) throw versionConflict();
  }
  const state = await putState(keyFrom(params), value, expected);
  return json(state, 200, { ETag: etag(state.version) });
}, 'tracker');
