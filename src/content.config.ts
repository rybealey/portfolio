import { defineCollection } from 'astro:content';
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
    status: z.enum(['shipped', 'live', 'prototype', 'in-progress']),
    accent: z.enum(['billing', 'web', 'fin']),
    metrics: z.array(z.string()).min(1).max(4),
  }),
});

export const collections = { work };
