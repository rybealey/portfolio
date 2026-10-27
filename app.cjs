// Passenger startup file for cPanel's "Setup Node.js App".
//
// Passenger loads startup files with require(), and Astro's server entry is an
// ES module, so this CommonJS shim imports it. The entry calls listen() itself;
// Passenger intercepts that call and routes requests to it, so the port only
// matters when running locally (`npm run preview`).
process.env.HOST ??= '127.0.0.1';
process.env.PORT ??= '4321';

// CloudLinux caps each process at 4 GB of address space, reserved or not.
// The share cards run satori, whose WebAssembly asks to reserve up to 4 GB
// per memory, so cap each memory at 512 MB; a card needs a few MB. The other
// two limits can't be set from here and go in the app's environment
// variables (see the README): MALLOC_ARENA_MAX=2 and
// NODE_OPTIONS=--disable-wasm-trap-handler.
require('node:v8').setFlagsFromString('--wasm-max-mem-pages=8192');
if (process.platform === 'linux' && !process.env.MALLOC_ARENA_MAX) {
  console.warn('MALLOC_ARENA_MAX is not set; on CloudLinux the app may run out of address space');
}

import('./dist/server/entry.mjs').catch((error) => {
  console.error('Failed to start the Astro server', error);
  process.exit(1);
});
