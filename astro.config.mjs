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

/*
  One source of truth for the origin, because canonical URLs, hreflang, the
  sitemap and robots.txt all derive from it and a wrong one poisons all four.

  SITE_URL wins, so a custom domain is a dashboard setting rather than a commit.
  CF_PAGES_URL is kept for a build on Cloudflare Pages, which sets it. The
  literal is the local-development fallback and nothing else.

  Workers Builds injects no URL at all -- only CI, WORKERS_CI,
  WORKERS_CI_BUILD_UUID, WORKERS_CI_COMMIT_SHA and WORKERS_CI_BRANCH -- and a
  worker's own hostname is <name>.<account subdomain>.workers.dev, which this
  repository cannot know. So on Workers CI the origin has to be supplied, and a
  build that does not supply it fails here rather than shipping a site whose
  every canonical URL points at a host that is not serving it. That mistake is
  invisible in the output: every URL would be consistent, and uniformly wrong.
*/
const buildingOnWorkersCI = process.env.WORKERS_CI === '1';
if (buildingOnWorkersCI && !process.env.SITE_URL) {
  throw new Error(
    'SITE_URL is required when building on Workers Builds: Cloudflare injects no ' +
      'URL variable, so the origin cannot be derived. Set SITE_URL to the origin ' +
      'this Worker is served from (its workers.dev hostname, or your custom ' +
      'domain) under the Worker > Settings > Variables and Secrets.',
  );
}

const siteUrl = (
  process.env.SITE_URL ??
  process.env.CF_PAGES_URL ??
  'https://sic-et-non.pages.dev'
).replace(/\/+$/, '');

export default defineConfig({
  integrations: [localised404s()],
  site: siteUrl,
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
