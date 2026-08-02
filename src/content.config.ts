import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { STATUSES } from './lib/status';

/**
 * The contract for every project on the workbench.
 *
 * Frontmatter *keys* are English (Astro/tooling convention); every *value* and
 * every label rendered from them is Spanish. Adding a project means creating
 * `src/content/proyectos/<slug>/index.md` and, ideally, dropping a `cover.*`
 * next to it. Nothing else — no registry to update, no route to add.
 */
const proyectos = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/proyectos',
    // `proyectos/arch-linux/index.md` → `arch-linux`. Explicit so the slug (and
    // therefore every deep link) never shifts if the loader's default changes.
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Free-form so new kinds of tinkering never need a code change. */
      category: z.string(),
      /** One or two sentences. This is the collapsed-card pitch, not a summary. */
      description: z.string(),
      status: z.enum(STATUSES),
      progress: z.number().int().min(0).max(100),
      started: z.date(),
      /** Omit and it's derived from the newest update, else from `started`. */
      updated: z.date().optional(),
      /**
       * `image()` gives us an optimised asset with intrinsic dimensions, which
       * is what lets the card reserve space and avoid layout shift.
       */
      cover: image().optional(),
      /** Alt text for the cover. Falls back to the title when absent. */
      coverAlt: z.string().optional(),
      pinned: z.boolean().default(false),
      tech: z.array(z.string()).default([]),
      links: z
        .array(z.object({ label: z.string(), url: z.string().url() }))
        .default([]),
      notes: z.array(z.string()).default([]),
      /** Chronological log. Rendered newest-first regardless of file order. */
      updates: z
        .array(z.object({ date: z.date(), text: z.string() }))
        .default([]),
    }),
});

export const collections = { proyectos };
