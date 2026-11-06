// POST /api/v1/applications/batch: creates or patches up to 100 rows in one
// transaction, for imports and the mail check. Each item is
// { slug, version?, fields }: a row that exists is patched with `fields`
// (refused if it has moved past `version`), one that doesn't is created
// from them. Any failure rolls back every item.
import { json, readJson, route } from '../../../../lib/api';
import { BatchRequest, applyBatch } from '../../../../lib/tracker';

export const POST = route(async ({ request }) => json({ results: await applyBatch(await readJson(request, BatchRequest)) }), 'tracker');
