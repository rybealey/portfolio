// One tracker row by slug. PATCH changes only the fields sent (appendNote
// adds a sentence to the notes); DELETE removes the row. Both accept
// If-Match with the ETag from a GET, and refuse with 412 if the row changed.
import { etag, json, readJson, route, versionConflict } from '../../../../lib/api';
import { ApplicationPatch, deleteApplication, getApplication, updateApplication } from '../../../../lib/tracker';

/** The version If-Match names, if any (a bare number or a quoted ETag). */
function ifMatch(request: Request): number | undefined {
  const header = request.headers.get('if-match');
  if (!header || header === '*') return undefined;
  const version = Number(header.replace(/^W\//, '').replaceAll('"', ''));
  if (!Number.isInteger(version) || version < 1) throw versionConflict();
  return version;
}

export const GET = route(async ({ params }) => {
  const application = await getApplication(params.slug!);
  return json({ application }, 200, { ETag: etag(application.version) });
}, 'tracker');

export const PATCH = route(async ({ params, request }) => {
  const application = await updateApplication(params.slug!, await readJson(request, ApplicationPatch), ifMatch(request));
  return json({ application }, 200, { ETag: etag(application.version) });
}, 'tracker');

export const DELETE = route(async ({ params, request }) => {
  await deleteApplication(params.slug!, ifMatch(request));
  return json(null, 204);
}, 'tracker');
