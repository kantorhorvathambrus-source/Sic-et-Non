# i18n-tools

The pipeline that built the Spanish, French and German topic files, and the
checks that keep them honest afterwards.

It exists because a translated topic file is mostly *not* translatable. Ids,
enums, quote attribution, years, source URLs and the stored English wording of
every quotation have to be identical across all five locales or the pages come
apart — the language switcher keeps a reader's place by assuming argument ids
match, and `scripts/verify-quotes.mjs` compares bibliographies across locales.
So the tooling here treats "which fields may a translator write" as a rule to
be enforced rather than a convention to be remembered.

## The parts

| File | What it does |
|---|---|
| `lib/paths.mjs` | The prose/frozen boundary, declared by key name, plus the walk that applies it |
| `lib/tables.mjs` | Names, work titles, bibliography titles and locators, keyed on the English string |
| `build-locale.mjs` | English + a prose payload → a locale file |
| `check-locale.mjs` | Proves only prose, slug, registered labels and `original` differ from English |
| `reproduce.mjs` | Proves every payload still rebuilds its committed file byte for byte |
| `show-topic.mjs` | Prints a topic's prose path by path, which is what a translator works from |
| `maps/<lang>-<NN>.json` | The prose payload for one file: `{ slug, prose: { path: string }, work? }` |

## Translating a topic

```
node scripts/i18n-tools/show-topic.mjs 17 > /tmp/en-17.txt    # read the English
#   write scripts/i18n-tools/maps/es-17.json
node scripts/i18n-tools/build-locale.mjs es 17                # build the file
node scripts/i18n-tools/check-locale.mjs es 17                # prove the structure
npm run verify:content                                        # the content rules
```

`build-locale.mjs` **refuses to write** unless the payload covers every prose
path and nothing else. That is the point: a missed string fails loudly instead
of leaving an English sentence in the middle of a Spanish page, and a stale
payload key fails instead of being ignored. When the English schema grows a
prose field, every payload starts failing until it is filled in — which is how
you find out, rather than shipping twenty files with a hole in them.

## What a translator may and may not touch

**Prose**, listed in `TRANSLATE` in `lib/paths.mjs`: claims, explanations,
labels, glosses, glossary terms and definitions, objections and responses,
summaries, notes, headings, quotation text, source notes.

**Frozen**, listed in `FROZEN`: ids, enums, positions, `author`, `year`,
`sourceUrl`, `verification`, `sawWhat`, and `original.text` — the English
wording each translated quotation was checked against. `original` stays in
English with `language: "en"` on purpose. Substituting a reconstructed French or
German "original" would assert source wording nobody has verified.

**Registered**, in `lib/tables.mjs` and nowhere else: `author`, `work`,
`sources[].title` and `locator`. These are printed next to the quotation, so a
descriptive one belongs in the page's language — but only through a table row
keyed on the English string, so the same source cannot end up labelled two ways
in two files. Identifiers are deliberately absent and stay as English has them:
page and section numbers, archive ids, edition names, and English chapter
titles quoted as titles.

A work title takes a parenthetical gloss rather than a replacement — `Pensées
(Pensamientos), trad. W. F. Trotter` — because a title is a retrieval key. The
gloss is applied to `quote.work` and `sources[].title` alike so a bibliography
entry and the quotation citing it cannot disagree.

## What `check-locale.mjs` actually checks

Run with no arguments it covers `es`, `fr` and `de` across all twenty topics and
prints nothing per file unless something is wrong.

- No path exists in the locale file that is not in English, except the two keys
  under `original`; no English path is missing.
- Every non-prose value is byte-identical to English, or is the registered
  localisation for that locale.
- The slug is lower-case ASCII with hyphens.
- Every `[[glossary link]]` resolves to a headword, every headword is linked at
  least once, and the link count matches English.
- Quote metadata is frozen, and every translated quotation carries the English
  wording under `original`.
- Quotation marks follow one convention per locale (`«…»` for es and fr, `„…“`
  for de, `„…”` for hu) with no stray marks from another language and no
  straight ASCII quotes.
- Length drift against English is reported past 1.35x or below 0.78x, because
  `scripts/layout-check.mjs` fails a line past 95 characters. Bibliography and
  work titles are exempt: they carry "Original (Translation)" by design, so
  their ratio measures the gloss rather than the translation.

Length drift is a **warning**, not a failure. It is a prompt to re-read a
string, and sometimes the honest translation really is longer.

## Known limits

**`hu` is not covered by the default check.** It was translated by hand before
this pipeline existed, so its names, work titles and locators are not in the
tables — `check-locale.mjs hu` reports 134 unregistered labels. Harvesting them
from the committed files would record whatever those files happen to say instead
of checking it, so they are left out until somebody reads them. Everything in
the check that does not depend on the tables already passes for `hu`.

**Topic 6 has no payload in any locale**, and `reproduce.mjs` records that as an
exemption. Its files are the original hand translation, brought to the same
editorial bar as the rest in October 2026 by direct edits rather than a rebuild.
Writing a payload from the committed file would prove nothing about how the file
was made.

**The tables are a registry, not a dictionary.** A row says "this English string
is rendered this way in this locale on this site". It is not a claim that the
rendering is the best one available — three German terms are flagged in
`STATUS.md` as pending native-speaker review.
