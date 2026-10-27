// Case studies, read from MariaDB. Pages use these instead of a content
// collection so a case study published from the Mac app shows up live.
import { cached, rows } from './db';

export interface CaseStudy {
  id: string;
  body: string;
  updatedAt: Date;
  data: {
    order: number;
    label: string;
    title: string;
    summary: string;
    role: string;
    timeframe: string;
    stack: string[];
    status: 'shipped' | 'live' | 'phased' | 'prototype' | 'in-progress';
    accent: 'billing' | 'web' | 'fin';
    metrics: string[];
  };
}

interface Row {
  slug: string;
  sort_order: number;
  label: string;
  title: string;
  summary: string;
  role: string;
  timeframe: string;
  stack: string | string[];
  status: CaseStudy['data']['status'];
  accent: CaseStudy['data']['accent'];
  metrics: string | string[];
  body: string;
  updated_at: Date;
}

// MariaDB returns JSON columns as strings.
const list = (value: string | string[]) => (typeof value === 'string' ? (JSON.parse(value) as string[]) : value);

const toCaseStudy = (row: Row): CaseStudy => ({
  id: row.slug,
  body: row.body,
  updatedAt: row.updated_at,
  data: {
    order: row.sort_order,
    label: row.label,
    title: row.title,
    summary: row.summary,
    role: row.role,
    timeframe: row.timeframe,
    stack: list(row.stack),
    status: row.status,
    accent: row.accent,
    metrics: list(row.metrics),
  },
});

/** Published case studies in their set order. */
export function getCaseStudies(): Promise<CaseStudy[]> {
  return cached('case-studies', async () =>
    (await rows<Row>('SELECT * FROM case_studies WHERE published = 1 ORDER BY sort_order, slug')).map(toCaseStudy),
  );
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  return (await getCaseStudies()).find((study) => study.id === slug);
}
