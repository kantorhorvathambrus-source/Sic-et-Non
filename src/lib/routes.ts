// The whole route table, in one place.
//
// The catch-all page builds from it and so does the sitemap, so a route cannot
// exist without being listed for crawlers, and the sitemap cannot list a page
// that was never built. scripts/seo-check.mjs verifies that against dist/.
import { aboutSlug, locales, localePath, searchSlug, topicSegment, type Locale } from '../i18n';
import { getLocalisedTopics } from './topics';

export type RouteKind = 'home' | 'about' | 'search' | 'topic' | 'map';

export interface Route {
  // The path with no leading slash; undefined for the English home page, which
  // is the site root.
  path: string | undefined;
  kind: RouteKind;
  locale: Locale;
  topicId?: string;
}

export async function siteRoutes(): Promise<Route[]> {
  const topics = await getLocalisedTopics();
  const routes: Route[] = [];

  for (const locale of locales) {
    const prefix = localePath(locale).replace(/^\//, '');
    routes.push({ path: prefix || undefined, kind: 'home', locale });
    routes.push({
      path: [prefix, aboutSlug[locale]].filter(Boolean).join('/'),
      kind: 'about',
      locale,
    });
    routes.push({
      path: [prefix, searchSlug[locale]].filter(Boolean).join('/'),
      kind: 'search',
      locale,
    });
  }

  for (const { entry, locale } of topics) {
    const base = [localePath(locale).replace(/^\//, ''), topicSegment[locale], entry.data.slug]
      .filter(Boolean)
      .join('/');
    routes.push({ path: base, kind: 'topic', locale, topicId: entry.data.id });
    routes.push({ path: `${base}/map`, kind: 'map', locale, topicId: entry.data.id });
  }

  return routes;
}
