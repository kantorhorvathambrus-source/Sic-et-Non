#!/usr/bin/env node
// Checks every internal link and anchor in the built site against dist/.
//
// External URLs are listed but not fetched by default: this build runs behind a
// restricted egress proxy, so a failed request would say nothing about whether
// the link is good. Pass --external to try them anyway.

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const tryExternal = process.argv.includes('--external');

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

/** Route -> the set of element ids on that page. */
const idsByRoute = new Map();
/** Every static asset dist/ actually contains, as a root-relative path. */
const assets = new Set();

function routeOf(file) {
  const rel = relative(DIST, file);
  const route = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
  return route.replace(/\/$/, '') || '/';
}

for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const ids = new Set();
  for (const match of html.matchAll(/\sid="([^"]+)"/g)) ids.add(match[1]);
  idsByRoute.set(routeOf(file), ids);
}

async function collectAssets(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, item.name);
    if (item.isDirectory()) await collectAssets(full);
    else assets.add('/' + relative(DIST, full));
  }
}
await collectAssets(DIST);

const problems = [];
const externals = new Set();
let internalCount = 0;

for (const file of pages) {
  const from = routeOf(file);
  const html = await readFile(file, 'utf8');
  const hrefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

  for (const href of hrefs) {
    if (/^(https?:|mailto:|data:|#)/.test(href)) {
      if (href.startsWith('#')) {
        internalCount += 1;
        const id = decodeURIComponent(href.slice(1));
        if (id && !idsByRoute.get(from)?.has(id)) {
          problems.push(`${from}  ->  ${href}  (no element with that id on this page)`);
        }
      } else if (href.startsWith('http')) {
        externals.add(href);
      }
      continue;
    }

    if (!href.startsWith('/')) {
      problems.push(`${from}  ->  ${href}  (relative link; use root-relative paths)`);
      continue;
    }

    internalCount += 1;
    const [path, hash] = href.split('#');
    const target = path.replace(/\/$/, '') || '/';

    const isPage = idsByRoute.has(target);
    const isAsset = assets.has(path) || assets.has(href);

    if (!isPage && !isAsset) {
      problems.push(`${from}  ->  ${href}  (no page or file at this path)`);
      continue;
    }

    if (hash && isPage && !idsByRoute.get(target)?.has(decodeURIComponent(hash))) {
      problems.push(`${from}  ->  ${href}  (page exists, but has no id "${hash}")`);
    }
  }
}

if (tryExternal) {
  console.log(`Checking ${externals.size} external URL(s)...`);
  for (const url of externals) {
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      if (!response.ok) problems.push(`external ${url} responded ${response.status}`);
    } catch (error) {
      problems.push(`external ${url} could not be reached: ${error.message}`);
    }
  }
}

console.log(
  `Checked ${pages.length} page(s), ${internalCount} internal link(s), ` +
    `${externals.size} distinct external URL(s)${tryExternal ? '' : ' (not fetched)'}.`,
);

if (problems.length > 0) {
  console.error(`\nLink check failed (${problems.length}):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log('All internal links and anchors resolve.');
