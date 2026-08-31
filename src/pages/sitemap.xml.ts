// The sitemap, built from the same route table as the pages themselves.
//
// Each entry carries its hreflang alternates, which is what tells a crawler
// that five URLs are one document in five languages rather than five thin
// pages. Only real translations are listed: see lib/topics.ts.
import type { APIRoute } from 'astro';
import { locales, htmlLang, aboutPath, homePath, type Locale } from '../i18n';
import { siteRoutes } from '../lib/routes';
import { translatedAlternatesForTopic } from '../lib/topics';

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('http://localhost/');
  const routes = await siteRoutes();

  // Pages that exist in every language share one set of alternates.
  const everywhere = (make: (locale: Locale) => string) =>
    Object.fromEntries(locales.map((code) => [code, make(code)])) as Record<Locale, string>;

  const entries: string[] = [];

  for (const route of routes) {
    const path = route.path ? `/${route.path}` : '/';
    let alternates: Partial<Record<Locale, string>>;

    if (route.kind === 'home') {
      alternates = everywhere(homePath);
    } else if (route.kind === 'about') {
      alternates = everywhere(aboutPath);
    } else {
      const translated = await translatedAlternatesForTopic(route.topicId!);
      alternates =
        route.kind === 'map'
          ? Object.fromEntries(Object.entries(translated).map(([c, p]) => [c, `${p}/map`]))
          : translated;
    }

    const links = locales
      .filter((code) => alternates[code])
      .map(
        (code) =>
          `    <xhtml:link rel="alternate" hreflang="${htmlLang[code]}" ` +
          `href="${escape(new URL(alternates[code]!, origin).href)}"/>`,
      );
    links.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" ` +
        `href="${escape(new URL(alternates.en ?? path, origin).href)}"/>`,
    );

    entries.push(
      `  <url>\n    <loc>${escape(new URL(path, origin).href)}</loc>\n${links.join('\n')}\n  </url>`,
    );
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
    `xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;

  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
