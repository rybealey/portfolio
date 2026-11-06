// The job tracker's passcode lock, without any Astro imports so the tests
// (test/) and scripts/tracker-passcode.mjs can load it straight into Node.
// The passcode is stored only as an scrypt hash (TRACKER_PASSCODE_HASH); an
// unlocked browser carries a cookie signed with TRACKER_SESSION_SECRET.
import { createHmac, randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

const scryptAsync = (passcode: string, salt: Buffer, length: number, options: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(passcode, salt, length, options, (error, key) => (error ? reject(error) : resolve(key))),
  );

// N = 2^15 with r = 8 needs 32 MB per check: slow enough to blunt guessing,
// well inside the host's 4 GB address-space cap.
const N = 32_768;
const R = 8;
const P = 1;
const KEY_LENGTH = 32;
const maxmem = 64 * 1024 * 1024;

/** An scrypt hash of a passcode, as scrypt$N$r$p$salt$key (base64url). */
export async function hashPasscode(passcode: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(passcode, salt, KEY_LENGTH, { N, r: R, p: P, maxmem });
  return ['scrypt', N, R, P, salt.toString('base64url'), key.toString('base64url')].join('$');
}

/** True when the passcode matches the stored hash. A malformed hash never matches. */
export async function verifyPasscode(passcode: string, stored: string | undefined): Promise<boolean> {
  const parts = stored?.split('$');
  if (!parts || parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [n, r, p] = parts.slice(1, 4).map(Number);
  const salt = Buffer.from(parts[4]!, 'base64url');
  const expected = Buffer.from(parts[5]!, 'base64url');
  if (!n || !r || !p || !salt.length || expected.length !== KEY_LENGTH) return false;
  try {
    const key = await scryptAsync(passcode, salt, expected.length, { N: n, r, p, maxmem });
    return timingSafeEqual(key, expected);
  } catch {
    return false;
  }
}

export const SESSION_DAYS = 30;

const sign = (secret: string, payload: string) => createHmac('sha256', secret).update(payload).digest('base64url');

/** A cookie value that unlocks the tracker until `expiresAt` (ms since the epoch). */
export function signSession(secret: string, expiresAt: number): string {
  const payload = Buffer.from(JSON.stringify({ exp: expiresAt })).toString('base64url');
  return `${payload}.${sign(secret, payload)}`;
}

/** True when the cookie was signed with this secret and hasn't expired. */
export function verifySession(secret: string | undefined, value: string | undefined, now = Date.now()): boolean {
  if (!secret || !value) return false;
  const [payload, signature, extra] = value.split('.');
  if (!payload || !signature || extra !== undefined) return false;
  const expected = Buffer.from(sign(secret, payload));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: unknown };
    return typeof exp === 'number' && exp > now;
  } catch {
    return false;
  }
}

// Wrong passcodes allowed before the lock refuses more tries: per visitor in
// 15 minutes, and from everyone together in an hour.
export const UNLOCK_LIMITS = { perIpPer15Min: 5, allPerHour: 50 } as const;

/** Whether another try is allowed, given the recent failures counted from the database. */
export const unlockAllowed = (failures: { mine: number; all: number }) =>
  failures.mine < UNLOCK_LIMITS.perIpPer15Min && failures.all < UNLOCK_LIMITS.allPerHour;
