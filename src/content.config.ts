import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    publishedDate: z.string().or(z.date()).optional().default(() => new Date().toISOString().split('T')[0]),
    category: z.string().optional(),
  }),
});

const navigation = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/navigation' }),
  schema: z.object({
    name: z.string(),
    icon: z.string().default('🚀'),
    order: z.number().default(1),
    links: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
        tag: z.string().optional(),
        visible: z.boolean().default(true),
      })
    ).default([]),
  }),
});

export const collections = { posts, navigation };
