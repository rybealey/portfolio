// The 1200x630 share card for each note: the image LinkedIn, X and iMessage
// show when a note's link is posted. Rendered on first request and kept in
// memory until the note changes; pages link it with a version query.
import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { TOPICS, excerpt, formatDate, getNotes, plainText, type Note } from '../../lib/notes';

// Satori reads WOFF but not WOFF2, so the cards use the Fontsource copies
// of the same faces. The server runs from the app root (Passenger's too).
const fontFile = (pkg: string, file: string) => readFile(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));
let fonts: Promise<Parameters<typeof satori>[1]['fonts']> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([
    fontFile('unbounded', 'unbounded-latin-700-normal.woff'),
    fontFile('atkinson-hyperlegible', 'atkinson-hyperlegible-latin-400-normal.woff'),
    fontFile('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'),
    fontFile('jetbrains-mono', 'jetbrains-mono-latin-700-normal.woff'),
  ]).then(([unbounded, atkinson, mono500, mono700]) => [
    { name: 'Unbounded', data: unbounded, weight: 700 as const, style: 'normal' as const },
    { name: 'Atkinson Hyperlegible', data: atkinson, weight: 400 as const, style: 'normal' as const },
    { name: 'JetBrains Mono', data: mono500, weight: 500 as const, style: 'normal' as const },
    { name: 'JetBrains Mono', data: mono700, weight: 700 as const, style: 'normal' as const },
  ]));

const SPECTRUM = ['#ff3d9a', '#ff8f2e', '#c8ff3c', '#33e3e8', '#a77bff'];
const BAND: Record<string, string> = { pink: '#ff3d9a', tangerine: '#ff8f2e', lime: '#c8ff3c', cyan: '#33e3e8', violet: '#a77bff' };

const el = (style: Record<string, unknown>, children?: unknown) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

function card(note: Note) {
  const topic = TOPICS[note.data.topic];
  const text = excerpt(plainText(note), 200);
  const size = text.length <= 120 ? 48 : text.length <= 170 ? 42 : 36;
  const mono = { fontFamily: 'JetBrains Mono', fontWeight: 700, letterSpacing: '0.14em', fontSize: 18 };

  return el({ width: 1200, height: 630, flexDirection: 'column', background: '#140c22', color: '#fff5fa' }, [
    el({ height: 12 }, SPECTRUM.map((color) => el({ flex: 1, background: color }))),
    el({ flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px 56px' }, [
      el({ alignItems: 'center', gap: 16, ...mono }, [
        el({ color: '#c8ff3c' }, `NOTE · ${formatDate(note.data.date).toUpperCase()}`),
        el({ alignItems: 'center', gap: 10, color: '#c7b6e2' }, [
          el({ width: 14, height: 14, borderRadius: 3, background: BAND[topic.band] }),
          topic.label.toUpperCase(),
        ]),
      ]),
      el({ fontFamily: 'Unbounded', fontWeight: 700, fontSize: size, lineHeight: 1.28, letterSpacing: '-0.01em', maxWidth: 1040 }, text),
      el({ alignItems: 'center', justifyContent: 'space-between' }, [
        el({ fontFamily: 'Unbounded', fontWeight: 700, fontSize: 26 }, 'Ry Bealey'),
        el({ fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 20, color: '#c7b6e2' }, 'ryanbealey.com/writing'),
      ]),
    ]),
  ]);
}

const rendered = new Map<string, { version: number; png: Uint8Array<ArrayBuffer> }>();

export const GET: APIRoute = async ({ params }) => {
  const note = (await getNotes()).find((n) => n.id === params.slug);
  if (!note) return new Response('Not found', { status: 404 });

  const version = note.updatedAt.getTime();
  let entry = rendered.get(note.id);
  if (!entry || entry.version !== version) {
    const svg = await satori(card(note) as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: await loadFonts() });
    entry = { version, png: new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()) };
    rendered.set(note.id, entry);
  }
  return new Response(entry.png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
  });
};
