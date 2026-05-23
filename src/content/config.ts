import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const langAwareId = ({ entry }: { entry: string }) =>
  entry.replace(/\.md$/, '');

const workSchema = z.object({
  title: z.string(),
  slug: z.string(),
  lang: z.enum(['en', 'es']),
  tag: z.string(),
  summary: z.string().max(280),
  year: z.number().int(),
  role: z.string(),
  tags: z.array(z.string()),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  vimeoUrl: z.string().url().optional(),
  order: z.number().int(),
  feature: z.boolean().default(false),
});

const experienceSchema = z.object({
  title: z.string(),
  slug: z.string(),
  lang: z.enum(['en', 'es']),
  role: z.string(),
  dates: z.string(),
  order: z.number().int(),
});

const educationSchema = z.object({
  institution: z.string(),
  slug: z.string(),
  lang: z.enum(['en', 'es']),
  degree: z.string(),
  dates: z.string(),
  meta: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  order: z.number().int(),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work', generateId: langAwareId }),
  schema: workSchema,
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience', generateId: langAwareId }),
  schema: experienceSchema,
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/education', generateId: langAwareId }),
  schema: educationSchema,
});

export const collections = { work, experience, education };
