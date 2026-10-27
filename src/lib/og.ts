// Share cards (1200x630) for pages without their own: the home page, About,
// Resume, Colophon, case studies, and the Writing index, topic and month
// pages. Notes keep their own cards (src/pages/writing/[slug].png.ts), in
// the same style. Cards are drawn from each page's own heading and
// description, never from the URL, so the endpoint can't be made to print
// arbitrary text. Rendered on first request and kept in memory per version.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { site } from '../data/site';
import { TOPICS, excerpt, formatDate, isTopic } from './notes';
import { getCaseStudies } from './work';

export interface Card {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  /** Changes when the card's content does, to bust share caches. */
  version: string;
}

const RV = { pink: '#ff3d9a', tangerine: '#ff8f2e', lime: '#c8ff3c', cyan: '#33e3e8', violet: '#a77bff' };
const CASE_ACCENT = { billing: RV.lime, web: RV.cyan, fin: RV.violet };
const SPECTRUM = Object.values(RV);

const STATIC: Record<string, Omit<Card, 'version'>> = {
  '/': {
    eyebrow: `${site.lane} · ${site.location}`,
    title: site.name,
    subtitle: 'I turn web, infrastructure and payments problems into specs, data models and working software, with AI as my build partner.',
    accent: RV.pink,
  },
  '/about': {
    eyebrow: 'About',
    title: 'I build the systems behind the front line.',
    subtitle: "Eight years on Apple's front line and more than ten running SERVERIZZ, now turning web, infrastructure and payments problems into working software with AI.",
    accent: RV.violet,
  },
  '/resume': {
    eyebrow: 'Resume',
    title: site.name,
    subtitle: 'AI Systems & Implementation · Product and Systems Design · Support Operations',
    accent: RV.tangerine,
  },
  '/colophon': {
    eyebrow: 'Colophon',
    title: 'Specced by me, built with AI, served from a server I run.',
    subtitle: 'How ryanbealey.com is made: Astro and Node, MariaDB on SERVERIZZ Grid, and the Ryvanse design system.',
    accent: RV.cyan,
  },
  '/writing': {
    eyebrow: 'Writing',
    title: 'Notes from the build',
    subtitle: 'Short, dated notes on web infrastructure, design, payments, support and building with AI.',
    accent: RV.lime,
  },
};

/** The card for a clean page path, or undefined when the page has none. */
export async function cardFor(path: string): Promise<Card | undefined> {
  const fixed = STATIC[path];
  if (fixed) return { ...fixed, version: '1' };

  const work = path.match(/^\/work\/([a-z0-9-]+)$/);
  if (work) {
    const study = (await getCaseStudies().catch(() => [])).find((s) => s.id === work[1]);
    if (!study) return undefined;
    return {
      eyebrow: `${study.data.number} · ${study.data.label} · Case study`,
      title: study.data.title,
      subtitle: study.data.summary,
      accent: CASE_ACCENT[study.data.accent],
      version: study.updatedAt.getTime().toString(36),
    };
  }

  const topic = path.match(/^\/writing\/([a-z]+)$/)?.[1];
  if (topic && isTopic(topic)) {
    const { label, blurb, band } = TOPICS[topic];
    return { eyebrow: `Writing · ${label}`, title: `${label} notes`, subtitle: blurb, accent: RV[band], version: '1' };
  }

  const month = path.match(/^\/writing\/(20\d\d)\/(0[1-9]|1[0-2])$/);
  if (month) {
    const label = formatDate(new Date(`${month[1]}-${month[2]}-01T00:00:00Z`), { month: 'long', year: 'numeric' });
    return { ...STATIC['/writing']!, eyebrow: 'Writing · Archive', title: `Notes from ${label}`, version: '1' };
  }
  return undefined;
}

/** Where a page's card is served: /og/home.png, /og/about.png, /og/work/<slug>.png. */
export const cardPath = (path: string, card: Card) => `/og${path === '/' ? '/home' : path}.png?v=${card.version}`;

/** The page path a card URL names, the reverse of cardPath. */
export const pagePath = (file: string) => {
  const path = `/${file.replace(/\.png$/, '')}`;
  return path === '/home' ? '/' : path;
};

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

const el = (style: Record<string, unknown>, children?: unknown) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

function layout(path: string, card: Card) {
  const size = card.title.length <= 24 ? 76 : card.title.length <= 48 ? 58 : card.title.length <= 80 ? 46 : 40;
  const where = `${new URL(site.url).host}${path === '/' ? '' : path}`;
  return el({ width: 1200, height: 630, flexDirection: 'column', background: '#140c22', color: '#fff5fa' }, [
    el({ height: 12 }, SPECTRUM.map((color) => el({ flex: 1, background: color }))),
    el({ flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px 56px' }, [
      el({ alignItems: 'center', gap: 14, fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 18, letterSpacing: '0.14em', color: card.accent }, [
        el({ width: 14, height: 14, borderRadius: 3, background: card.accent }),
        card.eyebrow.toUpperCase(),
      ]),
      el({ flexDirection: 'column', gap: 24 }, [
        el({ fontFamily: 'Unbounded', fontWeight: 700, fontSize: size, lineHeight: 1.15, letterSpacing: '-0.01em', maxWidth: 1056 }, card.title),
        el({ fontFamily: 'Atkinson Hyperlegible', fontSize: 28, lineHeight: 1.4, color: '#c7b6e2', maxWidth: 980 }, excerpt(card.subtitle, 150)),
      ]),
      el({ alignItems: 'center', justifyContent: 'space-between' }, [
        el({ fontFamily: 'Unbounded', fontWeight: 700, fontSize: 26 }, site.name),
        el({ fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 20, color: '#c7b6e2' }, where),
      ]),
    ]),
  ]);
}

const rendered = new Map<string, Uint8Array<ArrayBuffer>>();

export async function renderCard(path: string, card: Card): Promise<Uint8Array<ArrayBuffer>> {
  const key = `${path}@${card.version}`;
  let png = rendered.get(key);
  if (!png) {
    const svg = await satori(layout(path, card) as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: await loadFonts() });
    png = new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
    rendered.set(key, png);
  }
  return png;
}
