// Screenshot set for review. Not part of the build; run it when a layout change
// needs looking at rather than measuring.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const OUT = process.argv[2] ?? join(ROOT, 'shots');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
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
const base = `http://127.0.0.1:${server.address().port}`;

const ROUTES = [
  ['topic-01', '/topics/beginning-and-cause/'],
  ['topic-03', '/topics/problem-of-suffering/'],
];
// Topic 6 is the only one carrying a declared objection source, so it is the
// only place the neutral "from within" / "from both sides" panel is visible.
const EXTRA = [['topic-06', '/topics/creation-or-evolution/']];
const WIDTHS = [360, 1280];
const THEMES = ['light', 'dark'];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const written = [];

for (const theme of THEMES) {
  const context = await browser.newContext({
    colorScheme: theme,
    // 1x, not 2x. A full-page shot of a long topic is already 5,000-15,000
    // pixels tall; doubling it puts the file past what most viewers accept.
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  for (const width of WIDTHS) {
    const page = await context.newPage();
    await page.setViewportSize({ width, height: 900 });
    for (const [name, route] of [...ROUTES, ...EXTRA]) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      if (!EXTRA.some(([n]) => n === name)) {
        const file = join(OUT, `${name}-${theme}-${width}.png`);
        await page.screenshot({ path: file, fullPage: true });
        written.push(file);
      }

      // Open every argument: collapsed pages cannot show the objection panels,
      // which is the thing under review.
      await page.evaluate(() => {
        for (const d of document.querySelectorAll('details')) d.open = true;
      });
      await page.waitForTimeout(60);
      const open = join(OUT, `${name}-${theme}-${width}-expanded.png`);
      await page.screenshot({ path: open, fullPage: true });
      written.push(open);
    }
    await page.close();
  }
  await context.close();
}

await browser.close();
await new Promise((r) => server.close(r));
for (const f of written) console.log(f);
