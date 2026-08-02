/**
 * Card expansion, hand-rolled.
 *
 * Design notes, because this replaces a native element and has to earn it:
 *
 * - The *visual* collapsed state is pure CSS, keyed on `html.js` +
 *   `data-expanded="false"` (both present in the server HTML). So the first
 *   paint is already correct — no flash of open cards, and no transition fires
 *   on load because nothing changes.
 * - With JS off, `html.no-js` never matches the collapse rule, so every panel
 *   renders open. Content is always in the DOM: nothing is lost, and crawlers
 *   see everything.
 * - `inert` is applied to collapsed panels here (JS-only, since CSS cannot do
 *   it). That takes their contents out of both the tab order and the
 *   accessibility tree — the part people usually get wrong when replacing
 *   `<details>`.
 * - Height animates via `grid-template-rows: 0fr -> 1fr`, so there is no JS
 *   measurement and no hardcoded max-height.
 */

const OPEN_CLASS = 'is-expanded';

interface Card {
  readonly root: HTMLElement;
  readonly toggle: HTMLButtonElement;
  readonly panel: HTMLElement;
  readonly slug: string;
}

function readCards(): Card[] {
  const cards: Card[] = [];
  for (const root of document.querySelectorAll<HTMLElement>('[data-project]')) {
    const toggle = root.querySelector<HTMLButtonElement>('.card__toggle');
    const panel = root.querySelector<HTMLElement>('.card__panel');
    const slug = root.dataset.project;
    if (toggle && panel && slug) cards.push({ root, toggle, panel, slug });
  }
  return cards;
}

function isExpanded(card: Card): boolean {
  return card.root.dataset.expanded === 'true';
}

function setExpanded(card: Card, expanded: boolean): void {
  card.root.dataset.expanded = String(expanded);
  card.root.classList.toggle(OPEN_CLASS, expanded);
  card.toggle.setAttribute('aria-expanded', String(expanded));

  if (expanded) {
    card.panel.removeAttribute('inert');
  } else {
    // If focus is inside the panel we are about to close, hand it back to the
    // toggle first — otherwise `inert` would drop focus to the document body
    // and the user would lose their place entirely.
    if (card.panel.contains(document.activeElement)) {
      card.toggle.focus();
    }
    card.panel.setAttribute('inert', '');
  }
}

/**
 * Reflect the most recently opened card in the URL so a card can be shared or
 * bookmarked. `replaceState` rather than assigning `location.hash`: no scroll
 * jump, and no history entry per click.
 */
function syncHash(slug: string, expanded: boolean): void {
  const current = decodeURIComponent(window.location.hash.slice(1));
  if (expanded) {
    history.replaceState(null, '', `#${encodeURIComponent(slug)}`);
  } else if (current === slug) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

export function initCards(): void {
  const cards = readCards();
  if (cards.length === 0) return;

  const bySlug = new Map(cards.map((card) => [card.slug, card]));

  // Sync the DOM to the state the CSS is already showing.
  for (const card of cards) setExpanded(card, isExpanded(card));

  for (const card of cards) {
    card.toggle.addEventListener('click', () => {
      const next = !isExpanded(card);
      setExpanded(card, next);
      syncHash(card.slug, next);
    });

    // Collapse button inside the panel.
    const collapseBtn = card.panel.querySelector<HTMLButtonElement>('[data-collapse]');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        setExpanded(card, false);
        syncHash(card.slug, false);
        // Return focus to the toggle so keyboard users land somewhere sensible.
        card.toggle.focus();
      });
    }
  }

  /** Open the card named in the URL, without animating it in. */
  const openFromHash = (scroll: boolean): void => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    const card = bySlug.get(slug);
    if (!card || isExpanded(card)) return;

    // Deep links should land already-open: animating here would fight the
    // scroll and leave the card half-height when it arrives.
    card.root.classList.add('no-transition');
    setExpanded(card, true);
    void card.root.offsetHeight; // flush the layout before re-enabling motion
    card.root.classList.remove('no-transition');

    if (scroll) {
      card.root.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  };

  openFromHash(true);
  window.addEventListener('hashchange', () => openFromHash(true));
}
