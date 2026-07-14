import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  schema: z.object({
    status: z.enum(['shipped', 'in-progress', 'research', 'planned']),
    featured: z.boolean().default(true),
    title: z.string(),
    description: z.string(),
    longDescription: z.string().optional(),
    tags: z.array(z.string()),
    link: z.string(),
    repo: z.string().optional(),
    img_alt: z.string().optional(),
    imgSrc: z.string().optional(),
    sortOrder: z.number().default(0),
  }),
});

export const collections = {
  projects: projectsCollection,
};