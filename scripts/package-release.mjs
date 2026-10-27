// Bundles what the cPanel app root needs into release/ryanbealey.tar.gz.
// node_modules is left out on purpose: CloudLinux's Node.js selector keeps
// dependencies in its own virtualenv and symlinks them in on "Run NPM Install".
import { cp, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const out = new URL('release/ryanbealey/', root);

await rm(new URL('release/', root), { recursive: true, force: true });
await mkdir(out, { recursive: true });
// The database scripts ship too, so migrations run on the server. The seed
// script and the preview store it imports come along for the first import.
const files = [
  'dist',
  'app.cjs',
  'package.json',
  'package-lock.json',
  'db',
  'scripts/db.mjs',
  'scripts/db-migrate.mjs',
  'scripts/db-seed.mjs',
  'scripts/db-previews.mjs',
  'src/lib/link-preview.ts',
  'src/lib/link-preview-store.ts',
];
for (const path of files) {
  await cp(new URL(path, root), new URL(path, out), { recursive: true });
}

execFileSync('tar', ['-czf', 'ryanbealey.tar.gz', '-C', 'ryanbealey', '.'], { cwd: new URL('release/', root) });
console.log('release: wrote release/ryanbealey.tar.gz');
