// Every Writing page reads notes through this module. Notes live in MariaDB
// and are read live, so a note posted from the iOS app shows up without a
// deploy. Bodies are Markdown, rendered here.
import { cached, rows } from './db';
import { renderMarkdown } from './markdown';
import { getCaseStudies, type CaseStudy } from './work';
import type { PreviewKind } from './link-preview';

export type TopicKey = 'billing' | 'web' | 'support' | 'build';
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

export const isTopic = (value: string): value is TopicKey => value in TOPICS;

/** How many notes /writing shows before pointing to the month archives. */
export const FEED_SIZE = 20;

/** An image served from the media table by /media/<sha256>.<ext>. */
export interface MediaRef {
  src: string;
  width: number | null;
  height: number | null;
}

export interface NotePreview {
  url: string;
  status: 'ok' | 'failed';
  host: string;
  siteName: string | null;
  title: string | null;
  description: string | null;
  kind: PreviewKind;
  image?: MediaRef | undefined;
}

export interface Note {
  /** The permalink slug, e.g. 2026-10-25-hourly-billing-math. */
  id: string;
  body: string;
  html: string;
  updatedAt: Date;
  data: {
    date: Date;
    topic: TopicKey;
    pinned: boolean;
    draft: boolean;
    link?: string | undefined;
    /** Missing when a linked URL hasn't been fetched yet. */
    preview?: NotePreview | undefined;
    caseStudy?: CaseStudy | undefined;
    image?: (MediaRef & { alt: string; caption: string | null }) | undefined;
  };
}

const EXTENSIONS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };
export const mediaPath = (sha: string, type: string) => `/media/${sha}.${EXTENSIONS[type] ?? 'bin'}`;
const media = (sha: string | null, type: string | null, width: number | null, height: number | null): MediaRef | undefined =>
  sha && type ? { src: mediaPath(sha, type), width, height } : undefined;

interface Row {
  slug: string;
  published_on: string;
  topic: TopicKey;
  body: string;
  pinned: number;
  status: 'draft' | 'published';
  link_url: string | null;
  image_alt: string | null;
  image_caption: string | null;
  updated_at: Date;
  lp_status: 'ok' | 'failed' | null;
  lp_host: string | null;
  lp_site_name: string | null;
  lp_title: string | null;
  lp_description: string | null;
  lp_kind: PreviewKind | null;
  pm_sha: string | null;
  pm_type: string | null;
  pm_width: number | null;
  pm_height: number | null;
  im_sha: string | null;
  im_type: string | null;
  im_width: number | null;
  im_height: number | null;
  cs_slug: string | null;
}

const QUERY = `
  SELECT n.slug, n.published_on, n.topic, n.body, n.pinned, n.status, n.link_url, n.image_alt, n.image_caption, n.updated_at,
         lp.status AS lp_status, lp.host AS lp_host, lp.site_name AS lp_site_name, lp.title AS lp_title,
         lp.description AS lp_description, lp.kind AS lp_kind,
         pm.sha256 AS pm_sha, pm.content_type AS pm_type, pm.width AS pm_width, pm.height AS pm_height,
         im.sha256 AS im_sha, im.content_type AS im_type, im.width AS im_width, im.height AS im_height,
         cs.slug AS cs_slug
  FROM notes n
  LEFT JOIN link_previews lp ON lp.url_hash = n.link_url_hash
  LEFT JOIN media pm ON pm.id = lp.image_media_id
  LEFT JOIN media im ON im.id = n.image_media_id
  LEFT JOIN case_studies cs ON cs.id = n.case_study_id
  WHERE n.status = 'published' OR ?
  ORDER BY n.published_on DESC, n.slug DESC`;

const loadNotes = () =>
  cached('notes', async () =>
    Promise.all(
      (await rows<Row>(QUERY, [import.meta.env.DEV])).map(async (row): Promise<{ note: Note; caseSlug: string | null }> => {
        const image = media(row.im_sha, row.im_type, row.im_width, row.im_height);
        const note: Note = {
          id: row.slug,
          body: row.body,
          html: await renderMarkdown(row.body),
          updatedAt: row.updated_at,
          data: {
            // DATE columns arrive as YYYY-MM-DD; keep them as UTC calendar days.
            date: new Date(`${row.published_on}T00:00:00Z`),
            topic: row.topic,
            pinned: Boolean(row.pinned),
            draft: row.status === 'draft',
            link: row.link_url ?? undefined,
            preview:
              row.link_url && row.lp_status
                ? {
                    url: row.link_url,
                    status: row.lp_status,
                    host: row.lp_host ?? '',
                    siteName: row.lp_site_name,
                    title: row.lp_title,
                    description: row.lp_description,
                    kind: row.lp_kind ?? 'large',
                    image: media(row.pm_sha, row.pm_type, row.pm_width, row.pm_height),
                  }
                : undefined,
            image: image && row.image_alt ? { ...image, alt: row.image_alt, caption: row.image_caption } : undefined,
          },
        };
        return { note, caseSlug: row.cs_slug };
      }),
    ),
  );

/** Newest first. Drafts show in `npm run dev` only. */
export async function getNotes(): Promise<Note[]> {
  // The attached case study is looked up on every read, not cached with the
  // note, so a note only shows a case study that /work/<slug> would show too,
  // even when the two caches were filled at different times.
  const [notes, studies] = await Promise.all([loadNotes(), getCaseStudies()]);
  return notes.map(({ note, caseSlug }) => {
    const caseStudy = caseSlug ? studies.find((study) => study.id === caseSlug) : undefined;
    return caseStudy ? { ...note, data: { ...note.data, caseStudy } } : note;
  });
}

export const permalink = (note: Note) => `/writing/${note.id}`;
/** The share card; the version query busts caches when the note changes. */
export const shareImage = (note: Note) => `/writing/${note.id}.png?v=${note.updatedAt.getTime().toString(36)}`;

// Dates are calendar days, so format them in UTC to keep Oct 25 from
// sliding to Oct 24 in Central time.
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
  return note.body
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
