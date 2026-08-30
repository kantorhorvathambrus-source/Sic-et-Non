#!/usr/bin/env node
/**
 * Catches text squeezed into a column too narrow to read.
 *
 * The bug this exists for: a grid or flex container whose children auto-place
 * into a narrow track, or a child left at the default `min-width: auto` that
 * refuses to shrink below its longest word. Either renders a paragraph one word
 * per line. Nothing else in the build sees it — the markup is valid, the types
 * check, the links resolve, the content is correct. It is only visible to
 * someone looking at the page, and that does not scale to twenty topics in five
 * languages.
 *
 * So: render every built page at three widths in both themes, and fail if any
 * element holding a sentence's worth of text is narrower than a readable column.
 *
 *   node scripts/layout-check.mjs [--width 360,768,1280] [--min 180] [--words 15]
 */
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { chromium } from 'playwright';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');

function flag(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

const WIDTHS = String(flag('width', '360,768,1280')).split(',').map(Number);
const MIN_WIDTH = Number(flag('min', 180));
const MIN_WORDS = Number(flag('words', 15));
/** Running prose past this many characters a line is hard to track back to. */
const MAX_CHARS = Number(flag('max-chars', 95));
/** WCAG AA for body text. Large text is allowed 3:1, handled in the probe. */
const MIN_RATIO = Number(flag('min-ratio', 4.5));
/** The width the per-page measure report is taken at. */
const REPORT_WIDTH = 1280;
const THEMES = ['light', 'dark'];

async function htmlFiles(dir) {
  const found = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, item.name);
    if (item.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (item.name.endsWith('.html')) found.push(full);
  }
  return found;
}

let pages;
try {
  pages = await htmlFiles(DIST);
} catch {
  console.error('No dist/ directory. Run the build first.');
  process.exit(1);
}

/**
 * Runs in the page. Reports three things about how the built page actually lays
 * out, none of which any other check can see:
 *
 *   squeezed     text in a column too narrow to read
 *   tooWide      running prose past a comfortable measure
 *   lowContrast  a text/background pair under the WCAG AA ratio
 *
 * Two things are deliberately not counted as text. Anything the reader cannot
 * see — a `visibility: hidden` glossary tooltip, a `.visually-hidden` label for
 * screen readers — is not squeezed, it is hidden on purpose. And only block
 * boxes are measured for width: an inline <dfn> is as narrow as the word it
 * wraps, which is correct, not a bug.
 */
