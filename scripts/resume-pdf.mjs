// Renders /resume/print, the one-page cut, to public/ry-bealey-resume.pdf with
// headless Chrome. Run it against a server that has the current build:
// npm run resume:pdf [-- http://localhost:4321]. The PDF must stay one page,
// so this fails if Chrome prints more than one.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const base = process.argv[2] ?? 'http://localhost:4321';
const chrome =
  process.env.CHROME_PATH ??
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((file) =>
    existsSync(file),
  );
if (!chrome) throw new Error('Chrome not found. Set CHROME_PATH to its executable.');

const out = fileURLToPath(new URL('../public/ry-bealey-resume.pdf', import.meta.url));
execFileSync(
  chrome,
  [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    // Tags headings, lists and reading order, which screen readers and some
    // applicant tracking systems use.
    '--export-tagged-pdf',
    // Gives the self-hosted fonts time to load before printing.
    '--virtual-time-budget=5000',
    `--print-to-pdf=${out}`,
    new URL('/resume/print', base).href,
  ],
  { stdio: 'inherit' },
);
const pages = readFileSync(out, 'latin1').match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;
if (pages !== 1) {
  console.error(`Wrote ${out}, but it has ${pages} pages. Trim the one-page cut in src/data/resume.ts.`);
  process.exit(1);
}
console.log(`Wrote ${out} (1 page)`);
