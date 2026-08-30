#!/usr/bin/env node
/**
 * Asserts what the design actually claims about the two side accents, rather
 * than the proxy a contrast checker would measure.
 *
 * The claim is: identical OKLCH lightness and chroma within a theme, hue the
 * only difference. OKLCH lightness is perceptually uniform, so that invariant
 * is what makes the two sides equally weighted to a reader.
 *
 * The WCAG ratios for the pair are deliberately NOT equal, and must not be
 * "fixed" — see DECISIONS.md. What is checked here is the floor that protects
 * readers, plus an alarm wide enough never to fire on a hue rotation and narrow
 * enough to fire if someone swaps in a yellow or a deep navy.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const ROOT = new URL('..', import.meta.url).pathname;
const TOKENS = join(ROOT, 'src/styles/tokens.css');

/**
 * How far apart the two accents' WCAG ratios may drift before we want to know.
 *
 * Measured headroom: with L and C held equal, sweeping hue through all 360
 * degrees moves the ratio by at most 0.77 in the light theme and 0.82 in the
 * dark. So this alarm cannot fire while the OKLCH invariant above holds — it is
 * a backstop for a change of lightness or chroma family, not an independent
 * check on hue, and the invariant is what does the real work.
 */
const GAP_ALARM = 1.5;
const FLOOR = 4.5;

const css = await readFile(TOKENS, 'utf8');
const problems = [];

/**
 * The palette is declared three times: the light :root, the dark media query,
 * and the dark [data-theme] override. All three are checked, because a change
 * applied to only one of them is exactly the kind of drift this catches.
 *
 * Found by brace matching rather than by regex: the dark rule is nested inside a
 * media query and its selector contains its own brackets
 * (`:root:not([data-theme='light'])`), both of which defeat a pattern match.
 */
function blocks(source) {
  const found = [];
  let from = 0;

  for (;;) {
    const at = source.indexOf('--theist:', from);
    if (at === -1) break;
    from = at + 1;

    // Walk back to the brace that opens this declaration block.
    let depth = 0;
    let open = -1;
    for (let i = at; i >= 0; i -= 1) {
      if (source[i] === '}') depth += 1;
      else if (source[i] === '{') {
        if (depth === 0) { open = i; break; }
        depth -= 1;
      }
    }
    if (open === -1) continue;

    // And forward to the brace that closes it.
    depth = 0;
    let close = source.length;
    for (let i = open + 1; i < source.length; i += 1) {
      if (source[i] === '{') depth += 1;
      else if (source[i] === '}') {
        if (depth === 0) { close = i; break; }
        depth -= 1;
      }
    }

    const selector = source.slice(0, open).split(/[{}]/).pop().trim().replace(/\s+/g, ' ');
    // Anything nested inside a prefers-color-scheme: dark query is the dark set.
    const preceding = source.slice(0, open);
    const lastMedia = preceding.lastIndexOf('@media (prefers-color-scheme: dark)');
    const inDarkMedia = lastMedia !== -1 && lastMedia > preceding.lastIndexOf('\n}');

    found.push({
      label: inDarkMedia ? 'dark (media query)' : selector.includes('data-theme') ? 'dark (toggle)' : 'light (:root)',
      selector,
      body: source.slice(open + 1, close),
    });
    from = close;
  }

  return found;
}

function oklch(body, name) {
  const m = body.match(new RegExp(`--${name}:\\s*oklch\\(([^)]+)\\)`));
  if (!m) return null;
  const [L, C, H] = m[1].trim().split(/\s+/);
  return { L: parseFloat(L), C: parseFloat(C), H: parseFloat(H), css: `oklch(${m[1].trim()})` };
}

const declared = [];
for (const block of blocks(css)) {
  const theist = oklch(block.body, 'theist');
  const atheist = oklch(block.body, 'atheist');
  const bg = oklch(block.body, 'bg');

  if (!theist || !atheist) {
    problems.push(`${block.label}: could not read both accents as oklch().`);
    continue;
  }

  if (theist.L !== atheist.L) {
    problems.push(
      `${block.label}: the accents must share one OKLCH lightness; got ${theist.L}% and ${atheist.L}%. ` +
        'Equal L is what makes the two sides weigh the same to a reader.',
    );
  }
  if (theist.C !== atheist.C) {
    problems.push(
      `${block.label}: the accents must share one OKLCH chroma; got ${theist.C} and ${atheist.C}.`,
    );
  }
  if (theist.H === atheist.H) {
    problems.push(`${block.label}: the accents must differ in hue; both are ${theist.H}.`);
  }

  declared.push({ label: block.label, theist, atheist, bg });
}

// --- the floor and the alarm, measured as the browser will paint them -----
function browserPath() {
  return [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium']
    .filter(Boolean)
    .find((candidate) => existsSync(candidate));
}

const executablePath = browserPath();
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage();
await page.setContent('<html><body></body></html>');

const measured = await page.evaluate((entries) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const toRGB = (value) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const ch = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = ([r, g, b]) => 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
  const ratio = (a, b) => {
    const [x, y] = [lum(toRGB(a)), lum(toRGB(b))];
    const [hi, lo] = x > y ? [x, y] : [y, x];
    return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
  };
  return entries.map((e) => ({
    label: e.label,
    theist: ratio(e.theist, e.bg),
    atheist: ratio(e.atheist, e.bg),
  }));
}, declared.map((d) => ({ label: d.label, theist: d.theist.css, atheist: d.atheist.css, bg: d.bg.css })));

await browser.close();

console.log('Side accents — OKLCH invariant and measured contrast:\n');
for (const m of measured) {
  const d = declared.find((x) => x.label === m.label);
  const gap = Math.round(Math.abs(m.theist - m.atheist) * 100) / 100;
  console.log(
    `  ${m.label.padEnd(22)} L ${d.theist.L}%  C ${d.theist.C}  hue ${d.theist.H}/${d.atheist.H}   ` +
      `${m.theist}:1 / ${m.atheist}:1   gap ${gap}`,
  );

  for (const [side, value] of [['theist', m.theist], ['atheist', m.atheist]]) {
    if (value < FLOOR) {
      problems.push(`${m.label}: the ${side} accent is ${value}:1 against its background, below ${FLOOR}:1.`);
    }
  }
  if (gap > GAP_ALARM) {
    problems.push(
      `${m.label}: the two accents are ${gap} apart in WCAG ratio, past the ${GAP_ALARM} alarm. ` +
        'A hue rotation never does this; a change of lightness family does. Check what changed.',
    );
  }
}

console.log(
  `\n  The WCAG ratios are deliberately unequal and must not be equalised: see DECISIONS.md.\n` +
    `  Floor ${FLOOR}:1. Gap alarm at ${GAP_ALARM}, which a hue change alone cannot reach:\n` +
    `  at fixed L and C the whole hue circle spans only 0.77 (light) and 0.82 (dark).`,
);

if (problems.length > 0) {
  console.error(`\nPalette check failed (${problems.length}):`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('');
  process.exit(1);
}

console.log('\nPalette check passed.\n');
