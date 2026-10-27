// The sitemap, built per request so new case studies and notes appear as
// soon as they're published.
import type { APIRoute } from 'astro';
import { TOPICS, getNotes, groupByMonth, isTopic, permalink, topicCounts } from '../lib/notes';
import { getCaseStudies } from '../lib/work';
import { site } from '../data/site';

const STATIC_PAGES = ['/', '/about', '/resume', '/colophon', '/writing'];

export const GET: APIRoute = async () => {
  const [studies, notes] = await Promise.all([getCaseStudies(), getNotes()]);
  const counts = topicCounts(notes);
  const paths = [
    ...STATIC_PAGES,
    ...studies.map((study) => `/work/${study.id}`),
    ...Object.keys(TOPICS).filter((topic) => isTopic(topic) && counts[topic] > 0).map((topic) => `/writing/${topic}`),
    ...groupByMonth(notes).map((month) => month.href),
    ...notes.map(permalink),
  ];
  const urls = paths.map((path) => `<url><loc>${new URL(path, site.url).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
