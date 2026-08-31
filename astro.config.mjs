import { rename, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { defineConfig } from 'astro/config';

// Cloudflare Pages serves the closest 404.html walking up from the requested
// path, so /es/anything needs dist/es/404.html. Astro's directory build format
// writes dist/es/404/index.html instead — it special-cases only the root 404 —
// so the localised ones are moved into place after the build.
//
// Without this the Spanish, French, German and Hungarian 404s are dead weight:
// every miss under a language prefix falls through to the English page.
function localised404s() {
  return {
    name: 'localised-404s',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = dir.pathname;
        for (const entry of await readdir(root, { withFileTypes: true })) {
          if (!entry.isDirectory()) continue;
          const nested = join(root, entry.name, '404', 'index.html');
          try {
            await rename(nested, join(root, entry.name, '404.html'));
            await rm(join(root, entry.name, '404'), { recursive: true, force: true });
            logger.info(`moved ${entry.name}/404/index.html to ${entry.name}/404.html`);
          } catch {
            // No 404 in this directory; nothing to move.
          }
        }
      },
    },
  };
}

export default defineConfig({
  integrations: [localised404s()],
  site: 'https://sic-et-non.pages.dev',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'hu'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
