# Deploying

The site is static: `dist/` is the whole thing. There is no backend, no
database, no environment variable the site reads at runtime, and no secret in
this repository.

## What must happen before every deploy

```
npm run milestone
```

That runs, in order: types, content rules, the build, Pagefind indexing, link
check, layout and contrast, palette, style, SEO/hreflang, and a real search
through the browser in all five languages. If it is green, the output in
`dist/` is deployable. If it is not, nothing else here matters.

`npm run lighthouse` is separate because it is slow and its performance figure
is not meaningful locally (see below).

## Cloudflare Pages, from the dashboard (Git integration)

This is the path to use. It needs no credential in the build environment and
rebuilds on every push.

**Workers & Pages → Create → Pages → Connect to Git**, pick this repository,
then:

| Setting | Value |
|---|---|
| Production branch | `claude/sic-et-non-debates-fbfmxa` |
| Framework preset | None (or Astro; it only prefills the two fields below) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave empty)* |

**Nothing needs to merge to `main` first.** There is no `main` on the remote —
`claude/sic-et-non-debates-fbfmxa` is the only branch, and it holds everything.
Point production at it. If a `main` is created later, change the production
branch in the dashboard and pushes to the working branch become preview
deployments, which is the usual arrangement and needs no change here.

### Node version

**20.3 or newer; the repo pins 22.** `.nvmrc` says `22` and `package.json`
declares `engines.node >= 20.3.0`. Cloudflare Pages reads `.nvmrc`, so the
version is set by the repository and there is nothing to configure — but if the
build image ever ignores it, set `NODE_VERSION` to `22` as a build variable.
Astro 5 requires 18.17.1+, 20.3+ or 22+; older Node fails at the build, not at
runtime.

### Environment variables

The site reads none at runtime: it is static files, and there is no key,
token, or endpoint anywhere in it. Set exactly one, and only to keep the build
fast:

| Variable | Value | Why |
|---|---|---|
| `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` | `1` | `playwright` is a devDependency used by the checks, not by the build. Cloudflare installs devDependencies, and Playwright's postinstall otherwise downloads a Chromium build the deploy will never open. |

That one is an optimisation, not a requirement — the build was verified to
complete with no browser available at all. `pagefind` **is** a devDependency the
build genuinely needs, so do not switch the install to production-only
dependencies.

### After the first deploy

Cloudflare prints the subdomain. If it is not `sic-et-non.pages.dev`, change
`site` in `astro.config.mjs` and the `Sitemap:` line in `public/robots.txt` to
match and push — see the warning below about why `check:seo` will not catch a
wrong origin.

## Cloudflare Pages, from the command line

```
npx wrangler pages project create sic-et-non --production-branch main
npx wrangler pages deploy dist --project-name sic-et-non
```

`wrangler.toml` names the project and the output directory. Authentication is
`wrangler login`, or `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the
environment — never in the repository.

The first deploy prints the subdomain, `https://sic-et-non.pages.dev` unless the
name is taken. **If Cloudflare assigns a different subdomain, change `site` in
`astro.config.mjs` and the `Sitemap:` line in `public/robots.txt` to match, then
rebuild.** Both are absolute-URL sources: canonicals, hreflang, the sitemap and
the Open Graph tags are all built from `site`, and a wrong origin there is worse
than no deploy — `npm run check:seo` will not catch it, because every URL will
be internally consistent and uniformly wrong.

### Connecting the real domain

Add it under Pages → the project → Custom domains, then change `site` and
`robots.txt` as above and redeploy. Keep one origin canonical: serving the same
pages on both `pages.dev` and the real domain without updating `site` splits the
crawl between two hostnames.

## What is in `dist/` and why

| Path | What it is |
|---|---|
| `sitemap.xml` | Built from the same route table as the pages (`src/lib/routes.ts`), with `xhtml:link` alternates per URL. `check:seo` fails if it and the built pages disagree in either direction. |
| `robots.txt` | Allows everything except `/pagefind/`, which is the index behind the on-page search and holds nothing the pages do not. |
| `404.html`, `es/404.html`, `fr/404.html`, `de/404.html`, `hu/404.html` | Cloudflare Pages serves the closest one walking up from the requested path, so a miss under `/hu/` answers in Hungarian. Astro writes the localised ones as directories; the `localised-404s` integration in `astro.config.mjs` moves them into place. |
| `_headers` | Security headers and cache lifetimes. The CSP is `default-src 'self'` with no external origin at all, which the site can afford because it loads nothing from anywhere else. |
| `pagefind/` | The search index and runtime, one index per language. |
| `og.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` | Generated by `npm run images` from the site's own palette and display face. Committed, not built on deploy. |

## Lighthouse

`npm run lighthouse` serves `dist/` on localhost and runs mobile emulation.

Latest run, after the contrast fix:

| Route | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| `/` | 98 | 100 | 100 | 100 |
| `/topics/problem-of-suffering/` | 100 | 100 | 100 | 100 |
| `/about/` | 100 | 100 | 100 | 100 |
| `/hu/temak/teremtes-vagy-evolucio/` | 90 | 100 | 100 | 100 |
| `/search/` | 95 | 100 | 100 | 100 |

Only First and Largest Contentful Paint fall below 90, and only on some runs.
**The performance column is the least trustworthy number here**: a local server
has no network latency, no CDN and no compression, so it flatters some metrics
and penalises others, and the figures move a few points run to run. Re-measure
against the deployed origin before treating any of them as real.

Accessibility at 100 is worth one caveat too. It was 96 on the topic page until
Lighthouse caught a 2.22:1 contrast failure that this repository's own contrast
check had passed — the check read the declared colour and ignored an `opacity`
that blended it toward the background. The checker now composites opacity and
colour alpha before measuring, and that gap is closed. But an automated pass is
evidence, not proof: every one of these tools is a set of rules someone wrote,
and the rule that catches your bug may not be in it.
