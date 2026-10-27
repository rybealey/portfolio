// Fetches link previews for notes whose link has none yet, and stores them
// (with their images) in the database. Run with --refresh to refetch every
// linked URL. The posting API will do the same for each note it saves.
import { connect } from './db.mjs';
import { ensureLinkPreview } from '../src/lib/link-preview-store.ts';

const db = await connect();
const refresh = process.argv.includes('--refresh');

const [rows] = await db.query(
  refresh
    ? 'SELECT DISTINCT link_url FROM notes WHERE link_url IS NOT NULL'
    : `SELECT DISTINCT n.link_url FROM notes n
       LEFT JOIN link_previews lp ON lp.url_hash = n.link_url_hash
       WHERE n.link_url IS NOT NULL AND lp.id IS NULL`,
);

const tally = { stored: 0, cached: 0, failed: 0 };
for (const { link_url: url } of rows) {
  const result = await ensureLinkPreview(db, url, { refresh });
  tally[result]++;
  console.log(`previews: ${result.padEnd(6)} ${url}`);
}
console.log(`previews: ${rows.length} links, ${tally.stored} stored, ${tally.failed} failed`);
await db.end();