function inspect({ minWidth, minWords, maxChars, minRatio }) {
  const BLOCK = new Set([
    'block', 'flow-root', 'grid', 'flex', 'list-item', 'table', 'table-cell',
  ]);

  // The stylesheet is written in oklch and getComputedStyle hands that back
  // unchanged. Painting into a canvas makes the browser resolve any CSS Color 4
  // value to the sRGB bytes it will actually display, which is what contrast is
  // about.
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const colorCache = new Map();

  function toRGB(css) {
    let hit = colorCache.get(css);
    if (hit) return hit;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    hit = [d[0], d[1], d[2], d[3] / 255];
    colorCache.set(css, hit);
    return hit;
  }

  function channel(c) {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }

  function luminance([r, g, b]) {
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  }

  function contrast(fg, bg) {
    const a = luminance(fg);
    const b = luminance(bg);
    const [hi, lo] = a > b ? [a, b] : [b, a];
    return (hi + 0.05) / (lo + 0.05);
  }

  /** The first ancestor that actually paints something behind the text. */
  function backgroundOf(el) {
    for (let n = el; n; n = n.parentElement) {
      const c = toRGB(getComputedStyle(n).backgroundColor);
      if (c[3] > 0.99) return c;
    }
    return toRGB(getComputedStyle(document.body).backgroundColor);
  }

  function isInvisible(el) {
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') return true;
    // The visually-hidden pattern: clipped to nothing, sized to a pixel.
    if (style.clipPath && style.clipPath !== 'none') {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 2 || rect.height <= 2) return true;
    }
    return false;
  }

  function visibleWordCount(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const verdicts = new Map();
    let words = 0;

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const value = node.nodeValue?.trim();
      if (!value) continue;

      let hidden = false;
      for (let el = node.parentElement; el && el !== root.parentElement; el = el.parentElement) {
        let verdict = verdicts.get(el);
        if (verdict === undefined) {
          verdict = isInvisible(el);
          verdicts.set(el, verdict);
        }
        if (verdict) {
          hidden = true;
          break;
        }
      }
      if (!hidden) words += value.split(/\s+/).length;
    }

    return words;
  }

  /** Words held directly by this element rather than by a descendant block. */
  function ownWordCount(el) {
    let words = 0;
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const value = node.nodeValue?.trim();
        if (value) words += value.split(/\s+/).length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const display = getComputedStyle(node).display;
        if (!BLOCK.has(display) && !isInvisible(node)) {
          words += visibleWordCount(node);
        }
      }
    }
    return words;
  }

  function describe(el) {
    const id = el.id ? `#${el.id}` : '';
    const cls =
      typeof el.className === 'string' && el.className
        ? '.' +
          el.className
            .trim()
            .split(/\s+/)
            .filter((c) => !c.startsWith('astro-'))
            .join('.')
        : '';
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  }

  function excerpt(el) {
    return (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 70);
  }

  const squeezed = [];
  const tooWide = [];
  const lowContrast = [];
  const measures = [];

  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg')) continue;
    if (!el.checkVisibility?.({ contentVisibilityAuto: true, visibilityProperty: true })) {
      continue;
    }

    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const fontPx = parseFloat(style.fontSize) || 16;

    // --- contrast, on whatever element actually holds the words ------------
    const ownWords = ownWordCount(el);
    if (ownWords > 0 && !isInvisible(el)) {
      const ratio = contrast(toRGB(style.color), backgroundOf(el));
      const weight = Number(style.fontWeight) || 400;
      // WCAG counts >=24px, or >=18.66px bold, as large text.
      const large = fontPx >= 24 || (fontPx >= 18.66 && weight >= 700);
      const need = large ? 3 : minRatio;
      if (ratio < need - 0.005) {
        lowContrast.push({
          selector: describe(el),
          ratio: Math.round(ratio * 100) / 100,
          need,
          fontPx: Math.round(fontPx * 10) / 10,
          weight,
          text: excerpt(el),
        });
      }
    }

    if (!BLOCK.has(style.display)) continue;
    if (rect.width === 0 && rect.height === 0) continue;

    // --- width -------------------------------------------------------------
    // An average Latin glyph is about half the font size, which is close enough
    // to count characters per line without measuring glyphs.
    const chars = rect.width / (fontPx * 0.5);

    if (rect.width < minWidth) {
      const words = visibleWordCount(el);
      if (words >= minWords) {
        squeezed.push({
          el,
          selector: describe(el),
          boxPx: Math.round(rect.width),
          words,
          text: excerpt(el),
        });
      }
    } else if (ownWords >= minWords && chars > maxChars) {
      tooWide.push({
        selector: describe(el),
        boxPx: Math.round(rect.width),
        chars: Math.round(chars),
        words: ownWords,
        text: excerpt(el),
      });
    }

    if (ownWords >= minWords && rect.width > minWidth) {
      measures.push({ selector: describe(el), chars: Math.round(chars) });
    }
  }

  // A squeezed paragraph usually sits inside a squeezed parent; report the
  // outermost box in each chain so one bug is one line of output.
  const narrowElements = new Set(squeezed.map((entry) => entry.el));
  const outermost = squeezed.filter((entry) => {
    for (let parent = entry.el.parentElement; parent; parent = parent.parentElement) {
      if (narrowElements.has(parent)) return false;
    }
    return true;
  });

  const strip = ({ el, ...rest }) => rest;
  return {
    squeezed: outermost.map(strip),
    tooWide,
    lowContrast,
    measures,
  };
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

// The pages are checked as they are actually served: real stylesheets, real
// fonts, real scripts. Reconstructing them by hand would test the wrong thing.
const server = createServer(async (req, res) => {
  const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const candidates = [join(DIST, path), join(DIST, path, 'index.html'), join(DIST, `${path}.html`)];
  for (const candidate of candidates) {
    try {
      const body = await readFile(candidate);
      res.writeHead(200, { 'content-type': TYPES[extname(candidate)] ?? 'application/octet-stream' });
      res.end(body);
      return;
    } catch {
      /* try the next shape */
    }
  }
  res.writeHead(404).end('not found');
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

/**
 * Playwright expects the browser build it was pinned against. Where the image
 * already ships one — as CI and this environment do — use it rather than
 * downloading a second copy. CHROMIUM_PATH overrides.
 */
function browserPath() {
  const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate));
}

const executablePath = browserPath();
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const problems = [];
const proseMeasures = new Map();
const seenContrast = new Set();
let checks = 0;

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: theme,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const file of pages) {
      const route =
        '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\.html$/, '');
      await page.goto(origin + route, { waitUntil: 'load' });

      for (const pass of ['collapsed', 'expanded']) {
        if (pass === 'expanded') {
          const opened = await page.evaluate(() => {
            const panels = document.querySelectorAll('details');
            for (const panel of panels) panel.open = true;
            return panels.length;
          });
          if (opened === 0) continue;
          await page.waitForTimeout(20);
        }

        checks += 1;
        const found = await page.evaluate(inspect, {
          minWidth: MIN_WIDTH,
          minWords: MIN_WORDS,
          maxChars: MAX_CHARS,
          minRatio: MIN_RATIO,
        });

        for (const item of found.squeezed) {
          problems.push({ kind: 'narrow', route, theme, width, pass, ...item });
        }
        for (const item of found.tooWide) {
          problems.push({ kind: 'wide', route, theme, width, pass, ...item });
        }
        for (const item of found.lowContrast) {
          // Contrast does not vary with viewport width, so report it once per
          // route and theme rather than three times.
          const key = `${route}|${theme}|${item.selector}|${item.ratio}`;
          if (seenContrast.has(key)) continue;
          seenContrast.add(key);
          problems.push({ kind: 'contrast', route, theme, width, pass, ...item });
        }

        if (width === REPORT_WIDTH && theme === 'light' && pass === 'expanded') {
          const sorted = [...found.measures].sort((a, b) => a.chars - b.chars);
          if (sorted.length > 0) {
            proseMeasures.set(route, {
              narrowest: sorted[0],
              widest: sorted[sorted.length - 1],
              blocks: sorted.length,
            });
          }
        }
      }
    }

    await context.close();
  }
}

