// Renders .github/banner.png, the README banner, with the same renderer and
// fonts as the note share cards. Rerun after changing the copy below:
//   node scripts/render-banner.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const root = new URL('../', import.meta.url);
const font = (pkg, file) => readFile(new URL(`node_modules/@fontsource/${pkg}/files/${file}`, root));

const WIDTH = 1280;
const HEIGHT = 640;
const SPECTRUM = ['#ff3d9a', '#ff8f2e', '#c8ff3c', '#33e3e8', '#a77bff'];

// The Ryvanse chevron: five bands, each a 144x240 arrow, overlapping by 96.
const chevron = `<svg xmlns="http://www.w3.org/2000/svg" width="336" height="240" viewBox="0 0 336 240">${SPECTRUM.map(
  (color, i) => `<polygon fill="${color}" transform="translate(${i * 48} 0)" points="0,0 48,0 144,120 48,240 0,240 96,120"/>`,
).join('')}</svg>`;

const el = (style, children) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

const tree = el({ width: WIDTH, height: HEIGHT, flexDirection: 'column', background: '#140c22', color: '#fff5fa', position: 'relative' }, [
  el({ height: 14 }, SPECTRUM.map((color) => el({ flex: 1, background: color }))),
  el({ flex: 1, flexDirection: 'column', justifyContent: 'center', gap: 28, padding: '0 88px' }, [
    el({ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 22, letterSpacing: '0.14em', color: '#c8ff3c' }, 'RYANBEALEY.COM · PORTFOLIO'),
    el({ fontFamily: 'Unbounded', fontWeight: 900, fontSize: 112, lineHeight: 0.95, letterSpacing: '-0.02em' }, 'Ry Bealey'),
    el(
      { fontFamily: 'Atkinson Hyperlegible', fontSize: 32, lineHeight: 1.4, color: '#fff5fa', maxWidth: 720 },
      'Web infrastructure, design and payments, turned into specs, data models and working software.',
    ),
    el({ gap: 16, marginTop: 8 }, [
      ...['ASTRO 7', 'MARIADB', 'PASSENGER'].map((label) =>
        el(
          { fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 18, letterSpacing: '0.14em', color: '#c8ff3c', border: '2px solid #4a3770', borderRadius: 6, padding: '8px 14px' },
          label,
        ),
      ),
    ]),
  ]),
  {
    type: 'img',
    props: {
      src: `data:image/svg+xml;base64,${Buffer.from(chevron).toString('base64')}`,
      width: 336,
      height: 240,
      style: { position: 'absolute', right: 72, bottom: 64 },
    },
  },
]);

const svg = await satori(tree, {
  width: WIDTH,
  height: HEIGHT,
  fonts: [
    { name: 'Unbounded', data: await font('unbounded', 'unbounded-latin-900-normal.woff'), weight: 900, style: 'normal' },
    { name: 'Atkinson Hyperlegible', data: await font('atkinson-hyperlegible', 'atkinson-hyperlegible-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'JetBrains Mono', data: await font('jetbrains-mono', 'jetbrains-mono-latin-700-normal.woff'), weight: 700, style: 'normal' },
  ],
});
const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH * 2 } }).render().asPng();
await mkdir(new URL('.github/', root), { recursive: true });
await writeFile(new URL('.github/banner.png', root), png);
console.log(`banner: wrote .github/banner.png (${WIDTH * 2}x${HEIGHT * 2})`);
