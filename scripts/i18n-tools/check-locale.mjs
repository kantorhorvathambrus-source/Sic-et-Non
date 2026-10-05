#!/usr/bin/env node
// Proves that nothing but prose, slug, the registered labels and the added
// `original` differs from English.
//
//   node scripts/i18n-tools/check-locale.mjs            every locale, every topic
//   node scripts/i18n-tools/check-locale.mjs de         one locale
//   node scripts/i18n-tools/check-locale.mjs de 17      one file
//
// This is the half of the pipeline that keeps working after the translating is
// done: it needs no payload, so it can be run against the committed tree at any
// time, and it is what makes a claim like "every non-translatable field is
// byte-identical to English" checkable rather than asserted.

import { walk, flat, quotes, loadTopic, TOPICS, LOCALES } from './lib/paths.mjs';
import { AUTHORS, WORKS, DESCWORKS, LOCATORS } from './lib/tables.mjs';

const nameOk = (en, got, lang) => got === en || got === AUTHORS[en]?.[lang];
const workOk = (en, got, lang) =>
  got === en || got === WORKS[en]?.[lang] || got === DESCWORKS[en]?.[lang];
const locOk = (en, got, lang) => got === en || got === LOCATORS[en]?.[lang];

// One convention per locale, no stray marks from another language.
const MARKS = {
  es: ['«»', '„“”'], fr: ['«»', '„“”'], de: ['„“', '«»'], hu: ['„”', '«»“'],
};
const LINK = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;
// A bibliography title and a work title carry "Original (Translation)" on
// purpose, so their length ratio measures the gloss, not the translation.
const GLOSSED = /\.sources\[\d+\]\.title$|\.work$/;

function links(doc) {
  const used = [];
  const w = (o) => {
    if (Array.isArray(o)) o.forEach(w);
    else if (o && typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) if (k !== 'glossary') w(v);
    } else if (typeof o === 'string') {
      for (const m of o.matchAll(LINK)) used.push((m[2] ?? m[1]).trim().toLowerCase());
    }
  };
  w(doc);
  return used;
}

