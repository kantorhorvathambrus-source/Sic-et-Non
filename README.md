# Sic et Non

Twenty debates between atheism and Christianity, with both sides given in the
strongest form their own best defenders would give them, and real quotations
from the thinkers who made the arguments.

Not an apologetics site, not an anti-religion site. It never declares a winner.
The editorial rules are published on the `/about` page in every language.

## Running it

```sh
npm install
npm run dev          # local dev server
npm run milestone    # astro check, then build, then link check
```

Individual commands:

| Command | What it does |
|---|---|
| `npm run check` | `astro check` — types and Astro diagnostics |
| `npm run verify:content` | content rules: every quote needs author, work, year, sourceUrl, verified |
| `npm run build` | runs the content check, then builds to `dist/` |
| `npm run linkcheck` | every internal link and `#anchor` in `dist/` resolves (`--external` also fetches outbound URLs) |
| `npm run search:index` | Pagefind index; not wired into the build until the search milestone |

## How it is put together

```
src/
  content.config.ts        Zod schema for a topic; the build fails on a bad file
  content/topics/<locale>/ one JSON file per topic per locale; English is the source of truth
  data/topics-index.json   all twenty topics with localised titles, so the home page
                           lists the unwritten ones too
  data/about.json          the editorial rules, in five languages
  i18n/                    UI strings per locale, plus the routing helpers
  lib/topics.ts            joins the five language versions of a topic by its id
  lib/richtext.ts          the [[term]] markup that turns into <dfn> plus glossary
  pages/[...path].astro    the whole route table, because path segments are localised
  components/pages/        home, about, topic, argument map
  styles/tokens.css        the design tokens, including the two matched side hues
```

Content is data. The same topic file renders as the standard two-column page and
as the argument map (`.../map`), which walks each argument as
claim → strongest objection → response.

### Routes

English sits at the root; the other four languages are prefixed, and the path
segments are localised too.

```
/                          /es/                   /hu/
/about                     /es/acerca-de          /hu/a-honlaprol
/topics/<slug>             /es/temas/<slug>       /hu/temak/<slug>
/topics/<slug>/map         /es/temas/<slug>/map   /hu/temak/<slug>/map
```

Argument `id`s are identical across locales, so the language switcher carries the
reader's current anchor across.

## Quotations

Read `CONTENT.md` before adding one. The short version: only real quotations,
checked before they are written into a file; if the exact wording cannot be
confirmed, write a paraphrase in your own words and set `verified: false`, and
the page will label it as a paraphrase; never invent a page number, an edition
or a URL.

## Deployment

Cloudflare Pages, static output.

- Build command: `npm run build`
- Output directory: `dist`
- No backend, no database, no accounts, no comments, no analytics.
