// The passcode lock in front of /tracker. The passcode itself is never
// stored, only its scrypt hash (TRACKER_PASSCODE_HASH, made with
// `npm run tracker:passcode`). Unlocking sets a signed, HttpOnly cookie that
// lasts 30 days; changing TRACKER_SESSION_SECRET locks every browser again.
// Without both variables set, the tracker stays locked for everyone.
import type { AstroCookies } from 'astro';
import { TRACKER_PASSCODE_HASH, TRACKER_SESSION_SECRET } from 'astro:env/server';
import { db, rows } from './db';
import { SESSION_DAYS, signSession, unlockAllowed, verifyPasscode, verifySession } from './tracker-crypto';

const COOKIE = 'rb_tracker';
const PATH = '/tracker';

export const trackerConfigured = () => Boolean(TRACKER_PASSCODE_HASH && (TRACKER_SESSION_SECRET?.length ?? 0) >= 32);

export const isUnlocked = (cookies: AstroCookies) => trackerConfigured() && verifySession(TRACKER_SESSION_SECRET, cookies.get(COOKIE)?.value);

export const checkPasscode = (passcode: string) => verifyPasscode(passcode, TRACKER_PASSCODE_HASH);

export function setUnlocked(cookies: AstroCookies) {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  cookies.set(COOKIE, signSession(TRACKER_SESSION_SECRET!, Date.now() + maxAge * 1000), {
    path: PATH,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge,
  });
}

export const lock = (cookies: AstroCookies) => cookies.delete(COOKIE, { path: PATH, httpOnly: true, secure: true, sameSite: 'strict' });

/** Wrong passcodes lately, from this visitor (15 minutes) and from everyone (an hour). */
export async function unlockOpen(ipHash: string): Promise<boolean> {
  const [mine] = await rows<{ n: number }>('SELECT COUNT(*) AS n FROM tracker_unlock_attempts WHERE ip_hash = ? AND ok = 0 AND created_at > NOW() - INTERVAL 15 MINUTE', [ipHash]);
  const [all] = await rows<{ n: number }>('SELECT COUNT(*) AS n FROM tracker_unlock_attempts WHERE ok = 0 AND created_at > NOW() - INTERVAL 1 HOUR');
  return unlockAllowed({ mine: Number(mine?.n ?? 0), all: Number(all?.n ?? 0) });
}

export async function recordAttempt(ipHash: string, ok: boolean) {
  await db().query('INSERT INTO tracker_unlock_attempts (ip_hash, ok) VALUES (?, ?)', [ipHash, ok ? 1 : 0]);
  // Old tries only matter for a day.
  await db().query('DELETE FROM tracker_unlock_attempts WHERE created_at < NOW() - INTERVAL 1 DAY');
}

/** Headers for every /tracker response: never cached or indexed. */
export const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  // same-origin, not no-referrer: with no-referrer, browsers send Origin: null
  // on the page's own form posts, which the same-site check then refuses.
  'Referrer-Policy': 'same-origin',
} as const;

export const redirect = (location: string) => new Response(null, { status: 303, headers: { ...PRIVATE_HEADERS, Location: location } });
