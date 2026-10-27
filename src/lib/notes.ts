// Every Writing page reads notes through this module. Notes come from
// Markdown files today; moving them to a database means changing getNotes()
// and leaving the pages alone.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;
export type TopicKey = Note['data']['topic'];
type Band = 'pink' | 'tangerine' | 'lime' | 'cyan' | 'violet';

export const TOPICS: Record<TopicKey, { label: string; band: Band; blurb: string; caseStudy?: string }> = {
  billing: {
    label: 'Billing',
    band: 'lime',
    blurb: 'Metering, ledgers and the math behind a fair bill, noted as the SERVERIZZ billing rebuild happens.',
    caseStudy: 'serverizz-billing',
  },
  web: {
    label: 'Web',
    band: 'cyan',
    blurb: 'Sites, design systems and the details that make a relaunch land.',
    caseStudy: 'serverizz-web',
  },
  support: {
    label: 'Support AI',
    band: 'violet',
    blurb: 'Support operations, and the AI agent that answers first.',
    caseStudy: 'fin-support-ops',
  },
  build: {
    label: 'Build',
    band: 'tangerine',
    blurb: 'How this site and the tools behind my work get built.',
  },
};

/** How many notes /writing shows before pointing to the month archives. */
export const FEED_SIZE = 20;

/** Newest first. Drafts show in `npm run dev` only. */
export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', (note) => import.meta.env.DEV || !note.data.draft);
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || b.id.localeCompare(a.id));
}

export const permalink = (note: Note) => `/writing/${note.id}`;
export const shareImage = (note: Note) => `/writing/${note.id}.png`;

// Dates are calendar days from front matter, so format them in UTC to keep
// Oct 25 from sliding to Oct 24 in Central time.
export const formatDate = (date: Date, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  date.toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });

export interface Month {
  year: string;
  month: string;
  label: string;
  href: string;
  notes: Note[];
}

/** Notes grouped into calendar months, newest month first. */
export function groupByMonth(notes: Note[]): Month[] {
  const months = new Map<string, Month>();
  for (const note of notes) {
    const year = String(note.data.date.getUTCFullYear());
    const month = String(note.data.date.getUTCMonth() + 1).padStart(2, '0');
    const key = `${year}/${month}`;
    if (!months.has(key)) {
      months.set(key, {
        year,
        month,
        label: formatDate(note.data.date, { month: 'long', year: 'numeric' }),
        href: `/writing/${key}`,
        notes: [],
      });
    }
    months.get(key)!.notes.push(note);
  }
  return [...months.values()];
}

export function topicCounts(notes: Note[]) {
  const counts = Object.fromEntries(Object.keys(TOPICS).map((key) => [key, 0])) as Record<TopicKey, number>;
  for (const note of notes) counts[note.data.topic]++;
  return counts;
}

/** The note as plain text, for share cards, RSS titles and meta descriptions. */
export function plainText(note: Note): string {
  return (note.body ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerpt(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}
