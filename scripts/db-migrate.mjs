// Applies db/migrations/*.sql in name order, once each, recording what ran in
// schema_migrations. Safe to run on every deploy. Never edit a migration that
// has run anywhere; add a new numbered file instead.
import { readFile, readdir } from 'node:fs/promises';
import { connect } from './db.mjs';

const dir = new URL('../db/migrations/', import.meta.url);
const db = await connect();

await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
  name VARCHAR(200) NOT NULL PRIMARY KEY,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

const [rows] = await db.query('SELECT name FROM schema_migrations');
const applied = new Set(rows.map((row) => row.name));
const pending = (await readdir(dir)).filter((file) => file.endsWith('.sql') && !applied.has(file)).sort();

for (const file of pending) {
  const sql = await readFile(new URL(file, dir), 'utf8');
  // MariaDB commits DDL implicitly, so a migration that fails halfway must be
  // fixed by hand. Keep each file small.
  try {
    await db.query(sql);
  } catch (error) {
    console.error(`migrate: ${file} failed: ${error.sqlMessage ?? error.message}`);
    console.error('migrate: tables it created before the error are still there; drop them before rerunning.');
    process.exit(1);
  }
  await db.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
  console.log(`migrate: applied ${file}`);
}
console.log(pending.length ? `migrate: ${pending.length} applied` : 'migrate: up to date');
await db.end();
