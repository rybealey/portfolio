// When the site last changed: the later of the commit this build came from
// and the newest edit to a published case study or note. Content is posted
// without a deploy, so the commit date alone would go stale.
import { getCaseStudies } from './work';
import { getNotes } from './notes';
import { site } from '../data/site';

const committedAt = __SITE_COMMITTED_AT__ ? new Date(__SITE_COMMITTED_AT__) : undefined;

export async function lastUpdated(): Promise<Date | undefined> {
  const [studies, notes] = await Promise.all([getCaseStudies(), getNotes()]);
  const times = [
    ...(committedAt ? [committedAt.getTime()] : []),
    ...studies.map((study) => study.updatedAt.getTime()),
    ...notes.filter((note) => !note.data.draft).map((note) => note.updatedAt.getTime()),
  ];
  return times.length ? new Date(Math.max(...times)) : undefined;
}

/** "Oct 27, 2026", in Austin time. */
export const formatUpdated = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: site.timeZone });
