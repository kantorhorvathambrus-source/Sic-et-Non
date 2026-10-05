#!/usr/bin/env node
// Does every payload still rebuild its committed file, byte for byte?
//
//   node scripts/i18n-tools/reproduce.mjs
//
// A payload that no longer reproduces its file is the failure mode this guards
// against: somebody edits the JSON directly, the payload keeps the old wording,
// and the next rebuild silently reverts the edit. Running this after any direct
// edit to a locale file tells you to carry the edit back into the payload.
//
// Topic 6 has no payload in any locale: it was translated before this pipeline
// existed and its files are the original hand translation. That is recorded as
// an exemption rather than a failure, because inventing a payload from the
// committed file would prove nothing.

import { readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { topicPath, TOPICS, LOCALES, ROOT } from './lib/paths.mjs';

const run = promisify(execFile);
const NO_PAYLOAD = new Set(['06']);
let ok = 0, drift = 0, exempt = 0, missing = 0;

for (const lang of LOCALES) {
  for (const num of TOPICS) {
    const payload = join(ROOT, `scripts/i18n-tools/maps/${lang}-${num}.json`);
    const dest = topicPath(lang, num);
    if (!existsSync(payload)) {
      if (NO_PAYLOAD.has(num)) { exempt++; continue; }
      console.log(`  NO PAYLOAD  ${lang}/${num}`);
      missing++;
      continue;
    }
    const before = await readFile(dest);
    const keep = `${dest}.reproduce-keep`;
    await copyFile(dest, keep);
    let failed = null;
    try {
      await run(process.execPath, [join(ROOT, 'scripts/i18n-tools/build-locale.mjs'), lang, num]);
      const after = await readFile(dest);
      if (!after.equals(before)) failed = 'output differs from the committed file';
    } catch (e) {
      failed = (e.stderr || e.message).trim().split('\n').pop();
    } finally {
      await copyFile(keep, dest);
      await rm(keep);
    }
    if (failed) { console.log(`  DRIFT       ${lang}/${num}: ${failed}`); drift++; }
    else ok++;
  }
}

console.log(
  `\nReproduce check ${drift || missing ? 'FAILED' : 'passed'}: ` +
  `${ok} payload(s) rebuild their file exactly, ${drift} drifted, ` +
  `${missing} missing, ${exempt} exempt (topic 6, translated before this pipeline).`,
);
process.exit(drift || missing ? 1 : 0);
