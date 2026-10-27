// GET /api/v1/case-studies lists every case study, unpublished included, in
// their set order. POST creates one.
import { etag, json, readJson, route } from '../../../../lib/api';
import { CaseStudyCreate, createCaseStudy, listCaseStudies } from '../../../../lib/publish';

export const GET = route(async () => json({ caseStudies: await listCaseStudies() }));

export const POST = route(async ({ request }) => {
  const { caseStudy, version } = await createCaseStudy(await readJson(request, CaseStudyCreate));
  return json({ caseStudy }, 201, { Location: `/api/v1/case-studies/${caseStudy.slug}`, ETag: etag(version) });
});
