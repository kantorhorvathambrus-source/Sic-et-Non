import { getCollection, type CollectionEntry } from 'astro:content';
import index from '../data/topics-index.json';
import { defaultLocale, isLocale, locales, topicPath, type Locale } from '../i18n';

export type TopicEntry = CollectionEntry<'topics'>;
export type TopicData = TopicEntry['data'];

/** A topic entry together with the locale its file lives in. */
export interface LocalisedTopic {
  entry: TopicEntry;
  locale: Locale;
}

export interface IndexedTopic {
  id: string;
  number: number;
  category: TopicData['category'];
  status: TopicData['status'];
  titles: Record<Locale, string>;
}

export const topicIndex = index as IndexedTopic[];

/** The order categories appear in, matching the plan for the twenty topics. */
export const categoryOrder: TopicData['category'][] = [
  'existence-of-god',
  'natural-science',
  'mind-and-will',
  'morality',
  'history-and-text',
  'faith-and-society',
];

/**
 * Entry ids look like "en/06-creation-or-evolution"; the first segment is the
 * locale. A file in an unknown directory is a content mistake, so it is dropped
 * rather than silently rendered under the default locale.
 */
function localeOf(entry: TopicEntry): Locale | null {
  const segment = entry.id.split('/')[0];
  return isLocale(segment) ? segment : null;
}

export async function getLocalisedTopics(): Promise<LocalisedTopic[]> {
  const entries = await getCollection('topics');
  const localised: LocalisedTopic[] = [];

  for (const entry of entries) {
    const locale = localeOf(entry);
    if (locale) localised.push({ entry, locale });
  }

  return localised.sort((a, b) => a.entry.data.number - b.entry.data.number);
}

export async function getTopicsForLocale(locale: Locale): Promise<TopicEntry[]> {
  const all = await getLocalisedTopics();
  return all.filter((item) => item.locale === locale).map((item) => item.entry);
}

/**
 * Where the same topic lives in each language. Locales that have no file yet
 * fall back to the locale's home page, so a switcher link is never dead.
 */
export async function alternatesForTopic(topicId: string): Promise<Record<Locale, string>> {
  const all = await getLocalisedTopics();
  const paths = {} as Record<Locale, string>;

  for (const locale of locales) {
    const match = all.find(
      (item) => item.locale === locale && item.entry.data.id === topicId,
    );
    paths[locale] = match
      ? topicPath(locale, match.entry.data.slug)
      : locale === defaultLocale
        ? '/'
        : `/${locale}`;
  }

  return paths;
}

/** Rough reading time, at 200 words a minute — the site targets 5 to 7 minutes. */
export function readingMinutes(topic: TopicData): number {
  const parts: string[] = [
    topic.title,
    topic.realQuestion,
    topic.settledCore ?? '',
    topic.whereItStands,
    topic.commonMistake,
  ];

  for (const side of topic.sides) {
    parts.push(side.label);
    for (const argument of side.arguments) {
      parts.push(argument.claim, argument.explanation);
      if (argument.quote) parts.push(argument.quote.text);
      if (argument.counter) {
        parts.push(argument.counter.objection, argument.counter.response ?? '');
        if (argument.counter.quote) parts.push(argument.counter.quote.text);
      }
    }
  }

  for (const position of topic.familyPositions ?? []) {
    parts.push(position.name, position.summary, position.scienceStanding);
    if (position.quote) parts.push(position.quote.text);
  }

  const words = parts.join(' ').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Column order. Sides are equal, so neither position gets a permanent home on
 * the left: odd-numbered topics lead with the Christian side, even-numbered
 * ones with the atheist side. The About page says so, and nothing else in the
 * layout distinguishes the two columns.
 */
export function orderedSides(topic: TopicData): TopicData['sides'] {
  const leading = topic.number % 2 === 1 ? 'theist' : 'atheist';
  return [...topic.sides].sort((a, b) =>
    a.position === leading ? -1 : b.position === leading ? 1 : 0,
  );
}
