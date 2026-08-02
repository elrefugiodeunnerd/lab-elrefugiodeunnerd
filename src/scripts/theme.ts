/**
 * Dark/light toggle.
 *
 * Both schemes are first-class: with no stored preference the site follows
 * `prefers-color-scheme`. The toggle records an explicit override in
 * `localStorage`, which an inline `<head>` script re-applies before first paint
 * so there is never a flash of the wrong theme.
 */

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    // Private mode / storage disabled. Fall back to the system preference.
    return null;
  }
}

function activeTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return systemTheme();
}

function apply(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Preference just won't persist; the current page still updates.
  }
}

export function initTheme(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;

  const label = (theme: Theme): void => {
    const next = theme === 'dark' ? 'claro' : 'oscuro';
    button.setAttribute('aria-label', `Cambiar a modo ${next}`);
    button.setAttribute('title', `Cambiar a modo ${next}`);
  };

  label(activeTheme());

  button.addEventListener('click', () => {
    const next: Theme = activeTheme() === 'dark' ? 'light' : 'dark';
    apply(next);
    label(next);
  });

  // Track the OS while the user has no explicit override.
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (storedTheme() === null) label(systemTheme());
    });
}
