// Small request helpers shared by the site's own forms (the contact form and
// the job tracker's lock): who sent it, and whether it came from this site.
import { createHash } from 'node:crypto';
import { DB_PASSWORD } from 'astro:env/server';
import { site } from '../data/site';

// Behind Passenger the socket address can be missing; the first
// X-Forwarded-For hop is the visitor when Apache set it.
export function clientIp(request: Request, fallback: () => string): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) return forwarded;
  try {
    return fallback() || undefined;
  } catch {
    return undefined;
  }
}

// The Host the browser asked for, or the site's own domain. Astro's url.host
// can differ from both behind a proxy, so it isn't used here.
export const sameSite = (origin: string, host: string | null) => {
  try {
    const from = new URL(origin).host;
    return from === host || from === new URL(site.url).host;
  } catch {
    return false;
  }
};

/** True unless the request names an Origin that isn't this site. */
export const fromThisSite = (request: Request) => {
  const origin = request.headers.get('origin');
  return !origin || sameSite(origin, request.headers.get('host'));
};

// The IP is only kept hashed, salted with a server secret so the hashes
// can't be reversed from a list of addresses.
export const hashIp = (ip: string) => createHash('sha256').update(`${DB_PASSWORD}:${ip}`).digest('hex');
