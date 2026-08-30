import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import de from './de.json';
import hu from './hu.json';

export const locales = ['en', 'es', 'fr', 'de', 'hu'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** BCP 47 tags for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  hu: 'hu',
};

/**
 * The path segment topics live under, localised. English has no locale prefix,
 * so /topics/... ; the others are /es/temas/... and so on.
 */
export const topicSegment: Record<Locale, string> = {
  en: 'topics',
  es: 'temas',
  fr: 'sujets',
  de: 'themen',
  hu: 'temak',
};

/** The About page's own slug, localised. */
export const aboutSlug: Record<Locale, string> = {
  en: 'about',
  es: 'acerca-de',
  fr: 'a-propos',
  de: 'ueber',
  hu: 'a-honlaprol',
};

const dictionaries: Record<Locale, Record<string, string>> = { en, es, fr, de, hu };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Returns a translator for the locale. Missing keys fall back to English and,
 * failing that, to the key itself, so a half-translated dictionary degrades
 * into readable English rather than into blank space.
 */
export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale];
  return function t(key: string, vars?: Record<string, string | number>): string {
    let value = dict[key] ?? dictionaries[defaultLocale][key] ?? key;
    if (vars) {
      for (const [name, replacement] of Object.entries(vars)) {
        value = value.replaceAll(`{${name}}`, String(replacement));
      }
    }
    return value;
  };
}

/** Prefixes a root-relative path with the locale, except for the default locale. */
export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return clean ? `${prefix}/${clean}` : prefix || '/';
}

export function homePath(locale: Locale): string {
  return localePath(locale);
}

export function aboutPath(locale: Locale): string {
  return localePath(locale, aboutSlug[locale]);
}

export function topicPath(locale: Locale, slug: string): string {
  return localePath(locale, `${topicSegment[locale]}/${slug}`);
}

export function mapPath(locale: Locale, slug: string): string {
  return localePath(locale, `${topicSegment[locale]}/${slug}/map`);
}
