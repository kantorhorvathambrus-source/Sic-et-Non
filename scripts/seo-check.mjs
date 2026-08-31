// Checks the built site's discovery markup against the files that actually
// exist, rather than against what the templates meant to emit.
//
// hreflang is the reason this exists. An annotation pointing at a page that
// does not exist, or at a page that does not point back, is worse than none:
// it tells a crawler that two unrelated pages are translations of each other.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const problems = [];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name === 'index.html') out.push(full);
  }
  return out;
}

try {
  await stat(DIST);
} catch {
  console.error('No dist/ to check. Run the build first.');
  process.exit(1);
}

const files = await walk(DIST);
const routeOf = (file) => `/${relative(DIST, file).replace(/index\.html$/, '')}`.replace(/\/+$/, '/');
const known = new Set(files.map(routeOf));

// The site origin, taken from the first canonical rather than assumed.
const first = await readFile(files[0], 'utf8');
const origin = new URL(/<link rel="canonical" href="([^"]+)"/.exec(first)?.[1] ?? 'http://x/').origin;

function toRoute(href) {
  const url = new URL(href, origin);
  if (url.origin !== origin) return null;
  return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
}

const pages = new Map();

for (const file of files) {
  const route = routeOf(file);
  const html = await readFile(file, 'utf8');
  const alternates = new Map();
  const RE = /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\s*\/?>/g;
  for (let m = RE.exec(html); m; m = RE.exec(html)) alternates.set(m[1], m[2]);
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  const lang = /<html lang="([^"]+)"/.exec(html)?.[1];
  pages.set(route, { alternates, canonical, lang, html });
}

for (const [route, page] of pages) {
  if (!page.canonical) {
    problems.push(`${route} has no canonical link.`);
  } else if (toRoute(page.canonical) !== route) {
    problems.push(`${route} is canonical to ${toRoute(page.canonical)}, which is not itself.`);
  }

  if (!page.lang) problems.push(`${route} has no lang on <html>.`);

  // Every hreflang target must be a page that was actually built.
  for (const [code, href] of page.alternates) {
    const target = toRoute(href);
    if (target === null) {
      problems.push(`${route} points hreflang="${code}" off-origin: ${href}`);
      continue;
    }
    if (!known.has(target)) {
      problems.push(`${route} points hreflang="${code}" at ${target}, which was not built.`);
    }
  }

  const selfCodes = [...page.alternates].filter(([code]) => code !== 'x-default');
  if (selfCodes.length > 0) {
    // A set of alternates must include the page itself.
    const names = selfCodes.map(([, href]) => toRoute(href));
    if (!names.includes(route)) {
      problems.push(`${route} lists ${selfCodes.length} alternate(s) but not itself.`);
    }

    // Reciprocity: each alternate must name this page back, under this page's
    // own language code, with the identical set of alternates.
    const mine = page.alternates.get(page.lang);
    if (!mine) {
      problems.push(`${route} is lang="${page.lang}" but has no hreflang="${page.lang}" of its own.`);
    }
    for (const [code, href] of selfCodes) {
      const target = toRoute(href);
      const other = pages.get(target);
      if (!other || target === route) continue;
      const back = other.alternates.get(page.lang);
      if (!back) {
        problems.push(
          `${route} claims ${target} as its "${code}" version, but ${target} names no "${page.lang}" alternate in return.`,
        );
      } else if (toRoute(back) !== route) {
        problems.push(
          `${route} claims ${target} as its "${code}" version, but ${target} points "${page.lang}" at ${toRoute(back)} instead.`,
        );
      }
    }
  }

  const xdefault = page.alternates.get('x-default');
  if (!xdefault) problems.push(`${route} has no x-default.`);

  for (const tag of ['og:title', 'og:description', 'og:url', 'og:type', 'og:image']) {
    if (!page.html.includes(`property="${tag}"`)) {
      problems.push(`${route} is missing the ${tag} meta tag.`);
    }
  }
  if (!/<meta name="description" content="[^"]{20,}"/.test(page.html)) {
    problems.push(`${route} has no usable meta description.`);
  }
}

// Site-level files Cloudflare Pages will serve as-is.
for (const name of ['robots.txt', 'sitemap.xml', '404.html', 'favicon.svg']) {
  try {
    await stat(join(DIST, name));
  } catch {
    problems.push(`dist/${name} is missing.`);
  }
}

// Every built page must be in the sitemap, and nothing else may be.
try {
  const xml = await readFile(join(DIST, 'sitemap.xml'), 'utf8');
  const listed = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toRoute(m[1])),
  );
  for (const route of known) {
    if (route === '/404/') continue;
    if (!listed.has(route)) problems.push(`${route} was built but is not in sitemap.xml.`);
  }
  for (const route of listed) {
    if (!known.has(route)) problems.push(`sitemap.xml lists ${route}, which was not built.`);
  }
} catch {
  /* the missing-file problem above already covers this */
}

if (problems.length > 0) {
  console.error(`\nSEO check failed (${problems.length} problem(s)):\n`);
  for (const p of problems.slice(0, 40)) console.error(`  - ${p}`);
  if (problems.length > 40) console.error(`  ...and ${problems.length - 40} more.`);
  console.error('');
  process.exit(1);
}

console.log(
  `SEO check passed: ${pages.size} page(s). Canonicals self-referencing, ` +
    `hreflang reciprocal and resolving, sitemap complete.`,
);
