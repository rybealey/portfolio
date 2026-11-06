// POST /tracker/unlock: the passcode form on /tracker. A right passcode sets
// the signed cookie; wrong ones are counted per hashed IP and refused for a
// while after five in 15 minutes (src/lib/tracker-auth.ts).
import type { APIRoute } from 'astro';
import { checkPasscode, recordAttempt, redirect, setUnlocked, trackerConfigured, unlockOpen } from '../../lib/tracker-auth';
import { clientIp, fromThisSite, hashIp } from '../../lib/request';

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  if (!fromThisSite(request)) return new Response('Forbidden', { status: 403 });
  if (!trackerConfigured()) return redirect('/tracker');
  const ipHash = hashIp(clientIp(request, () => clientAddress) ?? 'unknown');
  if (!(await unlockOpen(ipHash))) return redirect('/tracker?e=limited');
  const form = await request.formData().catch(() => null);
  const passcode = String(form?.get('passcode') ?? '');
  const ok = passcode.length > 0 && passcode.length <= 200 && (await checkPasscode(passcode));
  await recordAttempt(ipHash, ok);
  if (!ok) return redirect('/tracker?e=wrong');
  setUnlocked(cookies);
  return redirect('/tracker');
};
