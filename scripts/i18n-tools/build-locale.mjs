#!/usr/bin/env node
// Builds a non-English topic file from the English one plus a prose payload.
//
//   node scripts/i18n-tools/build-locale.mjs <locale> <NN> [payload.json]
//
// The payload defaults to scripts/i18n-tools/maps/<locale>-<NN>.json.
//
// Structure, ids, quote attribution and source URLs come from English, so the
// five files cannot drift apart; the payload supplies only prose. It is refused
// unless it covers every prose path and nothing else, so a missed string is a
// loud failure rather than an English sentence left in place.
//
// Names, work titles and locators are not in the payload at all. They come from
// the tables in lib/tables.mjs, keyed on the English string, so the same source
// cannot end up labelled two ways in two files.

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { walk, flat, quotes, setv, getv, loadTopic, topicPath, ROOT } from './lib/paths.mjs';
import { AUTHORS, WORKS, DESCWORKS, LOCATORS } from './lib/tables.mjs';

const [lang, num, payloadArg] = process.argv.slice(2);
if (!lang || !num) {
  console.error('usage: build-locale.mjs <locale> <NN> [payload.json]');
  process.exit(1);
}
const payloadPath = payloadArg ?? join(ROOT, `scripts/i18n-tools/maps/${lang}-${num}.json`);

const en = await loadTopic('en', num);
const payload = JSON.parse(await readFile(payloadPath, 'utf8'));
const prose = payload.prose ?? {};
const workOverride = payload.work ?? {};
if (!payload.slug) {
  console.error(`${payloadPath}: no slug`);
  process.exit(1);
}

const out = JSON.parse(JSON.stringify(en));
const wanted = walk(en).map(([p]) => p);
const missing = wanted.filter((p) => !(p in prose));
const extra = Object.keys(prose).filter((p) => !wanted.includes(p)).sort();
if (missing.length || extra.length) {
  const say = [];
  if (missing.length) say.push(`MISSING from the payload (${missing.length}):\n  ${missing.join('\n  ')}`);
  if (extra.length) say.push(`NOT a prose path (${extra.length}):\n  ${extra.join('\n  ')}`);
  console.error(`refusing to write ${lang}/${num}\n${say.join('\n')}`);
  process.exit(1);
}

for (const p of wanted) setv(out, p, prose[p]);
for (const [p, v] of Object.entries(workOverride)) {
  if (!p.endsWith('.work')) throw new Error(`work override is not a .work path: ${p}`);
  getv(en, p);                                  // must exist in English
  setv(out, p, v);
}
out.slug = payload.slug;

// One table per kind of label, keyed on the English string.
let renamed = 0, works = 0, locs = 0;
const sourceTitle = /^\.sources\[\d+\]\.title$/;
for (const [p, v] of Object.entries(flat(en))) {
  if (typeof v !== 'string') continue;
  if (p.endsWith('.author') && AUTHORS[v]?.[lang]) { setv(out, p, AUTHORS[v][lang]); renamed++; }
  // A work title is glossed identically wherever it appears, so a source entry
  // and the quotation that cites it never disagree.
  if ((p.endsWith('.work') || sourceTitle.test(p)) && WORKS[v]?.[lang] && !(p in workOverride)) {
    setv(out, p, WORKS[v][lang]); works++;
  }
  if (p.endsWith('.work') && DESCWORKS[v]?.[lang] && !(p in workOverride)) {
    setv(out, p, DESCWORKS[v][lang]); works++;
  }
  if (p.endsWith('.locator') && LOCATORS[v]?.[lang]) { setv(out, p, LOCATORS[v][lang]); locs++; }
}

// Every translated quotation carries the English wording it was checked against.
const eq = quotes(en), tq = quotes(out);
eq.forEach(([, a], i) => { tq[i][1].original = { text: a.text, language: 'en' }; });

const dest = topicPath(lang, num);
await writeFile(dest, JSON.stringify(out, null, 2) + '\n');
console.log(
  `wrote ${dest}: ${wanted.length} prose strings, ${renamed} name(s) localised, ` +
  `${works + Object.keys(workOverride).length} work gloss(es), ${locs} locator(s), slug='${out.slug}'`,
);
