// Loads the job tracker from an export of its earlier home, a Claude
// artifact database, through the tracker API. The export is a folder of
// JSON files, one per row (<dir>/applications/<slug>.json, the row's fields
// at the top level) and optionally <dir>/mailcheck/state.json. Rows that
// already exist are overwritten with the export's values, so it is safe to
// rerun. The export holds personal notes: keep it in tmp/, never in git.
//
//   TRACKER_TOKEN=rb_… node scripts/tracker-import.mjs tmp/tracker-export --base http://localhost:4321
//   node scripts/tracker-import.mjs tmp/tracker-export --base https://ryanbealey.com --keychain ryanbealey-tracker
//
// The token needs the tracker scope (npm run api:token -- create <name> --scope tracker).
// With --keychain it is read from the macOS Keychain and never printed.
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const [, value] = args.splice(i, 2);
  return value;
};
const base = option('--base') ?? 'http://localhost:4321';
const keychain = option('--keychain');
const [dir] = args;
if (!dir) {
  console.error('usage: tracker-import <export dir> [--base URL] [--keychain service]');
  process.exit(1);
}
const token = keychain
  ? execFileSync('security', ['find-generic-password', '-s', keychain, '-w'], { encoding: 'utf8' }).trim()
  : process.env.TRACKER_TOKEN;
if (!token) {
  console.error('tracker-import: set TRACKER_TOKEN or pass --keychain <service>.');
  process.exit(1);
}

const api = async (method, path, body) => {
  const res = await fetch(new URL(path, base), {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${JSON.stringify(json?.error ?? json)}`);
  return json;
};

const FIELDS = ['company', 'role', 'location', 'pay', 'experience', 'tier', 'rank', 'status', 'url', 'why', 'notes', 'appliedOn', 'ats', 'found'];
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && !v.trim());
const warnings = [];

function fieldsFrom(slug, raw) {
  const data = { ...(raw.data && typeof raw.data === 'object' && !raw.company ? raw.data : raw) };
  // A few early rows recorded the date as "applied".
  if (blank(data.appliedOn) && !blank(data.applied)) data.appliedOn = data.applied;
  delete data.applied;
  const out = {};
  for (const key of Object.keys(data)) if (!FIELDS.includes(key) && key !== 'id') warnings.push(`${slug}: dropped unknown field ${key}`);
  for (const key of FIELDS) {
    const value = data[key];
    if (blank(value)) {
      if (key !== 'company' && key !== 'role' && key !== 'status') out[key] = null;
      continue;
    }
    if (key === 'tier' || key === 'rank') {
      const n = Number(value);
      out[key] = Number.isInteger(n) && n >= 0 ? n : null;
      if (out[key] === null) warnings.push(`${slug}: ${key} ${JSON.stringify(value)} is not a whole number; left empty`);
    } else if (key === 'url') {
      try {
        const url = new URL(String(value));
        out.url = /^https?:$/.test(url.protocol) ? url.href : null;
      } catch {
        out.url = null;
      }
      if (!out.url) warnings.push(`${slug}: url ${JSON.stringify(value)} is not a web address; left empty`);
    } else if (key === 'appliedOn') {
      out.appliedOn = /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? String(value) : null;
      if (!out.appliedOn) warnings.push(`${slug}: appliedOn ${JSON.stringify(value)} is not YYYY-MM-DD; left empty`);
    } else {
      out[key] = String(value);
    }
  }
  return out;
}

const rowsDir = join(dir, 'applications');
const files = (await readdir(rowsDir)).filter((f) => f.endsWith('.json')).sort();
const items = [];
for (const file of files) {
  const slug = basename(file, '.json');
  items.push({ slug, fields: fieldsFrom(slug, JSON.parse(await readFile(join(rowsDir, file), 'utf8'))) });
}
const tally = {};
for (const item of items) tally[item.fields.status] = (tally[item.fields.status] ?? 0) + 1;

let created = 0;
let updated = 0;
for (let i = 0; i < items.length; i += 100) {
  const { results } = await api('POST', '/api/v1/applications/batch', { items: items.slice(i, i + 100) });
  for (const r of results) r.action === 'created' ? created++ : updated++;
}
console.log(`tracker-import: ${items.length} rows from the export; ${created} created, ${updated} updated or unchanged.`);

const statePath = join(dir, 'mailcheck', 'state.json');
const state = await readFile(statePath, 'utf8').then(JSON.parse, () => null);
if (state) {
  await api('PUT', '/api/v1/tracker-state/mailcheck', state.data && !state.lastInboxUid ? state.data : state);
  console.log('tracker-import: mailcheck state written.');
}

// Count what the server now holds, to compare with the export.
const server = {};
let total = 0;
for (let page = 1, pages = 1; page <= pages; page++) {
  const list = await api('GET', `/api/v1/applications?perPage=1000&page=${page}`);
  pages = list.pages;
  total = list.total;
  for (const a of list.applications) server[a.status] = (server[a.status] ?? 0) + 1;
}
console.log(`tracker-import: the server holds ${total} rows.`);
for (const status of Object.keys({ ...tally, ...server }).sort()) {
  const mark = (tally[status] ?? 0) === (server[status] ?? 0) ? 'ok' : 'differs';
  console.log(`  ${status}: export ${tally[status] ?? 0}, server ${server[status] ?? 0} (${mark})`);
}
if (warnings.length) console.log(`\n${warnings.length} warnings:\n  ${warnings.join('\n  ')}`);
