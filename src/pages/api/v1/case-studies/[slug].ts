// One case study by slug. PATCH changes only the fields sent; DELETE removes
// it unless a note attaches it. Both accept If-Match with the ETag from a GET.
import { etag, json, readJson, route } from '../../../../lib/api';
import { CaseStudyPatch, deleteCaseStudy, getCaseStudyForApi, updateCaseStudy } from '../../../../lib/publish';

export const GET = route(async ({ params }) => {
  const { caseStudy, version } = await getCaseStudyForApi(params.slug!);
  return json({ caseStudy }, 200, { ETag: etag(version) });
});

export const PATCH = route(async ({ params, request }) => {
  const { caseStudy, version } = await updateCaseStudy(params.slug!, await readJson(request, CaseStudyPatch), request);
  return json({ caseStudy }, 200, { ETag: etag(version) });
});

export const DELETE = route(async ({ params, request }) => {
  await deleteCaseStudy(params.slug!, request);
  return json(null, 204);
});
