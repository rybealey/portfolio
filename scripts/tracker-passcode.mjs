// Makes the job tracker's TRACKER_PASSCODE_HASH. Asks for the passcode twice
// without showing it, and prints only its scrypt hash, to paste into .env
// locally or into Setup Node.js App's environment variables on cPanel.
//
//   npm run tracker:passcode
//   npm run tracker:passcode -- --with-secret   (also prints a new TRACKER_SESSION_SECRET)
//
// The passcode itself is never written anywhere.
import { randomBytes } from 'node:crypto';
import { hashPasscode } from '../src/lib/tracker-crypto.ts';

if (!process.stdin.isTTY) {
  console.error('tracker-passcode: run this in a terminal, so the passcode can be typed without echoing.');
  process.exit(1);
}

function ask(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.setEncoding('utf8');
    stdin.resume();
    let value = '';
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off('data', onData);
          process.stdout.write('\n');
          resolve(value);
          return;
        }
        if (char === '\u0003') {
          process.stdout.write('\n');
          process.exit(130);
        }
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else value += char;
      }
    };
    stdin.on('data', onData);
  });
}

const passcode = await ask('New tracker passcode (8 or more characters): ');
if (passcode.length < 8) {
  console.error('tracker-passcode: use at least 8 characters.');
  process.exit(1);
}
if ((await ask('Type it again: ')) !== passcode) {
  console.error("tracker-passcode: the two didn't match. Nothing changed.");
  process.exit(1);
}
console.log(`\nTRACKER_PASSCODE_HASH=${await hashPasscode(passcode)}`);
if (process.argv.includes('--with-secret')) console.log(`TRACKER_SESSION_SECRET=${randomBytes(48).toString('base64url')}`);
console.log('\nSet these on the server, then restart the app. Keep the passcode somewhere safe; only its hash is stored.');
