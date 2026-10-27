// GET /api/v1: checks a device token and lists the values the apps can pick
// from. See src/lib/api.ts and the README's Publishing API section.
import { json, route } from '../../../lib/api';
import { NOTE_STATUSES, TOPIC_KEYS } from '../../../lib/publish';
import { TOPICS } from '../../../lib/notes';
import { ACCENTS, CASE_STUDY_STATUSES } from '../../../lib/work';

export const GET = route(async (_context, token) =>
  json({
    device: token.name,
    site: import.meta.env.SITE,
    notes: {
      topics: TOPIC_KEYS.map((key) => ({ key, label: TOPICS[key].label })),
      statuses: NOTE_STATUSES,
      attachments: ['link', 'caseStudy', 'image'],
    },
    caseStudies: { statuses: CASE_STUDY_STATUSES, accents: ACCENTS },
    media: { types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'] },
  }),
);
