// GET /api/v1/notes lists every note, drafts included, newest first.
// POST creates one and returns it with its permalink.
import { etag, json, readJson, route } from '../../../../lib/api';
import { NoteCreate, createNote, listNotes } from '../../../../lib/publish';

export const GET = route(async () => json({ notes: await listNotes() }));

export const POST = route(async ({ request }) => {
  const { note, version } = await createNote(await readJson(request, NoteCreate));
  return json({ note }, 201, { Location: `/api/v1/notes/${note.slug}`, ETag: etag(version) });
});
