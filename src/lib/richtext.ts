/**
 * A deliberately tiny markup for the content JSON.
 *
 *   [[natural selection]]                        the word is a technical term
 *   [[irreducibly complex|irreducible complexity]]   display the first, define the second
 *   blank line                                   paragraph break
 *
 * Definitions always live in the topic's `glossary`, never inline, so that a
 * term is defined once per topic and translated once per locale. The optional
 * second field is the glossary key, which lets the sentence keep its natural
 * grammar: English inflects the term, and German and Hungarian decline it.
 */

export type Token =
  | { kind: 'text'; value: string }
  | { kind: 'term'; label: string; definition: string };

const TERM = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

export type GlossaryMap = Map<string, string>;

export function buildGlossary(
  entries: ReadonlyArray<{ term: string; definition: string }> | undefined,
): GlossaryMap {
  const map: GlossaryMap = new Map();
  for (const entry of entries ?? []) {
    map.set(entry.term.toLocaleLowerCase(), entry.definition);
  }
  return map;
}

/** Splits on blank lines, then tokenises each paragraph. */
export function parseRichText(source: string, glossary: GlossaryMap): Token[][] {
  return source
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => tokenise(paragraph, glossary));
}

function tokenise(paragraph: string, glossary: GlossaryMap): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  for (const match of paragraph.matchAll(TERM)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      tokens.push({ kind: 'text', value: paragraph.slice(cursor, index) });
    }

    const label = match[1].trim();
    const key = (match[2] ?? match[1]).trim().toLocaleLowerCase();
    const definition = glossary.get(key);

    if (definition) {
      tokens.push({ kind: 'term', label, definition });
    } else {
      // No glossary entry: render the word plainly rather than an empty tooltip.
      // The build check reports it so it can be fixed in the content.
      tokens.push({ kind: 'text', value: label });
    }

    cursor = index + match[0].length;
  }

  if (cursor < paragraph.length) {
    tokens.push({ kind: 'text', value: paragraph.slice(cursor) });
  }

  return tokens;
}

/** Terms marked up with no glossary entry. Used by the build-time check. */
export function findUndefinedTerms(source: string, glossary: GlossaryMap): string[] {
  const missing: string[] = [];
  for (const match of source.matchAll(TERM)) {
    const key = (match[2] ?? match[1]).trim();
    if (!glossary.has(key.toLocaleLowerCase())) missing.push(key);
  }
  return missing;
}

/** Strips the markup, for plain-text contexts such as meta descriptions. */
export function toPlainText(source: string): string {
  return source.replace(TERM, (_m, label: string) => label).replace(/\s+/g, ' ').trim();
}
