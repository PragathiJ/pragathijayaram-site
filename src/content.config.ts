import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { GROUP_IDS } from './data/groups';

const articles = defineCollection({
	loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		group: z.enum(GROUP_IDS),
		type: z.enum(['investigation', 'guide', 'notes']),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		ogImage: z.string().optional(),
	}),
});

export const collections = { articles };
