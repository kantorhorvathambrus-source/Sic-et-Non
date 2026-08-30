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
 * Runs in the page. Returns the outermost block-level elements that hold real
 * rendered text and are laid out too narrow, so one squeezed paragraph reports
 * once rather than once per ancestor.
 *
 * Two things are deliberately not counted as text. Anything the reader cannot
 * see — a `visibility: hidden` glossary tooltip, a `.visually-hidden` label for
 * screen readers — is not squeezed, it is hidden on purpose. And only block
 * boxes are measured: an inline <dfn> is as narrow as the word it wraps, which
 * is correct, not a bug.
 */
function findSqueezed({ minWidth, minWords }) {
  const BLOCK = new Set([
    'block', 'flow-root', 'grid', 'flex', 'list-item', 'table', 'table-cell',
  ]);

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

  /** Words the reader can actually see inside `root`. */
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

  const squeezed = [];

  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg')) continue;
    if (!BLOCK.has(getComputedStyle(el).display)) continue;
    if (!el.checkVisibility?.({ contentVisibilityAuto: true, visibilityProperty: true })) {
      continue;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    if (rect.width >= minWidth) continue;

    const words = visibleWordCount(el);
    if (words < minWords) continue;

    squeezed.push({ el, words, width: Math.round(rect.width) });
  }

  const elements = new Set(squeezed.map((entry) => entry.el));
  return squeezed
    .filter((entry) => {
      // Keep only the outermost offender in any chain.
      let parent = entry.el.parentElement;
      while (parent) {
        if (elements.has(parent)) return false;
        parent = parent.parentElement;
      }
      return true;
    })
    .map((entry) => {
      const el = entry.el;
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
      return {
        selector: `${el.tagName.toLowerCase()}${id}${cls}`,
        width: entry.width,
        words: entry.words,
        text: (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 70),
      };
    });
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
        const found = await page.evaluate(findSqueezed, {
          minWidth: MIN_WIDTH,
          minWords: MIN_WORDS,
        });
        for (const item of found) {
          problems.push({ route, theme, width, pass, ...item });
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

if (problems.length > 0) {
  console.error(
    `\nLayout check failed: ${problems.length} element(s) holding ${MIN_WORDS}+ words ` +
      `rendered narrower than ${MIN_WIDTH}px.\n`,
  );
  for (const p of problems.slice(0, 40)) {
    console.error(
      `  ${p.route}  [${p.theme} ${p.width}px ${p.pass}]\n` +
        `    ${p.selector}  ${p.width}px wide, ${p.words} words\n` +
        `    "${p.text}..."\n`,
    );
  }
  if (problems.length > 40) console.error(`  ...and ${problems.length - 40} more.\n`);
  process.exit(1);
}

console.log(`No text squeezed below ${MIN_WIDTH}px. `);
