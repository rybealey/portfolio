// Creates, lists and revokes publishing API tokens, one per device.
//
//   npm run api:token -- create "Ry's iPhone"
//   npm run api:token -- list
//   npm run api:token -- revoke 3
//
// A new token is printed once and never stored; keep it in the device's
// Keychain. On cPanel, run it over SSH with the DB_ variables exported, as
// for migrations (see the README).
import { createHash, randomBytes } from 'node:crypto';
import { connect } from './db.mjs';

const [command, arg] = process.argv.slice(2);
const usage = 'usage: api-token create <name> | list | revoke <id>';

const db = await connect();
try {
  if (command === 'create' && arg) {
    const token = `rb_${randomBytes(32).toString('base64url')}`;
    const hash = createHash('sha256').update(token).digest('hex');
    const [result] = await db.query('INSERT INTO api_tokens (name, token_hash) VALUES (?, ?)', [arg, hash]);
    console.log(`api-token: created #${result.insertId} for ${arg}. Copy it now; it isn't shown again:\n\n${token}\n`);
  } else if (command === 'list') {
    const [rows] = await db.query('SELECT id, name, created_at, last_used_at, revoked_at FROM api_tokens ORDER BY id');
    if (!rows.length) console.log('api-token: no tokens yet');
    for (const row of rows) {
      const state = row.revoked_at ? `revoked ${row.revoked_at.toISOString()}` : `last used ${row.last_used_at?.toISOString() ?? 'never'}`;
      console.log(`#${row.id}  ${row.name}  created ${row.created_at.toISOString()}  ${state}`);
    }
  } else if (command === 'revoke' && arg) {
    const [result] = await db.query('UPDATE api_tokens SET revoked_at = NOW() WHERE id = ? AND revoked_at IS NULL', [Number(arg)]);
    console.log(result.affectedRows ? `api-token: revoked #${arg}` : `api-token: no active token #${arg}`);
  } else {
    console.error(usage);
    process.exitCode = 1;
  }
} finally {
  await db.end();
}
