#!/usr/bin/env node
// Prints a topic's prose path by path, which is what a translator works from.
//
//   node scripts/i18n-tools/show-topic.mjs 17             English only
//   node scripts/i18n-tools/show-topic.mjs 17 de          English and German
//   node scripts/i18n-tools/show-topic.mjs 17 de .notes   only paths under .notes
//
// The paths it prints are exactly the keys a payload needs, so a new locale
// starts by piping this into a file and filling in the second line of each pair.

import { walk, loadTopic } from './lib/paths.mjs';

const [num, lang, ...only] = process.argv.slice(2);
if (!num) {
  console.error('usage: show-topic.mjs <NN> [locale] [path-prefix...]');
  process.exit(1);
}

const en = await loadTopic('en', num);
const tg = lang ? new Map(walk(await loadTopic(lang, num))) : null;
const rows = walk(en).filter(([p]) => !only.length || only.some((o) => p.startsWith(o)));

console.log(`# en/${num}: ${walk(en).length} prose strings, ${rows.length} shown` +
  (lang ? `  (against ${lang})` : ''));
for (const [p, e] of rows) {
  if (!tg) {
    console.log(`\n### ${p}\n${e}`);
    continue;
  }
  const t = tg.get(p) ?? '<<MISSING>>';
  const ratio = (t.length / Math.max(e.length, 1)).toFixed(2);
  console.log(`\n### ${p}   en ${e.length} / ${lang} ${t.length}  (x${ratio})`);
  console.log(`EN: ${e}`);
  console.log(`${lang.toUpperCase()}: ${t}`);
}
