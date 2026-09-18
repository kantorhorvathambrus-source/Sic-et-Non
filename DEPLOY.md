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

## Cloudflare Workers, from the dashboard (Git integration)

This is the path to use. It needs no credential in the build environment and
rebuilds on every push.

This is a **Workers project with static assets**, not a Pages project. The
distinction matters: the dashboard's Git flow runs `wrangler deploy`, which
reads `wrangler.jsonc`, and the older Pages config (`pages_build_output_dir`)
does not work with it. There is no Worker script — `wrangler.jsonc` has no
`main` — so the whole deploy is the contents of `dist/`.

**Workers & Pages → Create → Workers → Connect to Git (Import a repository)**,
pick this repository, then:

| Setting | Value |
|---|---|
| Production branch | `claude/sic-et-non-debates-fbfmxa` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | *(leave empty)* |

There is no "build output directory" field to fill in: the output directory is
`assets.directory` in `wrangler.jsonc`, which already points at `./dist`.

**Nothing needs to merge to `main` first.** There is no `main` on the remote —
`claude/sic-et-non-debates-fbfmxa` is the only branch, and it holds everything.
Point production at it. If a `main` is created later, change the production
branch in the dashboard and pushes to the working branch become preview
deployments, which is the usual arrangement and needs no change here.

### Node version

**20.3 or newer; the repo pins 22.** `.nvmrc` says `22` and `package.json`
declares `engines.node >= 20.3.0`. Workers Builds reads `.nvmrc`, so the
version is set by the repository and there is nothing to configure — but if the
build image ever ignores it, set `NODE_VERSION` to `22` as a build variable.
Astro 5 requires 18.17.1+, 20.3+ or 22+; older Node fails at the build, not at
runtime.

### Environment variables

The site reads none at runtime: it is static files, and there is no key,
token, or endpoint anywhere in it. Two matter at build time:

| Variable | Value | Required? |
|---|---|---|
| `SITE_URL` | the origin the site is served from, e.g. `https://sic-et-non.<your-subdomain>.workers.dev` | **Yes, on Workers Builds.** |
| `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` | `1` | No, but set it. |

`SITE_URL` is where canonical URLs, hreflang, `og:url`, the sitemap and
`robots.txt` all come from.

**Workers Builds injects no URL variable.** It sets `CI`, `WORKERS_CI`,
`WORKERS_CI_BUILD_UUID`, `WORKERS_CI_COMMIT_SHA` and `WORKERS_CI_BRANCH`, and
nothing else — there is no Workers equivalent of the `CF_PAGES_URL` that
Cloudflare Pages used to supply. A Worker's own hostname is
`<name>.<account subdomain>.workers.dev`, and this repository cannot know the
account subdomain, so the origin cannot be derived and has to be given.

So `astro.config.mjs` **fails the build** when `WORKERS_CI=1` and `SITE_URL` is
unset. That is deliberate: the alternative is a site whose every canonical URL
and whole sitemap point at a host that is not serving it, which is invisible in
the output because every URL is internally consistent and uniformly wrong.
Better a build that stops with a message than a deploy that looks fine.

Set it under **the Worker → Settings → Variables and Secrets**, as a plain text
variable, to the origin the site is actually served from. Change it when you
attach a custom domain.

`scripts/seo-check.mjs` additionally fails the build if `robots.txt` and the
sitemap end up naming different origins, which is what a half-finished domain
change looks like. It cannot catch an origin that is wrong but consistent.

`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` is an optimisation, not a requirement — the
build was verified to complete with no browser available at all. `pagefind`
**is** a devDependency the build genuinely needs, so do not switch the install
to production-only dependencies.

### After the first deploy

Open `/robots.txt` on the live site: the `Sitemap:` line is the origin the build
used. If it does not match the hostname you are reading it on, `SITE_URL` is
wrong — fix the variable and redeploy. That one line is the fastest check that
the whole site's URLs are right.

## Cloudflare Workers, from the command line

```
SITE_URL=https://sic-et-non.workers.dev npm run build
npx wrangler deploy
```

`wrangler deploy` reads `wrangler.jsonc` for the project name and the asset
directory, so neither is repeated on the command line. Check the configuration
without touching the account first:

```
npx wrangler deploy --dry-run
```

That reads the asset directory, reports the file count and exits 0 without
contacting Cloudflare, so it is the fast way to tell a config mistake from a
credentials one.

Building from the command line means Cloudflare's own build variables are not
set, so pass `SITE_URL` yourself or the build falls back to the literal in
`astro.config.mjs`.

`wrangler.jsonc` names the project and the asset directory. Authentication is
`wrangler login`, or `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the
environment — never in the repository. In a non-interactive shell `wrangler`
requires the token and will say so; that error means the configuration was
fine and only the credential is missing.

The first deploy prints the Worker's URL, `https://sic-et-non.<your-subdomain>.workers.dev`.
**Rebuild with `SITE_URL` set to it and deploy again**, because a command-line
build has no way to know it in advance. Canonicals, hreflang, the sitemap and
the Open Graph tags are all built from that one value.

`npm run check:seo` catches the case where `robots.txt` and the sitemap name
different origins, which is what a half-finished domain change looks like. It
cannot catch an origin that is wrong but consistent — if every URL says
`example.com` and the site is served from `workers.dev`, the check sees nothing
amiss. That one is on you to confirm against the live site.

### Connecting the real domain

Add it under the Worker → Settings → Domains & Routes, then set `SITE_URL` to
it as a build variable and redeploy — `robots.txt` is generated from the same
value, so there is no second place to edit. Keep one origin canonical: serving
the same pages on both `workers.dev` and the real domain without updating
`SITE_URL` splits the crawl between two hostnames.

## What is in `dist/` and why

| Path | What it is |
|---|---|
| `sitemap.xml` | Built from the same route table as the pages (`src/lib/routes.ts`), with `xhtml:link` alternates per URL. `check:seo` fails if it and the built pages disagree in either direction. |
| `robots.txt` | Allows everything except `/pagefind/`, which is the index behind the on-page search and holds nothing the pages do not. |
| `404.html`, `es/404.html`, `fr/404.html`, `de/404.html`, `hu/404.html` | Served because `wrangler.jsonc` sets `assets.not_found_handling` to `404-page`, which serves the *nearest* `404.html` walking up from the requested path, so a miss under `/hu/` answers in Hungarian. **This is configured, not automatic:** the default for static assets is a bare `404 Not Found` with no page at all, so removing that line would silently throw away all five. Astro writes the localised ones as directories; the `localised-404s` integration in `astro.config.mjs` moves them into place. |
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