await browser.close();
await new Promise((resolve) => server.close(resolve));

console.log(
  `Layout check: ${pages.length} page(s) x ${WIDTHS.join('/')}px x ${THEMES.join('/')} ` +
    `= ${checks} render(s).`,
);

if (proseMeasures.size > 0) {
  const all = [...proseMeasures.values()];
  console.log(
    `\nProse measure at ${REPORT_WIDTH}px, characters per line ` +
      `(target 65-75, fails past ${MAX_CHARS}):`,
  );

  // Naming the widest and narrowest block is the point: two bare numbers say
  // drift happened, a selector says where.
  const byWidest = [...proseMeasures.entries()].sort((a, b) => b[1].widest.chars - a[1].widest.chars);
  for (const [route, m] of byWidest.slice(0, 6)) {
    console.log(
      `  ${route.padEnd(40)} ${String(m.narrowest.chars).padStart(3)} to ` +
        `${String(m.widest.chars).padStart(3)}   widest: ${m.widest.selector.slice(0, 34)}`,
    );
  }
  if (byWidest.length > 6) console.log(`  ...${byWidest.length - 6} more routes`);

  const widest = all.reduce((a, b) => (a.widest.chars >= b.widest.chars ? a : b));
  const narrowest = all.reduce((a, b) => (a.narrowest.chars <= b.narrowest.chars ? a : b));
  console.log(
    `\n  across the site: ${narrowest.narrowest.chars} (${narrowest.narrowest.selector.slice(0, 30)}) ` +
      `to ${widest.widest.chars} (${widest.widest.selector.slice(0, 30)})`,
  );
}

const byKind = {
  narrow: problems.filter((p) => p.kind === 'narrow'),
  wide: problems.filter((p) => p.kind === 'wide'),
  contrast: problems.filter((p) => p.kind === 'contrast'),
};

if (problems.length === 0) {
  console.log(
    `\nNo text under ${MIN_WIDTH}px, none past ${MAX_CHARS} characters, ` +
      `nothing below ${MIN_RATIO}:1.\n`,
  );
  process.exit(0);
}

console.error(`\nLayout check failed: ${problems.length} problem(s).`);

if (byKind.narrow.length > 0) {
  console.error(
    `\n  ${byKind.narrow.length} element(s) holding ${MIN_WORDS}+ words laid out ` +
      `under ${MIN_WIDTH}px:\n`,
  );
  for (const p of byKind.narrow.slice(0, 15)) {
    console.error(
      `    ${p.route}  [${p.theme} ${p.width}px ${p.pass}]\n` +
        `      ${p.selector}  ${p.boxPx}px wide, ${p.words} words\n` +
        `      "${p.text}..."\n`,
    );
  }
  if (byKind.narrow.length > 15) console.error(`    ...and ${byKind.narrow.length - 15} more.\n`);
}

if (byKind.wide.length > 0) {
  console.error(`\n  ${byKind.wide.length} block(s) of running text past ${MAX_CHARS} characters:\n`);
  for (const p of byKind.wide.slice(0, 15)) {
    console.error(
      `    ${p.route}  [${p.theme} ${p.width}px ${p.pass}]\n` +
        `      ${p.selector}  ${p.chars} chars (${p.boxPx}px), ${p.words} words\n` +
        `      "${p.text}..."\n`,
    );
  }
  if (byKind.wide.length > 15) console.error(`    ...and ${byKind.wide.length - 15} more.\n`);
}

if (byKind.contrast.length > 0) {
  console.error(`\n  ${byKind.contrast.length} text/background pair(s) below the AA ratio:\n`);
  for (const p of byKind.contrast.slice(0, 15)) {
    console.error(
      `    ${p.route}  [${p.theme}]\n` +
        `      ${p.selector}  ${p.ratio}:1, needs ${p.need}:1  (${p.fontPx}px w${p.weight})\n` +
        `      "${p.text}..."\n`,
    );
  }
  if (byKind.contrast.length > 15) console.error(`    ...and ${byKind.contrast.length - 15} more.\n`);
}

process.exit(1);
