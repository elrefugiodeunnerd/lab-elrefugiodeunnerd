// @ts-check
import { defineConfig } from 'astro/config';

// El Cacharreo de un Nerd — https://lab.elrefugiodeunnerd.es
//
// Deployed to GitHub Pages on a custom apex-subdomain, so `base` stays at "/".
// (If this ever moves to a project path like `user.github.io/repo`, set `base`.)
//
// Fully static: no adapter, no server output. Every project is known at build
// time, so there is nothing to render on request.
export default defineConfig({
  site: 'https://lab.elrefugiodeunnerd.es',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // Emit `index.html` rather than `about.html`-style siblings.
    format: 'directory',
  },
});
