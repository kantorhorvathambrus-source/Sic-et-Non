// Search is a feature that fails silently: the box renders, returns nothing,
// and nobody notices. So it is checked by driving it.
//
// Two things matter. That the UI mounts at all — it is loaded at runtime from
// files the bundler never sees, so a rename in Pagefind breaks it without
// breaking the build. And that the indexes stay separated by language: one
// merged index would answer a Hungarian query with English pages.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml',
};

// route, the word to search for, and the locale whose pages it must return.
const CASES = [
  ['/search/', 'suffering', 'en'],
  ['/es/buscar/', 'evolución', 'es'],
  ['/fr/recherche/', 'évolution', 'fr'],
  ['/de/suche/', 'Evolution', 'de'],
  ['/hu/kereses/', 'teremtés', 'hu'],
];

const PREFIXED = ['es', 'fr', 'de', 'hu'];

// English is the unprefixed locale, so it owns "/" and "/topics/..." — it is
// defined by which prefixes a path does NOT have, not by one prefix it does.
function localeOf(path) {
  const first = path.split('/')[1];
  return PREFIXED.includes(first) ? first : 'en';
}

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.endsWith('/') ? join(DIST, path, 'index.html') : join(DIST, path);
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

const problems = [];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
const consoleErrors = [];
page.on('pageerror', (error) => consoleErrors.push(String(error)));
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});

for (const [route, term, locale] of CASES) {
  consoleErrors.length = 0;
  await page.goto(base + route, { waitUntil: 'networkidle' });

  try {
    await page.waitForSelector('#search input[type="text"]', { timeout: 10000 });
  } catch {
    const shown = await page.$eval('#search', (el) => el.textContent?.trim().slice(0, 120) ?? '');
    problems.push(`${route} never mounted a search box. The panel says: "${shown}"`);
    continue;
  }

  await page.fill('#search input[type="text"]', term);
  await page.waitForFunction(
    () => document.querySelectorAll('.pagefind-ui__result-link').length > 0,
    undefined,
    { timeout: 10000 },
  ).catch(() => {});

  const hits = await page.$$eval('.pagefind-ui__result-link', (links) =>
    links.map((link) => new URL(link.href).pathname),
  );

  if (hits.length === 0) {
    problems.push(`${route} returned nothing for "${term}", which is in the indexed text.`);
    continue;
  }

  const strays = [...new Set(hits.filter((path) => localeOf(path) !== locale))];
  if (strays.length > 0) {
    problems.push(
      `${route} answered "${term}" with ${strays.length} result(s) in another language: ` +
        `${strays.slice(0, 3).join(', ')}. The language indexes are not separated.`,
    );
  }

  if (consoleErrors.length > 0) {
    problems.push(`${route} logged a console error: ${consoleErrors[0].slice(0, 140)}`);
  }

  console.log(`  ${route.padEnd(18)} "${term}" -> ${hits.length} result(s), all in ${locale}`);
}

await browser.close();
await new Promise((r) => server.close(r));

if (problems.length > 0) {
  console.error(`\nSearch check failed (${problems.length} problem(s)):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('');
  process.exit(1);
}

console.log(`\nSearch check passed: ${CASES.length} locale(s) mount, answer, and stay in language.`);
