// Renders /resume's print view to public/ry-bealey-resume.pdf with headless
// Chrome, so the PDF is the page's own print layout. Run it against a server
// that has the current build: npm run resume:pdf [-- http://localhost:4321]
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
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
    // Gives the self-hosted fonts time to load before printing.
    '--virtual-time-budget=5000',
    `--print-to-pdf=${out}`,
    new URL('/resume', base).href,
  ],
  { stdio: 'inherit' },
);
console.log(`Wrote ${out}`);
