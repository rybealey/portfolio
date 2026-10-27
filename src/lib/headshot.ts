// The About page's portrait. Pages here render on demand, so Astro's image
// pipeline would encode it with sharp on every request, which is slow on a
// CPU-limited host. src/pages/headshot-[width].webp.ts writes these WebP
// sizes once at build time instead, and they're served as static files.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export const HEADSHOT_WIDTHS = [400, 640, 800] as const;

export const headshotUrl = (width: number) => `/headshot-${width}.webp`;

// Whichever src/assets/headshot.* exists, read from the project root, which
// is the working directory during a build.
export const headshotSource = (): string | undefined => {
  const dir = join(process.cwd(), 'src/assets');
  const file = readdirSync(dir).find((name) => /^headshot\.(jpe?g|png|webp|avif)$/.test(name));
  return file && join(dir, file);
};
