# Content status

Tracks which of the twenty topics are drafted, reviewed and translated.

- **drafted** — written, quotations checked, passes `npm run verify:content`
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

## The checklist for every topic

Run through this before marking a topic drafted. `npm run verify:content` enforces
the mechanical half; the rest is editorial judgement.

- [ ] **Every argument is quoted by someone who holds it.** No position appears
      only in the words of its opponents — not in the two sides, not in a context
      entry. This is the rule most likely to be broken by accident, because
      critics of a position are usually easier to quote than its defenders.
      *Enforced:* an argument carrying a critic's quote and no defender's fails
      the build; one with no quote at all warns.
- [ ] Both sides carry the **same number of arguments**, somewhere in 2 to 4.
      Symmetry inside a topic is the point; sameness across topics is not.
      *Enforced.*
- [ ] Every quotation has author, work, year, `sourceUrl` and a `verification`
      level. *Enforced.*
- [ ] A `settled-core` topic states its `settledCore` plainly, above the sides.
      *Enforced.*
- [ ] Each argument's `claim` reads as a complete one-line statement, because in
      the default view that line is the whole argument.
- [ ] "Where it stands" describes the state of the argument, not a verdict.
- [ ] "The common mistake" names an error made on *both* sides, or one on each.
- [ ] Every marked-up term has a glossary entry, and every glossary entry is used.
      *Enforced* (unused entries warn).

## How a topic is shaped

Three layers over one set of data:

1. **Default view, about 4 minutes.** The real question, the status tag and what
   it means, the settled core where there is one, each side's claims as one-line
   statements, the context entries as one-liners, then "Where it stands" and
   "The common mistake".
2. **An expanded argument.** Explanation, quotation, the strongest objection, the
   response. Built with `<details>`/`<summary>`, so the text is in the DOM
   whether open or shut: search indexes it, find-in-page finds it, the keyboard
   reaches it, and it prints. An "expand all" control ships hidden and is
   revealed by its own script, so it is never a dead button.
3. **The argument map** at `.../map`, which walks every argument as
   claim → objection → response.

Both times are shown in the badge: "4 min, or 14 min in full".

Two sections stay in layer 1 that a strict reading would push into layer 2:
`settledCore`, because a reader who reads nothing else must not come away
thinking the science is contested (editorial rule 3), and "Where it stands" plus
"The common mistake", because rule 4 makes them the payoff of the page. Together
they are about 2 of the 4 minutes. Collapsing them would hit 2 minutes exactly,
at the cost of the two things a skimming reader most benefits from.

### The `context` block

Optional, and used where a topic needs setup the two sides cannot carry. On topic
6 the live disagreement about Genesis and geology runs between four Christian
positions, which is not a disagreement between the two sides at all. Topics 13
and 19 are expected to want the same field. Topics that need no such section omit
it.

Each entry is a position stated by someone who holds it (`quote`) and then
answered (`standing`, optionally with `standingQuote`). The reply lives inside
the same disclosure as the position, so neither is read without the other.

## Quotation status

11 quotations on topic 6, present in all five locales. Every argument and every
position is carried by someone who holds it.

| Quotation | Work | Carries | Level |
|-----------|------|---------|-------|
| "Darwin made it possible to be an intellectually fulfilled atheist" | Dawkins, *The Blind Watchmaker* (1986), p. 6 | atheist argument | corroborated |
| "I cannot persuade myself that a beneficent & omnipotent God…" | Darwin to Asa Gray, 22 May 1860 | atheist argument | corroborated |
| "a skyhook is a 'mind-first' force…" | Dennett, *Darwin's Dangerous Idea* (1995) | atheist argument | corroborated |
| "I am a creationist and an evolutionist…" | Dobzhansky, *American Biology Teacher* 35 (1973) | Christian argument | corroborated |
| "it is a disgraceful and dangerous thing…" | Augustine, *De Genesi ad litteram* I.19 (c. 415) | Christian argument | corroborated |
| "superficial conflict but deep concord…" | Plantinga, *Where the Conflict Really Lies* (2011), p. ix | Christian argument | corroborated |
| "No apparent, perceived, or claimed evidence…can be valid if it contradicts…Scripture" | Answers in Genesis, *Statement of Faith* | young-earth creationism | corroborated |
| "What is Darwinism? It is Atheism." | Hodge, *What is Darwinism?* (1874) | old-earth creationism | corroborated |
| "By irreducibly complex I mean a single system…" | Behe, *Darwin's Black Box* (1996), p. 39 | intelligent design | corroborated |
| "We have concluded that it is not [science]…" | *Kitzmiller v. Dover* (2005) | the reply to intelligent design | corroborated |
| "God, who is not limited to space and time…" | Collins, *The Language of God* (2006), p. 178 | evolutionary creation | corroborated |

Two quotations were dropped when the topic was shortened, and are worth placing
where they fit better: Dawkins's "Biology is the study of complicated things that
give the appearance of having been designed for a purpose" (*The Blind
Watchmaker*, opening line), and Aquinas on holding a reading of Scripture "only
in such measure as to be ready to abandon it" (*Summa Theologiae* I q.68 a.1,
still in this topic's sources, and a natural fit for topic 14 or 19).

### Verification levels

`verification` records how far the wording was actually checked, and the page
prints the level rather than leaving the reader to assume:

| Level | Means | Rendered as |
|-------|-------|-------------|
| `primary` | the wording was read in the source text, or a scan of it | no label; this is the standard the site claims by default |
| `corroborated` | confirmed across several independent secondary sources, not read in the original | labelled "Corroborated", with a one-line note |
| `paraphrase` | our own words, because the exact wording could not be confirmed | labelled, roman type, no quotation marks |

**Everything on topic 6 is currently `corroborated`, and nothing is `primary`.**
This build environment's egress proxy allows web search but blocks direct page
fetches, so no quotation could be read in its source. Each was checked against
several independent results naming the same work, wording, year and page. The
build prints the mix on every run, so the number cannot quietly rot:

```
en/06-creation-or-evolution.json   11 quotes  primary 0  corroborated 11  paraphrase 0
```

Upgrading a quotation to `primary` is a one-field change once someone can open
the book, and needs no re-audit of anything else.

Source URLs point at publishers, journals of record, court records or full texts
where those exist (Norton, Simon & Schuster, Oxford, Harvard, UC Press, the
Darwin Correspondence Project, Justia, Project Gutenberg, New Advent). None rests
on a quote-aggregator site. A URL pointing at a reference page rather than the
text is a reason a quotation stays `corroborated`.

## Editorial notes on topic 6

- The status is `settled-core`, so the schema requires a `settledCore` statement.
  It renders above the two sides, before either argument is made.
- The two sides are the live dispute — whether a complete evolutionary account
  leaves anything for a creator to have done — not evolution versus creationism.
  Three arguments a side, each with a quotation, the strongest objection and a
  response.
- The four Christian positions live in the `context` block. Each states where the
  evidence lands, plainly, per editorial rule 3.
- Column order alternates by topic number (`orderedSides` in `src/lib/topics.ts`),
  so neither position has a permanent home on the left. Topic 6 is even, so the
  atheist side leads.
