// Runs `astro build` with settings that keep it under CloudLinux's 4 GB
// address-space cap, which counts memory that is only reserved. glibc
// reserves 64 MB per thread, the build's Rust tools start a thread per CPU,
// and WebAssembly's trap handler reserves 10 GB on its own. They live here
// rather than in the deploy script so the build fits however it's started,
// cPanel's own Node.js tools included. Values already set win.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const astro = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const env = {
  MALLOC_ARENA_MAX: '2',
  RAYON_NUM_THREADS: '4',
  TOKIO_WORKER_THREADS: '4',
  UV_THREADPOOL_SIZE: '4',
  ...process.env,
};
if (!env.NODE_OPTIONS?.includes('--disable-wasm-trap-handler')) {
  env.NODE_OPTIONS = `--disable-wasm-trap-handler ${env.NODE_OPTIONS ?? ''}`.trim();
}

const { status, signal, error } = spawnSync(process.execPath, [astro, 'build', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
});
if (error) throw error;
if (signal) console.error(`astro build stopped by ${signal}`);
process.exit(status ?? 1);
