// Static guards on the stylesheets, for rules a renderer cannot catch.
//
// These are cheap string checks, not a CSS parser. Each one exists because the
// mistake it catches has already been made once.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const EXT = new Set(['.css', '.astro']);

const problems = [];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (EXT.has(extname(entry.name))) out.push(full);
  }
  return out;
}

// Find the declaration block containing a given index, by matching braces back
// to the opening one and forward to its partner.
function blockAround(css, index) {
  let depth = 0;
  let open = -1;
  for (let i = index; i >= 0; i -= 1) {
    if (css[i] === '}') depth += 1;
    else if (css[i] === '{') {
      if (depth === 0) {
        open = i;
        break;
      }
      depth -= 1;
    }
  }
  if (open === -1) return null;
  depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  return null;
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

for (const full of await walk(SRC)) {
  const file = relative(ROOT, full);
  const text = await readFile(full, 'utf8');

  // 1. The measure is per typeface. An element that switches to the display
  //    face without also setting --measure-text inherits Inter's cap, which is
  //    about 22% too wide for EB Garamond. See the comment in global.css.
  const DISPLAY = /font-family:\s*var\(--font-display\)/g;
  for (let m = DISPLAY.exec(text); m; m = DISPLAY.exec(text)) {
    const block = blockAround(text, m.index);
    if (block === null) continue;
    if (!/--measure-text\s*:/.test(block)) {
      problems.push(
        `${file}:${lineOf(text, m.index)}  sets the display face without --measure-text. ` +
          `EB Garamond needs 26em where Inter needs 33em; inheriting the body cap ` +
          `lets this run past 90 characters.`,
      );
    }
  }

  // 2. A container width is not a measure. Capping running text with
  //    --measure-prose (a rem value) beats the global per-face cap on
  //    specificity and silently unbounds the character count.
  const CAP = /max-width:\s*var\(--measure-(prose|wide)\)/g;
  for (let m = CAP.exec(text); m; m = CAP.exec(text)) {
    const block = blockAround(text, m.index);
    if (block === null) continue;
    if (/font-family|font-size:\s*var\(--step/.test(block)) {
      problems.push(
        `${file}:${lineOf(text, m.index)}  caps text with --measure-${m[1]}, a container ` +
          `width. Use the per-face --measure-text cap, or move the width to the wrapper.`,
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`\nStyle check failed (${problems.length} problem(s)):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('');
  process.exit(1);
}

console.log('Style check passed: the measure is set with the face everywhere it changes.');
