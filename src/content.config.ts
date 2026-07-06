import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    role: z.string(),
    year: z.union([z.string(), z.number()]).transform(String),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    heroSketch: z.string().optional(),
    detailImages: z
      .array(z.object({ src: z.string(), alt: z.string().default('') }))
      .optional(),
    video: z.string().optional(),
    externalLink: z.string().optional(),
  }),
});

export const collections = { projects };
