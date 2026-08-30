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
| `npm run verify:content` | content rules, and prints the verification mix per topic |
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

Content is data. One topic file renders three ways: the default view, where each
argument is a single line; the same page with arguments expanded; and the
argument map at `.../map`, which walks each argument as
claim → strongest objection → response.

Expansion is `<details>`/`<summary>`, not a scripted show/hide, so the text is in
the DOM whether open or shut — indexed by search, reachable by keyboard, found by
find-in-page, and printed. The "expand all" control ships `hidden` and is revealed
by its own script, so without JavaScript there is no dead button and every
disclosure still works.

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

Read the checklist in `CONTENT.md` before adding one. The two rules that matter
most:

**No position is presented only in the words of its opponents.** If a page states
an argument, it quotes someone who actually holds it, and puts the reply beside
it. The build fails on an argument that carries a critic's quote and no
defender's.

**Say how far the wording was checked.** `verification` is `primary` (read in the
source text), `corroborated` (confirmed across independent sources but not read
in the original) or `paraphrase` (our own words). The last two are labelled in
the page, so the standard is visible to the reader instead of buried in this
repository. Never invent a page number, an edition or a URL.

## Deployment

Cloudflare Pages, static output.

- Build command: `npm run build`
- Output directory: `dist`
- No backend, no database, no accounts, no comments, no analytics.
