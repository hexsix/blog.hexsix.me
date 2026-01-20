import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Base schema for common frontmatter fields
const baseSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  author: z.string().optional().default('hexsix'),
  categories: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  featuredImage: z.string().optional(),
  draft: z.boolean().optional().default(false),
});

// Code/Article collection - technical posts
const code = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/code' }),
  schema: baseSchema,
});

const article = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/article' }),
  schema: baseSchema.extend({
    resizeImages: z.boolean().optional(),
  }),
});

// Video collection - YouTube and Bilibili embeds
const video = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/video' }),
  schema: baseSchema.extend({
    youtube: z.string().optional(),
    bilibili: z.string().optional(),
    vimeo: z.string().optional(),
  }),
});

// Quote collection - short quotes
const quote = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/quote' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().optional().default('佚名'),
    categories: z.array(z.string()).optional().default(['一言']),
    tags: z.array(z.string()).optional().default(['一言']),
  }),
});

// Link collection - external links
const link = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/link' }),
  schema: baseSchema.extend({
    link: z.string().url(),
  }),
});

// Status collection - short status updates
const status = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/status' }),
  schema: z.object({
    date: z.coerce.date(),
    icon: z.string().optional(),
    showDate: z.boolean().optional().default(true),
  }),
});

// Page collection - static pages like About
const page = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/page' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    icon: z.string().optional(),
    featuredImage: z.string().optional(),
    menu: z.string().optional(),
    weight: z.number().optional(),
    showDate: z.boolean().optional().default(false),
  }),
});

// Gallery collection
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: baseSchema,
});

export const collections = {
  code,
  article,
  video,
  quote,
  link,
  status,
  page,
  gallery,
};
