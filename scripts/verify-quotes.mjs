#!/usr/bin/env node
/**
 * Build-time content check. Runs before every build; a failure stops the build.
 *
 * It enforces the two rules the site cannot be trusted without:
 *
 *   1. Every quotation is traceable — author, work, year, source URL and an
 *      explicit verification level, whatever that level is.
 *   2. No position is presented only in an opponent's words. An argument or a
 *      context entry that carries a critic's quote must also carry one from
 *      someone who holds it.
 *
 * It also reports the verification mix per topic, so the standard of the library
 * is visible on every build rather than buried in a document that goes stale.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT = join(ROOT, 'src/content/topics');
const LEVELS = ['primary', 'corroborated', 'paraphrase'];

const errors = [];
const warnings = [];
const tally = new Map();

function words(text) {
  const value = String(text ?? '').trim();
  return value ? value.split(/\s+/).length : 0;
}

function fail(file, path, message) {
  errors.push(`${file}\n    at ${path}\n    ${message}`);
}

function warn(file, path, message) {
  warnings.push(`${file}\n    at ${path}\n    ${message}`);
}

function checkQuote(file, path, quote) {
  const counts = tally.get(file);

  for (const field of ['text', 'author', 'work', 'sourceUrl', 'year']) {
    const value = quote[field];
    if (typeof value !== 'string' || value.trim() === '') {
      fail(file, path, `quote is missing "${field}". Every quote needs author + work + year + sourceUrl.`);
    }
  }

  if (!LEVELS.includes(quote.verification)) {
    fail(
      file,
      path,
      `quote needs "verification": one of ${LEVELS.join(', ')}. Say how far the wording was actually checked.`,
    );
  } else {
    counts[quote.verification] += 1;
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

  if (quote.verification === 'paraphrase') {
    // A paraphrase must not be dressed as a quotation, in the data or the page.
    const text = String(quote.text ?? '').trim();
    if (/^["“«]/.test(text)) {
      fail(
        file,
        path,
        'a paraphrase is our own sentence, so its text must not be wrapped in quotation marks.',
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
  tally.set(file, { primary: 0, corroborated: 0, paraphrase: 0 });

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

  const seenIds = new Set();
  const argumentCounts = [];

  (topic.sides ?? []).forEach((side, s) => {
    argumentCounts.push((side.arguments ?? []).length);

    (side.arguments ?? []).forEach((argument, a) => {
      const base = `sides[${s}].arguments[${a}]`;

      if (seenIds.has(argument.id)) {
        fail(file, base, `duplicate id "${argument.id}"; ids are used as anchors.`);
      }
      seenIds.add(argument.id);

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

      // Rule 2: never let an opponent be the only voice on a claim.
      if (argument.counter?.quote && !argument.quote) {
        fail(
          file,
          base,
          `argument "${argument.id}" carries a quote from the side objecting to it and none from anyone who holds it. Quote a defender.`,
        );
      } else if (!argument.quote) {
        warn(file, base, `argument "${argument.id}" has no quotation from anyone who holds it.`);
      }
    });
  });

  // Symmetry within a topic: neither side may appear to have more to say.
  if (argumentCounts.length === 2 && argumentCounts[0] !== argumentCounts[1]) {
    fail(
      file,
      'sides',
      `the two sides carry ${argumentCounts[0]} and ${argumentCounts[1]} arguments; they must carry the same number.`,
    );
  }
  for (const [i, count] of argumentCounts.entries()) {
    if (count < 2 || count > 4) {
      fail(file, `sides[${i}]`, `a side carries ${count} arguments; the range is 2 to 4.`);
    }
  }

  ((topic.context ?? {}).entries ?? []).forEach((entry, e) => {
    const base = `context.entries[${e}]`;

    if (seenIds.has(entry.id)) {
      fail(file, base, `duplicate id "${entry.id}"; ids are used as anchors.`);
    }
    seenIds.add(entry.id);

    checkTerms(file, `${base}.summary`, entry.summary ?? '', glossary, usedTerms);
    checkTerms(file, `${base}.standing`, entry.standing ?? '', glossary, usedTerms);
    checkTerms(file, `${base}.oneLine`, entry.oneLine ?? '', glossary, usedTerms);
    if (entry.quote) checkQuote(file, `${base}.quote`, entry.quote);
    if (entry.standingQuote) checkQuote(file, `${base}.standingQuote`, entry.standingQuote);

    if (entry.onConflict) {
      checkTerms(file, `${base}.onConflict.text`, entry.onConflict.text ?? '', glossary, usedTerms);
      if (entry.onConflict.quote) checkQuote(file, `${base}.onConflict.quote`, entry.onConflict.quote);
    }

    if (entry.standingQuote && !entry.quote) {
      fail(
        file,
        base,
        `position "${entry.id}" is quoted only by its critics. Quote someone who holds it.`,
      );
    } else if (entry.onConflict?.quote && !entry.quote) {
      fail(
        file,
        base,
        `position "${entry.id}" is quoted only on what it does when the evidence disagrees — ` +
          `the sentence its critics would choose for it. Quote its positive case too.`,
      );
    } else if (!entry.quote) {
      warn(file, base, `position "${entry.id}" has no quotation from anyone who holds it.`);
    }

    // "Quoted first and at least as fully" is about the weight each gets, not
    // the length of one sentence: a short, punchy positive quote is fine if the
    // case around it is the fuller treatment. So compare the whole blocks.
    if (entry.quote && entry.onConflict) {
      const positive = words(entry.summary) + words(entry.quote.text);
      const defensive = words(entry.onConflict.text) + words(entry.onConflict.quote?.text);
      if (defensive > positive) {
        warn(
          file,
          base,
          `position "${entry.id}" gives ${defensive} words to how it handles contrary evidence ` +
            `and only ${positive} to its own case. The positive case should be at least as full.`,
        );
      }
    }
  });

  if (topic.context) {
    checkTerms(file, 'context.intro', topic.context.intro ?? '', glossary, usedTerms);
    if (topic.context.note) {
      checkTerms(file, 'context.note.text', topic.context.note.text ?? '', glossary, usedTerms);
      if (topic.context.note.quote) {
        checkQuote(file, 'context.note.quote', topic.context.note.quote);
      }
    }
  }

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
        if (argument.quote) collect.push([`quote (${argument.id})`, argument.quote]);
        if (argument.counter?.quote) collect.push([`counter quote (${argument.id})`, argument.counter.quote]);
      }
    }
    if (topic.context?.note?.quote) {
      collect.push(['context note quote', topic.context.note.quote]);
    }
    for (const entry of (topic.context ?? {}).entries ?? []) {
      if (entry.quote) collect.push([`quote (${entry.id})`, entry.quote]);
      if (entry.onConflict?.quote) {
        collect.push([`on-conflict quote (${entry.id})`, entry.onConflict.quote]);
      }
      if (entry.standingQuote) collect.push([`standing quote (${entry.id})`, entry.standingQuote]);
    }
    for (const [label, quote] of collect) {
      // A paraphrase is our own sentence, so there is no source wording to show
      // underneath it. Only real quotations need their original.
      if (quote.verification !== 'paraphrase' && !quote.original?.text) {
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

console.log(`\nContent check passed: ${files.length} file(s).`);
console.log('Quotations by verification level:\n');
const totals = { primary: 0, corroborated: 0, paraphrase: 0 };
for (const [file, counts] of tally) {
  for (const level of LEVELS) totals[level] += counts[level];
  const sum = LEVELS.reduce((n, level) => n + counts[level], 0);
  console.log(
    `  ${file.replace('src/content/topics/', '').padEnd(38)} ` +
      `${String(sum).padStart(3)} quotes  ` +
      LEVELS.map((level) => `${level} ${counts[level]}`).join('  '),
  );
}
console.log(
  `\n  ${'total'.padEnd(38)} ` +
    `${String(LEVELS.reduce((n, l) => n + totals[l], 0)).padStart(3)} quotes  ` +
    LEVELS.map((level) => `${level} ${totals[level]}`).join('  '),
);
if (totals.primary === 0) {
  console.log(
    '\n  No quotation has been read in its source text yet. Every one rests on\n' +
      '  corroborating secondary sources, and the pages say so.',
  );
}
console.log('');
