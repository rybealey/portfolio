import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    order: z.number().int().min(1),
    label: z.string(),
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    timeframe: z.string(),
    stack: z.array(z.string()).min(1),
    status: z.enum(['shipped', 'live', 'phased', 'prototype', 'in-progress']),
    accent: z.enum(['billing', 'web', 'fin']),
    metrics: z.array(z.string()).min(1).max(4),
  }),
});

// Microblog notes for /writing. The file name is the permalink slug, and
// starts with the date (2026-10-25-hourly-billing.md) so it never collides
// with a topic page. A note carries at most one attachment.
const notes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/notes' }),
  schema: ({ image }) =>
    z
      .object({
        date: z.coerce.date(),
        topic: z.enum(['billing', 'web', 'support', 'build']),
        pinned: z.boolean().default(false),
        /** Hidden from production builds; shown by `npm run dev`. */
        draft: z.boolean().default(false),
        /** A shared link, unfurled at build time by scripts/fetch-link-previews.mjs. */
        link: z.url().optional(),
        /** One of the case studies, shown as an internal card. */
        caseStudy: reference('work').optional(),
        image: image().optional(),
        imageAlt: z.string().optional(),
        imageCaption: z.string().optional(),
      })
      .refine((note) => [note.link, note.caseStudy, note.image].filter(Boolean).length <= 1, {
        message: 'A note can carry one attachment: link, caseStudy or image.',
      })
      .refine((note) => !note.image || note.imageAlt, { message: 'An image needs imageAlt.' }),
});

export const collections = { work, notes };
