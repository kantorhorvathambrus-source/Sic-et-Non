import type { APIContext } from 'astro';

/*
  Generated rather than kept in public/, where its Sitemap: line was a second
  hardcoded copy of the origin and could disagree with the one the sitemap
  itself uses. Both now come from astro.config's `site`; scripts/seo-check.mjs
  fails the build if they ever differ.
*/
export function GET({ site }: APIContext): Response {
  const origin = String(site).replace(/\/+$/, '');
  const body = `# Sic et Non — a static site. Everything here is meant to be read and indexed.
User-agent: *
Allow: /

# Pagefind's index is machine-readable data behind the on-page search; there is
# nothing in it that is not already in the pages themselves.
Disallow: /pagefind/

Sitemap: ${origin}/sitemap.xml
`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
