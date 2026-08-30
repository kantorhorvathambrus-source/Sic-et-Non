#!/usr/bin/env node
// Builds a non-English topic file from the English one plus a translation
// payload. Structure, ids, quote attribution and source URLs come from English,
// so the five files cannot drift apart; the payload supplies only prose.
//
//   node scripts/i18n-tools/build-locale.mjs <locale> <payload.json>
//
// Every quotation keeps the source wording in `original`, which the page shows
// underneath the translation in smaller type. Paraphrases (verified: false) get
// no `original`, because the sentence is ours, not the author's.

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname;
const [locale, payloadPath] = process.argv.slice(2);

if (!locale || !payloadPath) {
  console.error('usage: build-locale.mjs <locale> <payload.json>');
  process.exit(1);
}

const source = JSON.parse(
  await readFile(join(ROOT, 'src/content/topics/en/06-creation-or-evolution.json'), 'utf8'),
);
const t = JSON.parse(await readFile(payloadPath, 'utf8'));

function need(value, what) {
  if (value === undefined) throw new Error(`translation payload is missing ${what}`);
  return value;
}

function translateQuote(quote, text, workLabel) {
  if (!quote) return undefined;
  const out = { ...quote, text: need(text, 'a quote translation') };
  if (workLabel) out.work = workLabel;
  if (quote.verified) out.original = { text: quote.text, language: 'en' };
  return out;
}

const out = {
  ...source,
  slug: need(t.slug, 'slug'),
  title: need(t.title, 'title'),
  realQuestion: need(t.realQuestion, 'realQuestion'),
  settledCore: need(t.settledCore, 'settledCore'),
  glossary: source.glossary.map((entry, i) => ({
    term: need(t.glossary[i]?.term, `glossary[${i}].term`),
    definition: need(t.glossary[i]?.definition, `glossary[${i}].definition`),
  })),
  sides: source.sides.map((side, s) => ({
    ...side,
    label: need(t.sides[s]?.label, `sides[${s}].label`),
    arguments: side.arguments.map((argument, a) => {
      const tr = need(t.sides[s]?.arguments?.[a], `sides[${s}].arguments[${a}]`);
      if (tr.id !== argument.id) {
        throw new Error(`argument ${s}.${a}: payload id "${tr.id}" != source id "${argument.id}"`);
      }
      return {
        ...argument,
        claim: need(tr.claim, 'claim'),
        explanation: need(tr.explanation, 'explanation'),
        quote: translateQuote(argument.quote, tr.quote, tr.work),
        counter: argument.counter && {
          ...argument.counter,
          objection: need(tr.objection, 'counter.objection'),
          response: argument.counter.response ? need(tr.response, 'counter.response') : undefined,
        },
      };
    }),
  })),
  familyPositions: source.familyPositions.map((position, p) => {
    const tr = need(t.familyPositions[p], `familyPositions[${p}]`);
    if (tr.id !== position.id) {
      throw new Error(`position ${p}: payload id "${tr.id}" != source id "${position.id}"`);
    }
    return {
      ...position,
      name: need(tr.name, 'name'),
      heldBy: need(tr.heldBy, 'heldBy'),
      summary: need(tr.summary, 'summary'),
      scienceStanding: need(tr.scienceStanding, 'scienceStanding'),
      quote: translateQuote(position.quote, tr.quote, tr.work),
    };
  }),
  whereItStands: need(t.whereItStands, 'whereItStands'),
  commonMistake: need(t.commonMistake, 'commonMistake'),
  sources: source.sources.map((entry, i) => ({
    ...entry,
    ...(t.sources?.[i] ?? {}),
  })),
};

const target = join(ROOT, `src/content/topics/${locale}/06-creation-or-evolution.json`);
await writeFile(target, JSON.stringify(out, null, 2) + '\n');
console.log(`wrote ${locale}: ${out.slug}`);
