// The job tracker's rows. GET lists them, filtered and paged like the
// /tracker page: ?q=, ?status= (repeatable), ?tier=, ?ats= (platform, e.g.
// Greenhouse), ?found=, ?location=remote|austin|elsewhere, ?appliedFrom=,
// ?appliedTo=, ?since= (rows updated after an ISO time), ?sort=, ?page=,
// ?perPage= (up to 1000, default 100). POST creates one row. Needs a token
// with the tracker scope.
import { etag, json, readJson, route } from '../../../../lib/api';
import { ApplicationCreate, createApplication, listApplications, parseFilters } from '../../../../lib/tracker';

export const GET = route(async ({ url }) => json(await listApplications(parseFilters(url.searchParams, true, { perPage: 100 }), 1000)), 'tracker');

export const POST = route(async ({ request }) => {
  const application = await createApplication(await readJson(request, ApplicationCreate));
  return json({ application }, 201, { ETag: etag(application.version), Location: `/api/v1/applications/${application.slug}` });
}, 'tracker');
