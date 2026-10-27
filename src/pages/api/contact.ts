// POST /api/contact: the contact modal's form (src/components/ContactModal.astro).
// Saves the message, then emails it through SMTP2Go when that's configured.
// See src/lib/contact.ts.
import type { APIRoute } from 'astro';
import { site } from '../../data/site';
import { ContactMessage, deliver, fieldErrors, hashIp, looksLikeSpam, rateLimited, saveMessage } from '../../lib/contact';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });

// Behind Passenger the socket address can be missing; the first
// X-Forwarded-For hop is the visitor when Apache set it.
function clientIp(request: Request, fallback: () => string): string | undefined {
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
const sameSite = (origin: string, host: string | null) => {
  try {
    const from = new URL(origin).host;
    return from === host || from === new URL(site.url).host;
  } catch {
    return false;
  }
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Only this site's own pages may post here.
  const origin = request.headers.get('origin');
  if (origin && !sameSite(origin, request.headers.get('host'))) return json({ error: { code: 'forbidden' } }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: { code: 'unsupported_media_type' } }, 415);

  const raw = await request.text();
  if (raw.length > 16_000) return json({ error: { code: 'too_large' } }, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: { code: 'bad_json' } }, 400);
  }

  const parsed = ContactMessage.safeParse(body);
  if (!parsed.success) return json({ error: { code: 'invalid', fields: fieldErrors(parsed.error) } }, 422);
  const input = parsed.data;

  const ip = clientIp(request, () => clientAddress);
  const ipHash = hashIp(ip ?? 'unknown');
  try {
    // Spam is kept, marked, and answered as if it worked, so bots learn nothing.
    if (looksLikeSpam(input)) {
      await saveMessage(input, ipHash, 'spam');
      return json({ ok: true });
    }
    if (await rateLimited(ip ? ipHash : undefined)) {
      return json({ error: { code: 'rate_limited', message: 'Too many messages from here in the last hour. Try again later.' } }, 429);
    }
    const id = await saveMessage(input, ipHash, 'received');
    await deliver(id, input);
    return json({ ok: true });
  } catch (error) {
    console.error('contact: could not save a message', error);
    return json({ error: { code: 'server_error' } }, 500);
  }
};