async function checkOne(lang, num) {
  const en = await loadTopic('en', num);
  const tg = await loadTopic(lang, num);
  const bad = [], warn = [], drift = [];

  const prose = new Set([...walk(en).map(([p]) => p), ...walk(tg).map(([p]) => p)]);
  const fe = flat(en), ft = flat(tg);
  const allowedNew = /\.original\.(text|language)$/;

  for (const p of Object.keys(ft)) if (!(p in fe) && !allowedNew.test(p)) bad.push(`path only in ${lang}: ${p}`);
  for (const p of Object.keys(fe)) if (!(p in ft)) bad.push(`path missing in ${lang}: ${p}`);

  for (const p of Object.keys(fe)) {
    if (!(p in ft) || fe[p] === ft[p] || p === '.slug' || prose.has(p)) continue;
    if (p.endsWith('.work') && workOk(fe[p], ft[p], lang)) continue;
    if (p.endsWith('.locator') && locOk(fe[p], ft[p], lang)) continue;
    if (p.endsWith('.author') && nameOk(fe[p], ft[p], lang)) continue;
    bad.push(`non-prose value changed at ${p}: ${JSON.stringify(fe[p])} -> ${JSON.stringify(ft[p])}`);
  }

  if (!/^[a-z0-9-]+$/.test(tg.slug)) bad.push(`slug not ascii-lower-hyphen: ${JSON.stringify(tg.slug)}`);

  // Glossary links: resolve both directions, same count as English.
  const lt = links(tg), le = links(en);
  const terms = new Set(tg.glossary.map((g) => g.term.toLowerCase()));
  const unresolved = [...new Set(lt)].filter((t) => !terms.has(t)).sort();
  const unlinked = [...terms].filter((t) => !lt.includes(t)).sort();
  if (unresolved.length) bad.push(`unresolved glossary links: ${JSON.stringify(unresolved)}`);
  if (unlinked.length) bad.push(`glossary terms never linked: ${JSON.stringify(unlinked)}`);
  if (lt.length !== le.length) bad.push(`glossary link count ${le.length} en vs ${lt.length} ${lang}`);

  // Quotations: metadata frozen, English wording stored, text actually translated.
  const eq = quotes(en), tq = quotes(tg);
  if (eq.length !== tq.length) bad.push(`quote count ${eq.length} vs ${tq.length}`);
  eq.forEach(([, a], i) => {
    const entry = tq[i];
    if (!entry) return;
    const [pt, b] = entry;
    if (!locOk(a.locator, b.locator, lang)) {
      bad.push(`${pt}.locator is not English nor a registered localisation: ${JSON.stringify(b.locator)}`);
    }
    for (const k of ['year', 'sourceUrl', 'verification', 'sawWhat']) {
      if (a[k] !== b[k]) bad.push(`${pt}.${k} changed: ${JSON.stringify(a[k])} -> ${JSON.stringify(b[k])}`);
    }
    if (!nameOk(a.author, b.author, lang)) {
      bad.push(`${pt}.author is not English nor a registered localisation: ${JSON.stringify(b.author)}`);
    }
    const o = b.original ?? {};
    if (o.text !== a.text || o.language !== 'en') {
      bad.push(`${pt}.original must be the English wording with language "en"`);
    }
    if (b.text === a.text && b.verification !== 'paraphrase') warn.push(`${pt}.text identical to English`);
  });

  if (MARKS[lang]) {
    const [, forbid] = MARKS[lang];
    const text = Object.entries(ft)
      .filter(([k, v]) => prose.has(k) && typeof v === 'string').map(([, v]) => v).join('\n');
    const stray = [...new Set([...text].filter((ch) => forbid.includes(ch)))].sort();
    if (stray.length) bad.push(`wrong-locale quotation marks present: ${JSON.stringify(stray)}`);
    if (text.includes('"')) bad.push('straight ASCII quote in prose');
  }

  // Length drift: the layout is sized for the English proportions.
  for (const p of [...prose].sort()) {
    const a = fe[p], b = ft[p];
    if (typeof a !== 'string' || typeof b !== 'string' || a.length < 40) continue;
    if (GLOSSED.test(p)) continue;
    const r = b.length / a.length;
    if (r > 1.35 || r < 0.78) drift.push([Math.round(r * 100) / 100, p, a.length, b.length]);
  }
  drift.sort((x, y) => y[0] - x[0]);

  return { lang, num, bad, warn, drift, quotes: tq.length, links: lt.length, terms: tg.glossary.length, slug: tg.slug };
}

const [argLang, argNum] = process.argv.slice(2);
const langs = argLang ? [argLang] : LOCALES;
const nums = argNum ? [argNum] : TOPICS;
let failed = 0, checked = 0, drifted = 0, warned = 0;
for (const lang of langs) {
  for (const num of nums) {
    const r = await checkOne(lang, num);
    checked++;
    const quiet = !argNum && !r.bad.length && !r.drift.length && !r.warn.length;
    if (!quiet) {
      console.log(`--- ${r.lang}/${r.num}: ${r.quotes} quotes, ${r.links} glossary links, ${r.terms} terms, slug='${r.slug}'`);
    }
    if (r.drift.length) {
      drifted++;
      console.log(`   length drift on ${r.drift.length} string(s):`);
      for (const [ratio, p, x, y] of r.drift.slice(0, 6)) console.log(`      x${ratio}  ${p}  (${x} -> ${y})`);
    }
    for (const w of r.warn) { warned++; console.log(`   WARN ${w}`); }
    for (const b of r.bad) console.log(`   FAIL ${b}`);
    if (r.bad.length) failed++;
    else if (argNum) console.log('   OK: structure, ids, enums, quote metadata, originals, glossary links, marks');
  }
}
console.log(
  `\nLocale check ${failed ? 'FAILED' : 'passed'}: ${checked} file(s), ` +
  `${failed} with failures, ${drifted} with length drift, ${warned} warning(s).`,
);
process.exit(failed ? 1 : 0);
