// POST /tracker/lock: forgets this browser's unlock cookie.
import type { APIRoute } from 'astro';
import { lock, redirect } from '../../lib/tracker-auth';
import { fromThisSite } from '../../lib/request';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!fromThisSite(request)) return new Response('Forbidden', { status: 403 });
  lock(cookies);
  return redirect('/tracker?e=locked');
};
