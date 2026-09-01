// The independent auditors: axe-core and Lighthouse, run against the built
// output and allowed to fail the build.
//
// WHY THIS EXISTS, AND WHY IT IS NOT OPTIONAL
//
// Every checker in scripts/ was written here, which means every one of them
// encodes the assumptions of whoever wrote it — and a checker cannot find a
// mistake it shares. That has now happened twice, both times silently:
//
//   1. The measure. layout-check estimated characters per line as
//      width / (fontSize * 0.5), the same average-glyph guess that produced the
//      original `ch` error it was supposed to catch. It passed a footer line
//      running at 97 characters.
//   2. The contrast. layout-check read getComputedStyle().color and ignored
//      `opacity`, so an opacity:0.55 on a 5.25:1 grey measured as 5.25:1 and
//      passed. It was actually 2.22:1. Lighthouse found it; we did not.
//
// Neither was caught by writing more of our own checks. Both were caught, or
// would have been, by a tool built by someone who did not share the assumption.
// So an outside auditor stays in the loop permanently.
//
// THE RULE: when this script and our own checks disagree, our checks are wrong
// until proven otherwise. Do not add an exclusion here to make a page pass.
// Find what our checker is failing to see, fix that, and let this agree.
import { createServer } from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const AXE = join(ROOT, 'node_modules/axe-core/axe.min.js');

// Lighthouse is slow, so it samples; axe is fast and sees every page.
const LIGHTHOUSE_ROUTES = [
  '/',
  '/topics/problem-of-suffering/',
  '/about/',
  '/hu/temak/teremtes-vagy-evolucio/',
  '/search/',
];

// Accessibility, best practices and SEO are things we control and currently
// hold at 100, so anything less is a regression to look at. Performance is
// measured here against a local server with no latency, no CDN and no
// compression: the number moves several points run to run and is not
// comparable to production. The floor is a tripwire for a real regression --
// a blocking script, an unsized image -- not a target.
const FLOORS = { accessibility: 100, 'best-practices': 100, seo: 100, performance: 80 };

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

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
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
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

const routes = (await walk(DIST))
  .map((file) => `/${relative(DIST, file)}`.replace(/index\.html$/, ''))
  .sort();

const axeSource = await readFile(AXE, 'utf8');
const problems = [];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--remote-debugging-port=9222'],
});

// --- axe-core, every page, both themes, collapsed and expanded ---------------
let axeChecks = 0;
for (const theme of ['light', 'dark']) {
  const context = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const route of routes) {
    for (const pass of ['collapsed', 'expanded']) {
      await page.goto(base + route, { waitUntil: 'domcontentloaded' });
      if (pass === 'expanded') {
        const opened = await page.evaluate(() => {
          const panels = [...document.querySelectorAll('details')];
          for (const panel of panels) panel.open = true;
          return panels.length;
        });
        if (opened === 0) continue;
      }
      await page.evaluate(() => document.fonts.ready);
      await page.addScriptTag({ content: axeSource });
      const result = await page.evaluate(async () =>
        // @ts-expect-error - injected above
        window.axe.run(document, {
          resultTypes: ['violations'],
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
        }),
      );
      axeChecks += 1;

      for (const violation of result.violations) {
        for (const node of violation.nodes.slice(0, 2)) {
          problems.push(
            `axe  ${route} [${theme} ${pass}]  ${violation.id} (${violation.impact})\n` +
              `        ${violation.help}\n` +
              `        ${node.target.join(' ')}\n` +
              `        ${(node.failureSummary ?? '').split('\n').slice(1, 3).join(' ').trim()}`,
          );
        }
      }
    }
  }
  await context.close();
}
console.log(`  axe-core: ${routes.length} page(s) x light/dark x collapsed/expanded = ${axeChecks} run(s).`);

// --- Lighthouse, sampled -----------------------------------------------------
const rows = [];
for (const route of LIGHTHOUSE_ROUTES) {
  const result = await lighthouse(base + route, { port: 9222, output: 'json', logLevel: 'error' });
  const scores = Object.fromEntries(
    Object.entries(result.lhr.categories).map(([key, c]) => [key, Math.round(c.score * 100)]),
  );
  rows.push({ route, ...scores });
  for (const [key, floor] of Object.entries(FLOORS)) {
    if (scores[key] < floor) {
      problems.push(`lighthouse  ${route}  ${key} ${scores[key]}, below the floor of ${floor}.`);
    }
  }
}

await browser.close();
await new Promise((r) => server.close(r));

console.log(
  `\n  ${'route'.padEnd(38)} ${'perf'.padStart(5)} ${'a11y'.padStart(5)} ` +
    `${'best'.padStart(5)} ${'seo'.padStart(5)}`,
);
for (const r of rows) {
  console.log(
    `  ${r.route.padEnd(38)} ${String(r.performance).padStart(5)} ` +
      `${String(r.accessibility).padStart(5)} ${String(r['best-practices']).padStart(5)} ` +
      `${String(r.seo).padStart(5)}`,
  );
}

if (problems.length > 0) {
  console.error(`\nAudit failed (${problems.length} finding(s)) — see the note at the top of this file:\n`);
  for (const p of problems.slice(0, 25)) console.error(`  - ${p}`);
  if (problems.length > 25) console.error(`  ...and ${problems.length - 25} more.`);
  console.error(
    '\n  These tools do not share our checkers\' assumptions. A disagreement is a bug\n' +
      "  in ours until proven otherwise: fix what our checker cannot see, don't\n" +
      '  add an exclusion here.\n',
  );
  process.exit(1);
}

console.log('\nAudit passed: axe-core found no violations, and no Lighthouse category is below its floor.');
