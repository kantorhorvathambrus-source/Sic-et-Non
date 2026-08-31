// Lighthouse against the built output, served locally.
//
// Local numbers are not production numbers: there is no network latency, no CDN
// and no compression here, so the performance figure is optimistic and the
// others are not. Treat performance as a floor to re-measure after deploy.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

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
  '.txt': 'text/plain; charset=utf-8',
};

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
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/', '/topics/problem-of-suffering/', '/about/', '/hu/temak/teremtes-vagy-evolucio/', '/search/'];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--remote-debugging-port=9222'],
});

const rows = [];
const notes = [];

for (const route of ROUTES) {
  const result = await lighthouse(
    base + route,
    { port: 9222, output: 'json', logLevel: 'error' },
    undefined,
  );
  const c = result.lhr.categories;
  rows.push({
    route,
    performance: Math.round(c.performance.score * 100),
    accessibility: Math.round(c.accessibility.score * 100),
    bestPractices: Math.round(c['best-practices'].score * 100),
    seo: Math.round(c.seo.score * 100),
  });

  // Anything short of 100 should say why, not just show a number.
  for (const [key, category] of Object.entries(c)) {
    if (category.score === 1) continue;
    for (const ref of category.auditRefs) {
      const audit = result.lhr.audits[ref.id];
      if (!audit || audit.score === null || audit.score >= 0.9 || ref.weight === 0) continue;
      notes.push(`${route}  [${key}] ${audit.title}`);
    }
  }
}

await browser.close();
await new Promise((r) => server.close(r));

console.log('\nLighthouse (mobile emulation, local server, uncompressed)\n');
console.log(
  `  ${'route'.padEnd(38)} ${'perf'.padStart(5)} ${'a11y'.padStart(5)} ` +
    `${'best'.padStart(5)} ${'seo'.padStart(5)}`,
);
for (const r of rows) {
  console.log(
    `  ${r.route.padEnd(38)} ${String(r.performance).padStart(5)} ` +
      `${String(r.accessibility).padStart(5)} ${String(r.bestPractices).padStart(5)} ` +
      `${String(r.seo).padStart(5)}`,
  );
}

if (notes.length > 0) {
  console.log('\n  Audits below 90:');
  for (const note of [...new Set(notes)]) console.log(`    ${note}`);
} else {
  console.log('\n  No weighted audit scored below 90 on any route.');
}
