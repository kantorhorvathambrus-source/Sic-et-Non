// Which JSON paths hold prose a translator may write, and which are untouchable.
//
// The boundary is declared by key name and applied by walking the English file,
// so a new prose field added to the schema is picked up here rather than being
// silently dropped. That is the whole point of the walk: the tool that this one
// replaced enumerated fields by hand, which is why it could not carry the
// `variants` prose when that block was introduced.

import { readFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = new URL('../../..', import.meta.url).pathname.replace(/\/$/, '');

// Prose. Everything else in the file is carried over from English byte for byte.
export const TRANSLATE = new Set([
  'title', 'realQuestion', 'settledCore', 'whereItStands', 'commonMistake',
  'label', 'gloss', 'term', 'definition',
  'claim', 'explanation', 'heldBy',
  'objection', 'response', 'sharedPremise',
  'oneLine', 'summary', 'changesTheObjection', 'againstSettledCore',
  'heading', 'text', 'note', 'singleVoice',
]);

// Carried over verbatim even though they are strings: ids, enums, metadata.
// `work` and `locator` are deliberately absent from both sets: they are printed
// next to the quotation, so a descriptive one is localised, but only through
// the tables in tables.mjs and never freehand.
export const FROZEN = new Set([
  'id', 'number', 'category', 'status', 'position', 'landsOn', 'objectionFrom',
  'from', 'activeHere', 'author', 'year', 'sourceUrl', 'verification',
  'sawWhat', 'url', 'locator', 'verifiedBy', 'verifiedOn', 'language',
]);

const leaf = (p) => p.split('.').pop().split('[')[0];

/** Prose paths, in document order, as [path, value] pairs. */
export function walk(node, prefix = '', out = []) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${prefix}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walk(v, `${prefix}.${k}`, out);
  } else if (typeof node === 'string') {
    // The stored English wording of a quotation is never translated.
    if (prefix.includes('.original.')) return out;
    if (TRANSLATE.has(leaf(prefix))) out.push([prefix, node]);
  }
  return out;
}

/** Every scalar in the document, keyed by path. */
export function flat(node, prefix = '', out = {}) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => flat(v, `${prefix}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) flat(v, `${prefix}.${k}`, out);
  } else {
    out[prefix] = node;
  }
  return out;
}

const parts = (path) =>
  path.replace(/\[/g, '.[').split('.').filter(Boolean);

export function getv(doc, path) {
  let cur = doc;
  for (const part of parts(path)) {
    cur = part.startsWith('[') ? cur[Number(part.slice(1, -1))] : cur[part];
  }
  return cur;
}

export function setv(doc, path, value) {
  const ps = parts(path);
  let cur = doc;
  for (const part of ps.slice(0, -1)) {
    cur = part.startsWith('[') ? cur[Number(part.slice(1, -1))] : cur[part];
  }
  const last = ps[ps.length - 1];
  if (last.startsWith('[')) cur[Number(last.slice(1, -1))] = value;
  else cur[last] = value;
}

/** Every quotation object in the document, as [path, quote] pairs. */
export function quotes(node, prefix = '', out = []) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => quotes(v, `${prefix}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    if ('verification' in node && 'author' in node) out.push([prefix, node]);
    for (const [k, v] of Object.entries(node)) quotes(v, `${prefix}.${k}`, out);
  }
  return out;
}

const dir = (lang) => join(ROOT, 'src/content/topics', lang);

/** The topic file for a locale and a zero-padded number. */
export function topicPath(lang, num) {
  const hit = readdirSync(dir(lang)).find((f) => f.startsWith(`${num}-`));
  if (!hit) throw new Error(`no topic ${num} in ${lang}`);
  return join(dir(lang), hit);
}

export const loadTopic = async (lang, num) =>
  JSON.parse(await readFile(topicPath(lang, num), 'utf8'));

/** The twenty zero-padded topic numbers. */
export const TOPICS = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, '0'));

// The locales this pipeline built and whose labels are registered in
// tables.mjs. `hu` is deliberately not here: it was translated by hand in
// earlier sessions, so its names, work titles and locators are not in the
// tables, and harvesting them automatically would record whatever the files
// happen to say rather than check it. Pass it explicitly to see what it would
// take: `check-locale.mjs hu`.
export const LOCALES = ['es', 'fr', 'de'];
