/**
 * Category + status filtering over server-rendered cards.
 *
 * Every project is in the HTML already; this only hides. That keeps the no-JS
 * path honest (the filter bar is `.js-only`, so with scripts off the bar is
 * hidden and every project shows) and makes filtering instant — no fetch, no
 * re-render.
 *
 * Active filters live in the URL (`?categoria=…&estado=…`) via `replaceState`,
 * so a filtered view survives a reload and can be shared.
 */

const ALL = 'todos';

interface Filters {
  categoria: string;
  estado: string;
}

function readFromUrl(): Filters {
  const params = new URLSearchParams(window.location.search);
  return {
    categoria: params.get('categoria') ?? ALL,
    estado: params.get('estado') ?? ALL,
  };
}

function writeToUrl(filters: Filters): void {
  const params = new URLSearchParams(window.location.search);

  for (const key of ['categoria', 'estado'] as const) {
    if (filters[key] === ALL) params.delete(key);
    else params.set(key, filters[key]);
  }

  const query = params.toString();
  const url = window.location.pathname + (query ? `?${query}` : '') + window.location.hash;
  history.replaceState(null, '', url);
}

export function initFilters(): void {
  const bar = document.querySelector<HTMLElement>('[data-filters]');
  const grid = document.querySelector<HTMLElement>('[data-grid]');
  if (!bar || !grid) return;

  const cards = [...grid.querySelectorAll<HTMLElement>('[data-project]')];
  const count = document.querySelector<HTMLElement>('[data-result-count]');
  const empty = document.querySelector<HTMLElement>('[data-empty-state]');
  const buttons = [...bar.querySelectorAll<HTMLButtonElement>('[data-filter]')];

  const filters = readFromUrl();

  const matches = (card: HTMLElement): boolean =>
    (filters.categoria === ALL || card.dataset.category === filters.categoria) &&
    (filters.estado === ALL || card.dataset.status === filters.estado);

  const render = (): void => {
    let visible = 0;
    for (const card of cards) {
      const show = matches(card);
      card.hidden = !show;
      if (show) visible += 1;
    }

    // `aria-pressed` on a toggle button: conveys "this filter is on" rather
    // than the "current page" meaning `aria-current` would imply.
    for (const button of buttons) {
      const group = button.dataset.filterGroup === 'estado' ? 'estado' : 'categoria';
      const value = button.dataset.filter ?? ALL;
      button.setAttribute('aria-pressed', String(filters[group] === value));
    }

    if (count) {
      count.textContent =
        visible === 1 ? '1 proyecto' : `${visible} proyectos`;
    }
    if (empty) empty.hidden = visible > 0;
  };

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const group = button.dataset.filterGroup === 'estado' ? 'estado' : 'categoria';
      const value = button.dataset.filter ?? ALL;
      // Clicking the active filter clears it — no separate reset needed.
      filters[group] = filters[group] === value ? ALL : value;
      render();
      writeToUrl(filters);
    });
  }

  render();
}
