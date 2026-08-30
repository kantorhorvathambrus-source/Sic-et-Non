#!/usr/bin/env node
/**
 * Build-time content check. Runs before every build; a failure stops the build.
 *
 * The rule it exists to enforce: a quotation on this site must be traceable.
 * Every quote needs an author, a work and a source URL, whether or not the exact
 * wording was confirmed. A missing quote is fine. An untraceable one is not.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT = join(ROOT, 'src/content/topics');

const errors = [];
const warnings = [];
let quoteCount = 0;
let paraphraseCount = 0;

function fail(file, path, message) {
  errors.push(`${file}\n    at ${path}\n    ${message}`);
}

function warn(file, path, message) {
  warnings.push(`${file}\n    at ${path}\n    ${message}`);
}

function checkQuote(file, path, quote) {
  quoteCount += 1;

  for (const field of ['text', 'author', 'work', 'sourceUrl']) {
    const value = quote[field];
    if (typeof value !== 'string' || value.trim() === '') {
      fail(file, path, `quote is missing "${field}". Every quote needs author + work + sourceUrl.`);
    }
  }

  if (typeof quote.year !== 'string' || quote.year.trim() === '') {
    fail(file, path, 'quote is missing "year".');
  }

  if (typeof quote.verified !== 'boolean') {
    fail(file, path, 'quote is missing "verified". State plainly whether the wording was confirmed.');
  }

  if (typeof quote.sourceUrl === 'string' && quote.sourceUrl.trim() !== '') {
    try {
      const url = new URL(quote.sourceUrl);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        fail(file, path, `sourceUrl is not a web address: ${quote.sourceUrl}`);
      }
    } catch {
      fail(file, path, `sourceUrl is not a valid URL: ${quote.sourceUrl}`);
    }
  }

  if (quote.verified === false) {
    paraphraseCount += 1;
    // A paraphrase must not be dressed as a quotation, in the data or the page.
    const text = String(quote.text ?? '').trim();
    if (/^["“«]/.test(text)) {
      fail(
        file,
        path,
        'an unverified quote is rendered as a paraphrase, so its text must not be wrapped in quotation marks.',
      );
    }
  }

  if (quote.original && typeof quote.original.text !== 'string') {
    fail(file, path, 'quote.original needs a "text" field carrying the source wording.');
  }
}

/**
 * Terms marked [[like this]] must have a glossary entry. Where a second field is
 * given it is the glossary key, so the sentence can inflect the word:
 * [[irreducibly complex|irreducible complexity]].
 */
function checkTerms(file, path, text, glossary, used) {
  for (const match of String(text).matchAll(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g)) {
    const key = (match[2] ?? match[1]).trim().toLocaleLowerCase();
    used.add(key);
    if (!glossary.has(key)) {
      fail(file, path, `term "${key}" is marked up but has no glossary entry.`);
    }
  }
}

async function jsonFiles(dir) {
  const found = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, item.name);
    if (item.isDirectory()) found.push(...(await jsonFiles(full)));
    else if (item.name.endsWith('.json') && !item.name.startsWith('_')) found.push(full);
  }
  return found;
}

const files = await jsonFiles(CONTENT);

if (files.length === 0) {
  console.error('No topic content files found under src/content/topics.');
  process.exit(1);
}

for (const full of files) {
  const file = relative(ROOT, full);
  let topic;

  try {
    topic = JSON.parse(await readFile(full, 'utf8'));
  } catch (error) {
    fail(file, 'file', `is not valid JSON: ${error.message}`);
    continue;
  }

  const glossary = new Set(
    (topic.glossary ?? []).map((item) => String(item.term).toLocaleLowerCase()),
  );
  const usedTerms = new Set();

  for (const field of ['realQuestion', 'whereItStands', 'commonMistake', 'settledCore']) {
    if (topic[field]) checkTerms(file, field, topic[field], glossary, usedTerms);
  }

  const seenArgumentIds = new Set();

  (topic.sides ?? []).forEach((side, s) => {
    (side.arguments ?? []).forEach((argument, a) => {
      const base = `sides[${s}].arguments[${a}]`;

      if (seenArgumentIds.has(argument.id)) {
        fail(file, base, `duplicate argument id "${argument.id}"; ids are used as anchors.`);
      }
      seenArgumentIds.add(argument.id);

      checkTerms(file, `${base}.explanation`, argument.explanation ?? '', glossary, usedTerms);
      if (argument.quote) checkQuote(file, `${base}.quote`, argument.quote);

      if (argument.counter) {
        checkTerms(file, `${base}.counter.objection`, argument.counter.objection ?? '', glossary, usedTerms);
        if (argument.counter.response) {
          checkTerms(file, `${base}.counter.response`, argument.counter.response, glossary, usedTerms);
        }
        if (argument.counter.quote) {
          checkQuote(file, `${base}.counter.quote`, argument.counter.quote);
        }
      }
    });
  });

  (topic.familyPositions ?? []).forEach((position, p) => {
    const base = `familyPositions[${p}]`;
    checkTerms(file, `${base}.summary`, position.summary ?? '', glossary, usedTerms);
    checkTerms(file, `${base}.scienceStanding`, position.scienceStanding ?? '', glossary, usedTerms);
    if (position.quote) checkQuote(file, `${base}.quote`, position.quote);
  });

  // A glossary entry nobody marked up is dead weight the reader never sees.
  for (const term of glossary) {
    if (!usedTerms.has(term)) {
      warn(file, 'glossary', `"${term}" is defined but never marked up in the text.`);
    }
  }

  // A settled-core topic must say what is settled, so rule 3 cannot be skipped.
  if (topic.status === 'settled-core' && !topic.settledCore) {
    fail(file, 'settledCore', "status is 'settled-core' but no settledCore statement is present.");
  }

  // Every source needs a working-looking URL.
  (topic.sources ?? []).forEach((source, i) => {
    try {
      new URL(source.url);
    } catch {
      fail(file, `sources[${i}]`, `source URL is missing or invalid: ${source.url}`);
    }
  });

  // Non-English files should carry the original wording under each translation.
  const locale = relative(CONTENT, full).split('/')[0];
  if (locale !== 'en') {
    const collect = [];
    for (const side of topic.sides ?? []) {
      for (const argument of side.arguments ?? []) {
        if (argument.quote) collect.push([`side quote (${argument.id})`, argument.quote]);
        if (argument.counter?.quote) {
          collect.push([`counter quote (${argument.id})`, argument.counter.quote]);
        }
      }
    }
    for (const position of topic.familyPositions ?? []) {
      if (position.quote) collect.push([`position quote (${position.id})`, position.quote]);
    }
    for (const [label, quote] of collect) {
      // A paraphrase is our own sentence, so there is no source wording to show
      // underneath it. Only real quotations need their original.
      if (quote.verified && !quote.original?.text) {
        warn(file, label, 'translated quote has no "original" wording to show underneath.');
      }
    }
  }
}

if (warnings.length > 0) {
  console.warn(`\nContent warnings (${warnings.length}):`);
  for (const warning of warnings) console.warn(`  - ${warning}`);
}

if (errors.length > 0) {
  console.error(`\nContent check failed (${errors.length} problem${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`  - ${error}`);
  console.error('');
  process.exit(1);
}

console.log(
  `Content check passed: ${files.length} file(s), ${quoteCount} quotation(s), ` +
    `${paraphraseCount} labelled paraphrase(s).`,
);
