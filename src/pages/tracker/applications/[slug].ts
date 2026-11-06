// POST /tracker/applications/<slug>: the edit form inside a row on /tracker.
// Changes the status and appends a dated note, but only if the row is still
// at the version the page showed; otherwise the page says it changed.
import type { APIRoute } from 'astro';
import { ApiError } from '../../../lib/api';
import { STATUSES, pageNote, updateApplication, type ApplicationPatch, type Status } from '../../../lib/tracker';
import { isUnlocked, redirect } from '../../../lib/tracker-auth';
import { fromThisSite } from '../../../lib/request';

// Back to the page and filters the form came from, never anywhere else.
const back = (value: FormDataEntryValue | null, notice: string, slug: string) => {
  const raw = typeof value === 'string' && /^\/tracker(\?|$)/.test(value) ? value : '/tracker';
  const url = new URL(raw, 'https://x');
  url.searchParams.set('notice', notice);
  url.searchParams.set('row', slug);
  return `${url.pathname}${url.search}#row-${slug}`;
};

export const POST: APIRoute = async ({ request, cookies, params }) => {
  if (!fromThisSite(request)) return new Response('Forbidden', { status: 403 });
  if (!isUnlocked(cookies)) return redirect('/tracker');
  const slug = params.slug!;
  const form = await request.formData().catch(() => null);
  if (!form) return redirect('/tracker');
  const version = Number(form.get('version'));
  const status = String(form.get('status') ?? '');
  const note = String(form.get('note') ?? '').trim().slice(0, 5000);
  const patch: ApplicationPatch = {};
  // Only a changed status is written, so saving just a note leaves it alone.
  if ((STATUSES as readonly string[]).includes(status) && status !== form.get('current')) patch.status = status as Status;
  if (note) patch.appendNote = pageNote(note);
  try {
    await updateApplication(slug, patch, Number.isInteger(version) && version > 0 ? version : undefined);
    return redirect(back(form.get('return'), 'saved', slug));
  } catch (error) {
    if (error instanceof ApiError && error.status === 412) return redirect(back(form.get('return'), 'conflict', slug));
    if (error instanceof ApiError && error.status === 404) return redirect(back(form.get('return'), 'missing', slug));
    console.error('tracker: could not save a row', error);
    return redirect(back(form.get('return'), 'failed', slug));
  }
};
