# Content status

Tracks which of the twenty topics are drafted, reviewed and translated.

- **drafted** — written, quotations verified, passes `npm run verify:content`
- **reviewed** — read back against the editorial rules by a human
- **en / es / fr / de / hu** — a content file exists for that locale

| # | Topic | Status tag | Drafted | Reviewed | en | es | fr | de | hu |
|---|-------|-----------|---------|----------|----|----|----|----|----|
| 1 | Did the universe begin, and does a beginning need a cause? | open | – | – | – | – | – | – | – |
| 2 | Why is there something rather than nothing? | interpretive | – | – | – | – | – | – | – |
| 3 | If God is good, why is there so much suffering? | open | – | – | – | – | – | – | – |
| 4 | If God wants to be known, why is he hidden? | open | – | – | – | – | – | – | – |
| 5 | Is the universe fine-tuned for life? | open | – | – | – | – | – | – | – |
| 6 | Creation or evolution? | settled-core | yes | not yet | ✓ | ✓ | ✓ | ✓ | ✓ |
| 7 | Where did the first living cell come from? | open | – | – | – | – | – | – | – |
| 8 | Is the mind more than the brain? | open | – | – | – | – | – | – | – |
| 9 | Do we have free will? | open | – | – | – | – | – | – | – |
| 10 | Can there be objective morality without God? | open | – | – | – | – | – | – | – |
| 11 | What should we make of the violence in the Old Testament? | interpretive | – | – | – | – | – | – | – |
| 12 | Can eternal damnation be just? | interpretive | – | – | – | – | – | – | – |
| 13 | Did Jesus exist, and did he rise? | settled-core | – | – | – | – | – | – | – |
| 14 | Is the Bible reliable? | open | – | – | – | – | – | – | – |
| 15 | Can a miracle ever be evidenced? | open | – | – | – | – | – | – | – |
| 16 | Why Christianity rather than any other religion? | open | – | – | – | – | – | – | – |
| 17 | Is religious experience evidence? | open | – | – | – | – | – | – | – |
| 18 | Has religion done more harm than good? | interpretive | – | – | – | – | – | – | – |
| 19 | Are science and religion at war? | settled-core | – | – | – | – | – | – | – |
| 20 | Can life have meaning without God? | interpretive | – | – | – | – | – | – | – |

Titles and status tags for the undrafted topics live in `src/data/topics-index.json`,
already translated into all five languages, so the home page lists the full set from
the start.

## Build milestones

1. **done** — scaffold, Zod schema, i18n routing, design tokens, topic 6 in all five languages
2. topics 1–5 in English
3. topics 7–13, then 14–20, in English
4. translate everything into es, fr, de, hu
5. argument-map view (already built), search, glossary page

## Quotation status

50 quotation objects across the five files: 10 distinct quotations, each present in
all five locales. Six carry the arguments, four carry the Christian positions, and
every one is by a different person.

| Quotation | Work | Verified |
|-----------|------|----------|
| "Darwin made it possible to be an intellectually fulfilled atheist" | Dawkins, *The Blind Watchmaker* (1986), p. 6 | yes |
| "I cannot persuade myself that a beneficent & omnipotent God…" | Darwin to Asa Gray, 22 May 1860 | yes |
| "a skyhook is a 'mind-first' force…" | Dennett, *Darwin's Dangerous Idea* (1995) | yes |
| "I am a creationist and an evolutionist…" | Dobzhansky, *American Biology Teacher* 35 (1973) | yes |
| "it is a disgraceful and dangerous thing…" | Augustine, *De Genesi ad litteram* I.19 (c. 415), tr. Taylor | yes |
| "superficial conflict but deep concord…" | Plantinga, *Where the Conflict Really Lies* (2011), p. ix | yes |
| The Genesis Flood's position, in our own words | Whitcomb & Morris (1961) | **no — labelled paraphrase** |
| "What is Darwinism? It is Atheism." | Hodge, *What is Darwinism?* (1874) | yes |
| "We have concluded that it is not [science]…" | *Kitzmiller v. Dover*, 400 F. Supp. 2d 707 (2005) | yes |
| "God, who is not limited to space and time…" | Collins, *The Language of God* (2006), p. 178 | yes |

Two further verified quotations were cut when the topic was shortened, and are worth
placing on the topics they fit even better: Dawkins's "Biology is the study of
complicated things that give the appearance of having been designed for a purpose"
(*The Blind Watchmaker*, opening line), and Aquinas on holding a reading of Scripture
"only in such measure as to be ready to abandon it" (*Summa Theologiae* I q.68 a.1,
still cited in this topic's sources, and a natural fit for topic 14 or 19).

The Whitcomb and Morris entry is the one place on topic 6 where the exact wording
could not be confirmed. Rather than reconstruct a sentence and attribute it, the
position is stated in our own words, `verified` is set to `false`, and the page
renders it under a "Paraphrase" label, in roman type, without quotation marks.

### How verification was done, and its limit

Wording, work and year for each quotation were checked by web search against
multiple independent results naming the same source. Worth recording honestly:
this build environment's egress proxy allows search but blocks direct page
fetches, so no quotation was read in the primary text itself. Before this
content is treated as final, each `verified: true` quotation should be checked
once against the work, and `sourceUrl` repointed at the primary text where the
current link is a reference page rather than the source.

`npm run verify:content` enforces the mechanical part of the rule: every quote
must carry author, work, year, a valid `sourceUrl` and an explicit `verified`
flag, or the build fails.

## Reading time — a known gap

The brief asks for 5 to 7 minutes per topic. Topic 6 currently reads at about
13 minutes in English (roughly 2,700 words at 200 words a minute), and 12 to 15
across the other locales, since Romance-language prose runs longer.

It was already cut once, from 17 minutes: one argument was dropped from each side
and the prose tightened throughout. The remaining gap is structural rather than
careless, and there are three levers, in the order they cost least:

1. **The four Christian positions cost about 3 minutes** and no other topic has that
   section. Take them out and topic 6 reads at 10; every other topic on this template
   would already be shorter.
2. **Drop to two arguments a side.** Six arguments, each with a quotation, the
   strongest objection and a response, is most of the length. Two a side brings the
   whole topic to roughly 9 minutes.
3. **Cut the objection-and-response pairs.** They are about a quarter of the length,
   but they are also what the argument-map view walks, so this is the expensive one.

Levers 1 and 2 together land inside the target. Which to pull is an editorial call,
and it sets the shape for the remaining nineteen topics, so it is worth deciding
before milestone 2 rather than after.

## Editorial notes on topic 6

- The status is `settled-core`, so the schema requires a `settledCore` statement.
  It is rendered above the two sides, before either argument is made.
- The two sides are the live dispute — whether a complete evolutionary account
  leaves anything for a creator to have done — not evolution versus creationism.
  Three arguments a side, each with a quotation, the strongest objection to it and
  a response.
- The four Christian positions are carried in the optional `familyPositions`
  field, which exists because on this one topic the four-way argument runs
  inside a tradition rather than between the two sides. Each carries a
  `scienceStanding` that says plainly where the science lands, per editorial
  rule 3.
- Column order alternates by topic number (`orderedSides` in `src/lib/topics.ts`),
  so neither position has a permanent home on the left. Topic 6 is even, so the
  atheist side leads.
