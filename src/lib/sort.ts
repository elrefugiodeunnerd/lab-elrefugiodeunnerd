import type { CollectionEntry } from 'astro:content';
import { STATUS_META } from './status';

export type Project = CollectionEntry<'proyectos'>;

/**
 * When a project was last touched.
 *
 * Explicit `updated` wins; otherwise the newest update in the log; otherwise the
 * start date. This means a project with a chronological log stays correctly
 * ordered without anyone maintaining a duplicate date in frontmatter.
 */
export function lastTouched(project: Project): Date {
  const { updated, updates, started } = project.data;
  if (updated) return updated;

  let newest = started;
  for (const update of updates) {
    if (update.date > newest) newest = update.date;
  }
  return newest;
}

/**
 * Default order: pinned first, then what's most alive, then most recently
 * touched. A generalisation of "active first, then newest to oldest" that needs
 * no special-casing as statuses are added.
 */
export function byWorkbenchOrder(a: Project, b: Project): number {
  if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;

  const weight =
    STATUS_META[a.data.status].weight - STATUS_META[b.data.status].weight;
  if (weight !== 0) return weight;

  const recency = lastTouched(b).getTime() - lastTouched(a).getTime();
  if (recency !== 0) return recency;

  // Stable, locale-aware tiebreak so build output is deterministic.
  return a.data.title.localeCompare(b.data.title, 'es');
}

export function sortProjects(projects: readonly Project[]): Project[] {
  return [...projects].sort(byWorkbenchOrder);
}

/** Categories present in the content, ordered for display. */
export function collectCategories(projects: readonly Project[]): string[] {
  const seen = new Set<string>();
  for (const project of projects) seen.add(project.data.category);
  return [...seen].sort((a, b) => a.localeCompare(b, 'es'));
}

/** `2026-03-14` → `14 mar 2026`. Used for every date on the page. */
const DATE_FORMAT = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return DATE_FORMAT.format(date);
}

/** Machine-readable `datetime` for `<time>`. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
