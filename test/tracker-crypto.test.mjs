// The job tracker's passcode lock: hashing, the signed cookie and the
// rate-limit rule. Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UNLOCK_LIMITS, hashPasscode, signSession, unlockAllowed, verifyPasscode, verifySession } from '../src/lib/tracker-crypto.ts';

test('a passcode matches its own hash and nothing else', async () => {
  const hash = await hashPasscode('correct horse battery');
  assert.match(hash, /^scrypt\$32768\$8\$1\$[\w-]+\$[\w-]+$/);
  assert.equal(await verifyPasscode('correct horse battery', hash), true);
  assert.equal(await verifyPasscode('correct horse batterY', hash), false);
  assert.equal(await verifyPasscode('', hash), false);
});

test('two hashes of one passcode differ (random salt)', async () => {
  assert.notEqual(await hashPasscode('same'), await hashPasscode('same'));
});

test('a missing or malformed hash never matches', async () => {
  assert.equal(await verifyPasscode('anything', undefined), false);
  assert.equal(await verifyPasscode('anything', ''), false);
  assert.equal(await verifyPasscode('anything', 'scrypt$1$2$3$abc'), false);
  assert.equal(await verifyPasscode('anything', 'bcrypt$32768$8$1$abc$def'), false);
});

const secret = 'x'.repeat(48);

test('a signed session verifies until it expires', () => {
  const now = Date.now();
  const cookie = signSession(secret, now + 60_000);
  assert.equal(verifySession(secret, cookie, now), true);
  assert.equal(verifySession(secret, cookie, now + 60_001), false);
});

test('a tampered, re-signed or truncated cookie fails', () => {
  const now = Date.now();
  const cookie = signSession(secret, now + 60_000);
  const [payload, sig] = cookie.split('.');
  const forged = Buffer.from(JSON.stringify({ exp: now + 10 ** 12 })).toString('base64url');
  assert.equal(verifySession(secret, `${forged}.${sig}`, now), false);
  assert.equal(verifySession('y'.repeat(48), cookie, now), false);
  assert.equal(verifySession(secret, payload, now), false);
  assert.equal(verifySession(secret, `${cookie}.extra`, now), false);
  assert.equal(verifySession(undefined, cookie, now), false);
  assert.equal(verifySession(secret, undefined, now), false);
});

test('unlock tries stop at the limits', () => {
  assert.equal(unlockAllowed({ mine: 0, all: 0 }), true);
  assert.equal(unlockAllowed({ mine: UNLOCK_LIMITS.perIpPer15Min - 1, all: 0 }), true);
  assert.equal(unlockAllowed({ mine: UNLOCK_LIMITS.perIpPer15Min, all: 0 }), false);
  assert.equal(unlockAllowed({ mine: 0, all: UNLOCK_LIMITS.allPerHour }), false);
});
