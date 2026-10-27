// One note by slug. PATCH changes only the fields sent; DELETE removes it.
// Both accept If-Match with the ETag from a GET to refuse stale edits.
import { etag, json, readJson, route } from '../../../../lib/api';
import { NotePatch, deleteNote, getNote, updateNote } from '../../../../lib/publish';

export const GET = route(async ({ params }) => {
  const { note, version } = await getNote(params.slug!);
  return json({ note }, 200, { ETag: etag(version) });
});

export const PATCH = route(async ({ params, request }) => {
  const { note, version } = await updateNote(params.slug!, await readJson(request, NotePatch), request);
  return json({ note }, 200, { ETag: etag(version) });
});

export const DELETE = route(async ({ params, request }) => {
  await deleteNote(params.slug!, request);
  return json(null, 204);
});
