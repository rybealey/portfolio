// Passenger startup file for cPanel's "Setup Node.js App".
//
// Passenger loads startup files with require(), and Astro's server entry is an
// ES module, so this CommonJS shim imports it. The entry calls listen() itself;
// Passenger intercepts that call and routes requests to it, so the port only
// matters when running locally (`npm run preview`).
process.env.HOST ??= '127.0.0.1';
process.env.PORT ??= '4321';

import('./dist/server/entry.mjs').catch((error) => {
  console.error('Failed to start the Astro server', error);
  process.exit(1);
});
