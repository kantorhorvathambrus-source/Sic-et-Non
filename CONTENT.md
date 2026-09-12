# Content status

Tracks which of the twenty topics are drafted, reviewed and translated.

- **drafted** — written, quotations checked, passes `npm run verify:content`
- **reviewed** — read back against the editorial rules by a human
- **en / es / fr / de / hu** — a content file exists for that locale

| # | Topic | Status tag | Drafted | Reviewed | en | es | fr | de | hu |
|---|-------|-----------|---------|----------|----|----|----|----|----|
| 1 | Did the universe begin, and does a beginning need a cause? | open | yes | not yet | ✓ | – | – | – | – |
| 2 | Why is there something rather than nothing? | open | yes | not yet | ✓ | – | – | – | – |
| 3 | If God is good, why is there so much suffering? | open | yes | not yet | ✓ | – | – | – | – |
| 4 | If God wants to be known, why is he hidden? | open | yes | not yet | ✓ | – | – | – | – |
| 5 | Is the universe fine-tuned for life? | open | yes | not yet | ✓ | – | – | – | – |
| 6 | Creation or evolution? | settled-core | yes | not yet | ✓ | ✓ | ✓ | ✓ | ✓ |
| 7 | Where did the first living cell come from? | open | yes | not yet | ✓ | – | – | – | – |
| 8 | Is the mind more than the brain? | open | yes | not yet | ✓ | – | – | – | – |
| 9 | Do we have free will? | open | yes | not yet | ✓ | – | – | – | – |
| 10 | Can there be objective morality without God? | open | yes | not yet | ✓ | – | – | – | – |
| 11 | What should we make of the violence in the Old Testament? | interpretive | yes | not yet | ✓ | – | – | – | – |
| 12 | Can eternal damnation be just? | interpretive | yes | not yet | ✓ | – | – | – | – |
| 13 | Did Jesus exist, and did he rise? | settled-core | yes | not yet | ✓ | – | – | – | – |
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

## How a status tag is assigned

Applied in order; the first that fits wins. Written down because a tag assigned
by feel drifts, and a drifting tag is worse than no tag.

1. **settled-core** — there is a factual core that the relevant experts have
   settled, and the remaining dispute is about what that core means rather than
   about the facts. *Test:* could you name the discipline and say what it has
   concluded? Topics 6, 13 and 19.
2. **open** — the disagreement is over something that could in principle be
   decided: the weight of some evidence, the soundness of an argument, a matter
   of fact. Specialists are still arguing and positions still move. *Test:* can
   you name people who have changed their minds, or an argument that shifted the
   field? Topics 1, 2, 3, 4, 5.
3. **interpretive** — the disagreement bottoms out in what someone counts as a
   good life, a good explanation or a satisfying answer. Further argument
   sharpens the disagreement without narrowing it. *Test:* if both sides granted
   every fact and every valid inference, would they still disagree?

The second test is about whether the *dispute* is live, not about whether
*evidence* could settle it. That distinction is what moved topic 2. It has no
empirical content at all — no observation bears on why there is anything — but
the principle of sufficient reason is under active argument by Pruss, Rasmussen,
Oppy and Della Rocca, and people in that literature change their minds. Under
test 2 that is open. It was tagged interpretive by feel, because "no evidence
can settle it" sounded like the definition, and the definition is narrower than
that.

**The tag describes the question the page's two sides are arguing, not the
topic's whole subject matter.** Where a topic contains several questions that
would take different tags, the `distinctions` strip names them and says which
one the page is for; the tag follows that one.

This is not a loophole, it is what stops the tag being meaningless. Most of
these topics contain two or three separable disputes with genuinely different
characters, and a tag that tried to average them would describe none of them.
The strip is what keeps it honest: a reader can see which question was chosen
and which were set aside, so the tag is a claim about something specific rather
than a mood.

Topic 12 is the case that produced the rule. It stacks two disputes:

- **What do the texts teach** — eternal conscious torment, annihilation or
  universal reconciliation? Decidable in principle, and positions demonstrably
  move: Robin Parry published *The Evangelical Universalist* under a pseudonym
  because he had changed his mind; John Stott moved to annihilationism late in
  life; conditional immortality went from fringe to a mainstream evangelical
  option on specific claims about `aiōnios`. That is test 2. **Open.**
- **Could eternal punishment be just?** Grant every exegetical fact — grant that
  the texts teach whichever view you like — and the atheist still says a good God
  would not, the Christian still says freedom or justice requires it, and nothing
  further that is granted moves either. That is test 3. **Interpretive.**

The page centres on the second, so the topic is tagged interpretive, the first
is marked `activeHere: false` in the strip, and the exegetical dispute gets a
`context` block of its own — the way the four positions sit on topic 6 — so that
a reader can see it is contested inside Christianity rather than being told the
page is not about it.

Topic 13 already had this shape and solved it before the rule was written: it is
`settled-core` on whether Jesus existed and was crucified, while the page argues
the resurrection, which is open. Topics 14 and 19 have it too. Check for it
whenever a tag feels like a compromise — that feeling usually means two
questions are being averaged.

Topic **18** (whether religion has done more harm than good) is the remaining
close call and should be re-checked when drafted: it has a substantial empirical
component that may amount to a settled core in places, and the same split may
apply.

## The three sourcing rules

They are the same mistake in three costumes, and each one was caught only after it
had already shipped. Read them together, because the fourth version will look
different again.

1. **Whose mouth the quote comes from.** No position appears only in the words of
   its opponents. *Caught on topic 6, where intelligent design was quoted by the
   judge who ruled against it.*
2. **Which of their sentences we picked.** Where a position has both a positive
   case and a defensive posture, the positive case comes first and gets at least
   as much space. A movement's most-quoted line is often the one its critics chose
   for it. *Caught on topic 6, where young-earth creationism was represented only
   by the statement that no evidence could count against it — a strawman built
   entirely out of true quotations.*
3. **Which of their arguments gets the space.** Every argument slot is spent on a
   live argument. A position that has been won, abandoned or superseded goes in a
   note. And check the pairing: does the other side's strongest argument have its
   actual strongest opponent facing it, or only a convenient one? *Caught on topic
   3, where a slot went to Plantinga's free will defence — a result everyone grants
   — while Rowe's fawn, the strongest argument on the page, had nothing facing it.*

The common thread is that each failure passes every mechanical check and produces
a page that looks balanced. Only reading the page as an opponent would catches
them.

## How much of the source did we actually have?

Every quotation and every paraphrase carries `sawWhat`, and it is not a
confidence rating. It records literally how much of the source was on the screen
when the entry was written:

| value | meaning |
|---|---|
| `full-text` | the work, chapter or article was read |
| `abstract` | an abstract or publisher's summary was read in full |
| `snippet` | a fragment reached us, typically quoted inside a search result |
| `title-only` | a title and a citation, and nothing else |

**Nothing is written from a title.** A title plus a citation is a pointer to a
source, not a source. `title-only` fails the build: if that is all we have, the
entry does not exist yet and goes on the candidates list with a note of what is
missing.

This field exists because the worst failure on this project was written from a
title — an argument invented out of the name of a paper, with a living
philosopher's name attached to it. `verification` records how far the wording was
checked. `sawWhat` records whether there was anything to check it against.

Fill it as you write the entry, never as a later pass. A field filled
retrospectively is a guess about what you saw.

## Decisions are made here, not in messages

Status tags, variant counts, slots versus notes, `objectionFrom` classification,
`singleVoice`, `againstSettledCore`, cutting a candidate on merit or parking it
on retrieval, and reading time over four minutes where the alternative misleads a
skimmer — all of these are decided by whoever is working, using the tests already
written down, and **recorded in this file as they are made**.

Not in a report. A report is read once and lost; this file is what the next
session reads. That has already gone wrong once on this project: an entire
specification was sent, never arrived, and nobody noticed for two rounds because
the only record of it was a message.

The two things that stop and ask are: an irreversible action, and a genuine
contradiction between two rules in this file that cannot be resolved from what is
written. Everything else gets decided and logged.

## Layer 1: the corrective stays, the background goes behind a disclosure

Notes are split. `oneLine` is the one sentence a skimming reader must not leave
without, and it is visible. `text` is the background, and it is disclosed.

*Measured, which is how the split was chosen.* Layer 1 had drifted to five and
six minutes, and the diagnosis offered first — longer opening sections — was
wrong. `realQuestion` was 124-168 words on topics 7-13 and 131-203 on topics 1-5;
the notes were 171-306 words against 0-208. Notes were the whole of the drift.
After the split, layer 1 is three to four minutes on every topic.

## Two tests for a paraphrase, not one

The `paraphrase` level answers one question: **is this accurate?** It does not
answer the other one, and the label that tells the reader does nothing at all
for the person named.

**The second test: would this person object to being associated with this
claim?**

Apply it separately, and apply it before the accuracy question, because a
paraphrase can be a fair reading of a position and still be something its author
would refuse. The distinction that matters:

- **A sympathetic statement of the person's own position** is low risk. If we
  have read them badly, they would say we misunderstood — an ordinary
  disagreement, and the label invites the reader to check.
- **A charge the person is said to make about a third party** is a different
  kind of thing entirely. Here our sentence becomes their accusation, and if it
  is not close to what they argue, we have not misread them: we have
  misrepresented a named living person, in public, on a page about honesty.

*Caught on topic 11.* An argument was attributed to Wes Morriston in our words —
that the Christian readings of the conquest texts "arrive in the order the
pressure is applied" and exhibit "accommodation rather than discovery". That is
a charge of bad faith against a field, under a living philosopher's name. Worse
than a bad paraphrase: the source was a Sophia paper nobody here had read. All
that existed was a title and a citation from a search result listing, and the
argument was written out of the title.

The label protected the reader and did nothing for him. It has been removed, and
the argument now stands unattributed and says on the page why.

**The rule that follows.** Never paraphrase an accusation under a real name. If
the argument is worth printing and no quotable version can be found, print it
unattributed as the standard objection it is, say on the page that this is what
has been done, cite the person only for what can actually be quoted, and put the
quotable version on the candidates list. An argument with no voice is a weaker
page. An invented voice is a different kind of thing.

**Two mechanical guards, since the judgement cannot be mechanised.** A
paraphrase's `locator` must state in words that the wording is ours — enforced,
and two paraphrases had shipped without one. And the reader-facing label no
longer claims to state "the writer's point"; it says it is our summary of the
position and has not been checked against the source, because claiming to have
captured someone's point is the assumption that failed here.

## Enumerate exhaustively, then cut

**Never stop at the first item that satisfies a slot.** List everything that
qualifies, write down why each one is in or out, then take the strongest up to
the cap.

*Caught on the `objectionFrom` labels for topics 7 to 13.* Every topic came out
with exactly one objection marked `within`, seven for seven. Re-derived from
scratch with no target number, the honest count was 1, 2, 2, 2, 2, 2, 1 — and
two of the original seven were on the wrong side with the wrong label. The
failure was not that the internal objections were invented. It was that finding
one per page and stopping pushed the second onto the other side, where it got
labelled as an opponent's objection.

*Caught a second time in the same session, on the same failure in a different
form.* The verification sheet had never indexed variant quotations and had no
priority queue; when it was taught to compute one, three paraphrases turned up in
argument slots where only one was known — Schellenberg on topic 4, Carroll on
topic 1, alongside Linville on topic 10. The first instance was a search that
stopped early. The second was a count that never started. Both are the same rule
going unapplied.

That is a search-termination failure, not a content one, and it will recur
anywhere the site enumerates: arguments per side, variants, sources, objections.

**A category that comes out with the same count every time is evidence of a
quota, not of the field.** When a count is suspiciously even, re-derive it
without looking at what you already have.

## What makes an objection internal

`objectionFrom: "within"` is a claim about **the objection's premises, never
about the arguer's biography**.

An objection is internal when it is *made on premises the position itself
accepts* — an argument from Scripture against a reading of Scripture, an
argument from naturalism against a naturalist conclusion, an argument from
evolutionary biology against an extension of evolutionary biology. That is a
property of the argument. It is readable from the text, stable over time, and
checkable by anyone.

Whether the person making it currently believes the thing is a separate fact:
private, subject to change, and not ours to assert. Getting a living person's
beliefs wrong on a site about belief is not a mistake this project can absorb.

So the field requires `sharedPremise` — prose naming what the objection and the
position both accept. The schema rejects a bare name: a `sharedPremise` that
reads like a list of people fails the build. Where an author's own position is
genuinely part of the point *and* is publicly and currently stated by them, the
prose may say so; otherwise the label carries no biographical claim at all.

*Worked case.* Thom Stark's book-length response to Paul Copan argues from the
text and from what inerrancy commits its holder to. That is `within` on the
argument's own terms, and saying so requires no claim about Stark. Eric Seibert
writes as a Christian and can be described as one. The two are handled
differently because the evidence is different, not because the arguments are.

## The checklist for every topic

Run through this before marking a topic drafted. `npm run verify:content` enforces
the mechanical half; the rest is editorial judgement.

- [ ] **Every argument is quoted by someone who holds it.** No position appears
      only in the words of its opponents — not in the two sides, not in a context
      entry. This is the rule most likely to be broken by accident, because
      critics of a position are usually easier to quote than its defenders.
      *Enforced:* an argument carrying a critic's quote and no defender's fails
      the build; one with no quote at all warns.
- [ ] **The positive case is quoted first, and at least as fully as the defensive
      posture.** A movement's most-quoted sentence is often the one its critics
      chose for it: the line about what it does when the data disagrees, rather
      than the case it would lead with. Quoting only that is a strawman built
      entirely out of true quotations, which is the hardest kind to notice and
      the easiest kind to be caught doing.

      Ask of every quotation, in writing, in the notes below: **is this the
      sentence this camp would choose to be represented by, or the one their
      opponents would choose for them?** If it is the second, the first is still
      missing. Where a position has both, the positive case goes in `quote` and
      the defensive posture in `onConflict`, which the page renders in that
      order. *Partly enforced:* a position quoted only in `onConflict` fails the
      build, and one that spends more words on handling contrary evidence than on
      its own case warns. Whether the chosen sentence is the representative one
      is a judgement no script can make.
- [ ] Both sides carry the **same number of arguments**, somewhere in 2 to 4.
      Symmetry inside a topic is the point; sameness across topics is not.
      *Enforced.*
- [ ] Every quotation has author, work, year, `sourceUrl` and a `verification`
      level. *Enforced.*
- [ ] A `settled-core` topic states its `settledCore` plainly, above the sides.
      *Enforced.*
- [ ] Each argument's `claim` reads as a complete one-line statement, because in
      the default view that line is the whole argument.
- [ ] **Every argument slot is spent on a live argument.** For each side, ask: is
      this what its serious defenders are arguing *now*? A won, abandoned or
      superseded position goes in `notes`, where it is not competing with a
      current argument for space. Then check the pairing — the other side's
      strongest argument should be facing its actual strongest opponent, not a
      convenient one. *Not enforceable:* no script can tell a live argument from a
      dead one. Answer it per topic in the sourcing review.
- [ ] **Describe the state of the evidence, never the state of the reader.** No
      sentence anywhere — and least of all in a `settledCore` box — may imply that
      holding the minority view makes someone unserious. A settled-core statement
      says who is not disputing something and in what field; it does not say
      "nobody disputes this", which is neither what we mean nor true. Where a
      large share of readers hold the minority view, say so with a figure and its
      scope, and point them at where the disagreement actually lives.
- [ ] Every topic shows `settledCore` (where it has one), "Where it stands" and
      "The common mistake" **in the default view, never behind a disclosure**. A
      reader who opens nothing must still get the honest summary. This is why
      layer 1 runs to about four minutes rather than two.
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

`settledCore`, "Where it stands" and "The common mistake" stay in layer 1 on
every topic, and are never put behind a disclosure. Together they are about 2 of
the 4 minutes. Collapsing them would hit 2 minutes exactly, at the cost of the
two things a skimming reader most benefits from — so 4 minutes is the standard,
not a miss.

### Variants: a side does not speak with one voice

Each side used to present a few arguments as though the side agreed with itself.
It does not. A reader came away thinking "the Christian answer on hell is eternal
conscious torment" or "the atheist answer on morality is that it is subjective",
and then the objections we printed were answering positions many people on that
side do not hold. Real arguments fail this way constantly, and showing it is the
most useful single thing the site can do.

An argument may carry up to three `variants`: other ways people on that side hold
that position. The main argument stays the best-known form; variants render
**collapsed beneath it, never at load**, so layer 1 does not grow.

**The test.** `changesTheObjection` is required prose, not a flag. A variant
earns its place only if the objection printed above it cannot do the same work
against it. If the objection to hell is that infinite punishment for finite
wrongs is disproportionate, the annihilationist does not have to answer it,
because on that view the punishment is not infinite. If a variant leaves the
objection's job unchanged, it is trivia — cut it.

**The consequence.** Objection panels carry `landsOn`: which variants the
objection actually reaches. An empty list is a real and informative answer — it
means the objection reaches the main form only. An objection that reaches *every*
variant fails the build, because then none of them is changing anything. This is
more honest than either printing an objection as a knockdown or dropping it.

**Every variant is either reached by the parent objection or carries its own.**
Escaping the parent objection is not the same as being unopposed. A variant that
renders with nothing pushing back on it reads as unchallenged, and a mechanism
that lets a position dodge criticism while looking like candour is worse than not
having the mechanism at all. The build fails on a variant that appears in no
`landsOn` and declares no `objection` of its own — and on one that has both,
because two objections on one version is a page arguing with itself.

Variant objections carry text and a source label, and a quotation where one can
be sourced. That is the same standard the parent objections are held to: no
objection anywhere on the site is required to carry a quotation, because the
sourcing rules govern *positions* needing their own voice, not objections. Where
the objection has a named author, name them in the prose.

**Admission.** Three tests, all required, and popularity is not among them:

1. A real constituency, **named** — a person, an institution, a recognised
   tradition. "Some argue" fails the build.
2. A public argument we can cite by the normal standard. A variant with no
   quotable advocate does not go in.
3. Internal coherence on its own terms.

A minority position with a serious case gets in; a majority position with no
argument behind it does not.

### Merit decides inclusion, retrieval decides timing

A position that passes the merit and constituency tests and is waiting only on a
quotation is **not cut**. It goes on the topic's candidates list below and into
VERIFICATION.md, and it goes onto the page as soon as the quotation exists.

This rule exists because the alternative is invisible and directional. The build
environment can search the web but cannot open a page or a PDF, so "could not
corroborate a verbatim" is a fact about a proxy configuration, not about
philosophy. Left unmarked, it would shape the site's coverage across twenty
topics in a direction nobody chose, and in six months "cut, could not
corroborate" would read to anyone looking — including us — as "cut on the
merits".

**Never let retrieval masquerade as merit.** When a position is left off a page,
the reason is recorded, and the two reasons are recorded differently.

#### Candidates, waiting only on a quotation

| Topic | Position | Constituency | What is needed |
|---|---|---|---|
| 10 | Constructivism | Christine Korsgaard, *The Sources of Normativity* (1996); T.M. Scanlon, *What We Owe to Each Other* (1998) | A verbatim from either. Both are among the most-cited books in modern moral philosophy; nothing about them is obscure. |
| 11 | A quotable version of the incompatible-readings objection, so the second atheist argument stops being unattributed | Randal Rauser, *Jesus Loves the Canaanites* (2021); the Bergmann, Murray and Rea volume *Divine Evil?* (2011), where Louise Antony and Evan Fales have chapters | Any verbatim making the objection. Note Rauser argues it as a Christian, so he would be a `within` objection rather than the atheist argument. |

*Cut on the merits, for contrast, so the difference stays visible:* theistic
Platonism on topic 10, because Adams holds it alongside modified divine command
theory and it therefore does not change what the objection has to do; and
Zagzebski's exemplarism, because it is an account of moral concepts rather than
of grounding.

**Against a settled core.** Where a variant conflicts with something the site has
tagged settled-core, it still goes in, stated at full strength by its own
advocates, and carries `againstSettledCore` saying where it stands against the
relevant field's conclusion. Quietly dropping it and printing it unmarked are
dishonest in different directions. This is the topic 6 rule applied one level
down.

**Symmetry is enforced.** Both sides carry variants or neither does, per topic.
Where a side genuinely has no live internal split on a question, it says so in
one line (`side.singleVoice`) rather than leaving an asymmetry a reader will read
as fracture. The build fails on a bare asymmetry.

**Retrofit status.** Variants are in on topics 7 to 13. Still to do: topics 1 to
6, in a single pass. Do not let this list go stale.

Topic 13 is the one `singleVoice` case so far: the atheist explanations there —
bereavement vision, guilt, cognitive dissonance, narrative growth — are parts of
one hypothesis rather than incompatible positions, and their proponents cite each
other rather than argue. One such case in seven topics is roughly what the field
looks like; seven would have been the quota pattern again.

### The `context` block

Optional, and used where a topic needs setup the two sides cannot carry. On topic
6 the live disagreement about Genesis and geology runs between four Christian
positions, which is not a disagreement between the two sides at all. Topics 13
and 19 are expected to want the same field. Topics that need no such section omit
it.

Each entry is a position stated by someone who holds it (`quote`), optionally
followed by how it handles evidence against it (`onConflict`), and then answered
(`standing`, optionally with `standingQuote`). All of it lives inside the same
disclosure, so no part is read without the others.

`onConflict` exists to keep the positive case and the defensive posture apart.
See the second checklist rule for why that separation matters more than it
looks.

`note` carries background the positions themselves cannot: on topic 6, that
flood geology in its modern form dates from 1961, which reframes the argument for
most readers before they meet the four positions.

## What the reader's eye actually gets

Everything above is about which sentences we print. This section is about
whether they can be read, and it is here because both entries are cases where a
number we trusted was not measuring what we thought.

### `ch` is not a character

The measure was first capped at `74ch`, on the reading that `ch` is one
character. It is not: `ch` is the advance width of the digit "0", about 0.6em in
Inter, while the conventional characters-per-line figure assumes an average
glyph nearer 0.5em. A `74ch` column measured as **89 characters**, well past the
65-75 target, and nothing complained because the checker was applying the same
0.5em assumption to its own output. The cap came down to `60ch`, about 72
characters.

### One measure cannot serve two typefaces

The `ch` fix was still wrong, in a way that only showed when the checker stopped
estimating. `scripts/layout-check.mjs` had been dividing each block's width by
`fontSize * 0.5` — the same average-glyph assumption. It now lays each block's
own text out on one line in that block's own computed font and divides by the
character count, which is the real average advance for that face, that size and
that language.

Measured that way, over every block on the site in all five locales:

| Face | Average character | Blocks measured |
|---|---|---|
| Inter (body) | 0.467-0.479em | 633 |
| EB Garamond (display) | 0.361-0.372em | 212 |

The display face is about 22% narrower per character, so one cap cannot serve
both. The estimate had been reporting every Garamond block roughly 28% narrower
than it really was, and it was hiding a live overrun: the footer tagline, the
only Garamond prose in the footer, carried its own `max-width: var(--measure-prose)`
that beat the global cap on specificity and ran to **97 characters** in Spanish
and French. English never tripped it, because English says the same thing in
fewer letters.

The cap is now per face and expressed in em, aimed at 70 characters: 33em for
Inter, 26em for EB Garamond. `--measure-text` inherits and is declared wherever
the face is declared; `scripts/style-check.mjs` fails the build if the two are
ever separated, or if running text is capped with a container width again.

### The band, as measured

| Face | en | es | fr | de | hu |
|---|---|---|---|---|---|
| Inter (body) | 56-73 | 54-75 | 55-75 | 53-72 | 53-75 |
| EB Garamond (display) | 51-68 | 51-74 | 51-74 | 50-74 | 52-74 |

**50 to 75 characters** across both faces and all five languages. The narrow end
is claim headings and short captions, which are meant to be short. The earlier
figure of 42-76 was an artefact of the flat 0.5em estimate and should not be
compared against this one.

The rule underneath: **a number is only a measurement if it was measured.** Both
of these were assumptions wearing a measurement's clothes, and both survived
because the checker shared the assumption it was supposed to test.

## Quotation status

13 quotations on topic 6, present in all five locales. Every argument and every
position is carried by someone who holds it.

| Quotation | Work | Carries | Level |
|-----------|------|---------|-------|
| "Darwin made it possible to be an intellectually fulfilled atheist" | Dawkins, *The Blind Watchmaker* (1986), p. 6 | atheist argument | corroborated |
| "I cannot persuade myself that a beneficent & omnipotent God…" | Darwin to Asa Gray, 22 May 1860 | atheist argument | corroborated |
| "a skyhook is a 'mind-first' force…" | Dennett, *Darwin's Dangerous Idea* (1995) | atheist argument | corroborated |
| "I am a creationist and an evolutionist…" | Dobzhansky, *American Biology Teacher* 35 (1973) | Christian argument | corroborated |
| "one should adhere to a particular explanation, only in such measure as to be ready to abandon it" | Aquinas, *Summa Theologiae* I q.68 a.1 (c. 1268) | Christian argument | corroborated |
| "superficial conflict but deep concord…" | Plantinga, *Where the Conflict Really Lies* (2011), p. ix | Christian argument | corroborated |
| "it is a disgraceful and dangerous thing…" | Augustine, *De Genesi ad litteram* I.19 (c. 415) | the historical note | corroborated |
| "Billions of dead things, buried in rock layers, laid down by water, all over the earth." | Ken Ham, Answers in Genesis (2016) | young-earth: the positive case | corroborated |
| "No apparent, perceived, or claimed evidence…can be valid if it contradicts…Scripture" | Answers in Genesis, *Statement of Faith* | young-earth: when evidence disagrees | corroborated |
| "What is Darwinism? It is Atheism." | Hodge, *What is Darwinism?* (1874) | old-earth creationism | corroborated |
| "By irreducibly complex I mean a single system…" | Behe, *Darwin's Black Box* (1996), p. 39 | intelligent design | corroborated |
| "We have concluded that it is not [science]…" | *Kitzmiller v. Dover* (2005) | the reply to intelligent design | corroborated |
| "God, who is not limited to space and time…" | Collins, *The Language of God* (2006), p. 178 | evolutionary creation | corroborated |

One quotation was dropped when the topic was shortened and is worth placing where
it fits better: Dawkins's "Biology is the study of complicated things that give
the appearance of having been designed for a purpose" (*The Blind Watchmaker*,
opening line).

### Sourcing review: topics 1, 2, 4 and 5

Rule 3 forced three arguments out of slots and into notes or out entirely. Each is
flagged because a reader might expect to find it:

- **Topic 1** drops the argument that an actually infinite past is impossible
  (Hilbert's Hotel and the rest). It is genuinely live in the literature, unlike
  Plantinga's defence, so this is a closer call than the others: with two slots a
  side it lost to the causal premise and the cosmology, which are what the
  argument now turns on in practice. Worth revisiting if the topic goes to three
  a side.
- **Topic 2** drops Swinburne's argument that theism is the simpler hypothesis.
  Live, but it is really an argument about explanatory virtue rather than about
  contingency, and it would have pulled the page toward a different question.
- **Topic 5** drops Robin Collins's formal likelihood version. It is the most
  rigorous statement of the argument, and it was cut because the page's own
  conclusion is that the probabilities it needs are the disputed thing — quoting a
  Bayesian formulation would have implied a settledness the topic denies.

On rule 1, every argument on all four topics is quoted by someone who holds it.
Two are labelled paraphrases rather than quotations, because no verbatim sentence
could be corroborated: Sean Carroll on topic 1 and J. L. Schellenberg on topic 4.
Both are in `VERIFICATION.md` with instructions to replace them with real
sentences if any can be found.

Two placements are worth stating plainly because they could look like
appropriation:

- **Vilenkin on topic 1** and **Hoyle on topic 5** are quoted on the theist side,
  and neither is a theist. Both hold exactly the claim the slot makes — that the
  evidence points to a beginning; that the constants look contrived — and the page
  says in the surrounding prose that they draw no theological conclusion. Quoting
  a non-theist for a premise a theist argument uses is fair; implying they endorse
  the conclusion would not be.
- **Ivan Karamazov on topic 3** is a character, and Dostoevsky was a Christian who
  put the objection at full strength on purpose. The citation says so.

### Sourcing review: topic 3

- **Wykstra** carries skeptical theism, which is the mainstream analytic answer to
  Rowe and is what replaced the free will defence as the live Christian move. It
  faces Rowe's fawn directly, which is what rule 3 is for.
- **Hume (Philo), Rowe, Ivan Karamazov** — each argues the atheist side. Ivan is a
  character rather than an author, which the citation says: Dostoevsky was a
  Christian who put the objection at full strength deliberately, and treating the
  line as Dostoevsky's own view would be the error.
- **Plantinga, Hick, Hart** — each argues the Christian side, in a book devoted to
  arguing it. Hart is included specifically because he rejects the theodicy move
  that Ivan attacks, so the Christian side is not represented only by the answer
  its critics find easiest to target. That is the same failure mode as topic 6's
  young-earth quote, caught in advance this time.
- **Nobody on this topic is quoted by an opponent.** Every objection is stated in
  our prose rather than borrowed from a critic's quotation, so no `counter.quote`
  is used and the rule has nothing to catch.

### Sourcing review: topic 6

*Is this the sentence the camp would choose to be represented by, or the one
their opponents would choose for them?* Answered per quotation, per the second
checklist rule.

- **Ken Ham, "billions of dead things"** — theirs. It is Answers in Genesis's own
  most-repeated line, used in their teaching material and even set to music for
  children. It states a positive prediction that they claim is met.
- **AiG Statement of Faith** — *theirs, but the one critics reach for.* This is
  the sentence most often quoted against young-earth creationism, because it
  concedes that no evidence could count against the position. It is real,
  published and fairly cited, but on its own it would have shown their
  epistemology at its most vulnerable instead of their case at its strongest.
  It is therefore in `onConflict`, after the positive case, answering "what
  happens when the data disagrees" — which is the question it actually answers.
  **This was the fix for a strawman assembled entirely from true quotations.**
- **Behe on irreducible complexity** — theirs. His own definition of his own
  central term, in the book that launched the movement.
- **Hodge, "It is Atheism"** — his. The line is famous and adversarial in tone,
  but Hodge chose it as the answer to his own book's title question; it is his
  thesis, not a critic's selection.
- **Dobzhansky, Augustine, Aquinas, Plantinga, Collins** — each argues for the
  position it is placed on, in a work devoted to arguing for it.
- **Dawkins, Darwin, Dennett** — same, on the atheist side.
- **Kitzmiller v. Dover** — deliberately an opponent's words, and placed in the
  `standingQuote` slot, which is the reply. It could not stand as the intelligent
  design entry's only quotation, and the build now enforces that.

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
fetches, so no quotation could be read in its source — and that is a standing
limit here, not a queue that will clear itself. Each was checked against
several independent results naming the same work, wording, year and page. The
build prints the mix on every run, so the number cannot quietly rot:

```
en/06-creation-or-evolution.json   13 quotes  primary 0  corroborated 13  paraphrase 0
```

`VERIFICATION.md` is the worksheet for closing that gap: one row per quotation,
with the exact published text, the source, and the specific thing to check,
ordered so the freely readable sources come first.

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


---

# Decision log

Decisions taken under standing authority, newest last. One line of reason each.
Anything that changed a tag, a count, a slot, or a classification belongs here.

| Date | Topic | Decision | Reason |
|---|---|---|---|
| 2026-08-30 | 2 | Tag moved interpretive → open | The PSR literature is live and people in it change their minds; test 2 is about whether the dispute moves, not whether evidence could settle it. |
| 2026-09-01 | 12 | Tag interpretive, with the exegetical question split off as `activeHere: false` | Two disputes stacked: what the texts teach is open, whether it could be just is interpretive, and the page argues the second. |
| 2026-09-01 | 7 | `objectionFrom: within` removed from the Axe argument | Fitted, not found: the strongest pressure on the estimate is the methodological critique, which is not distinctively internal. |
| 2026-09-06 | 11 | Second atheist argument left unattributed | The accusation could not be sourced to anyone; printing it unattributed is better than hanging it on a name, and the quotable version is parked on candidates. |
| 2026-09-11 | all | Notes split into a visible corrective and disclosed background | Measurement showed notes, not openings, were what pushed layer 1 past four minutes. |
| 2026-09-11 | 14 | Glossary entry `criterion of embarrassment` deleted rather than worked into a sentence | It belongs to the resurrection topic, not this one; a definition kept for a word the page never uses is decoration. |
| 2026-09-11 | 14 | The minimalism variant is attributed to Thomas L. Thompson and *The Mythic Past* alone, not to Lemche and Thompson jointly | A joint paraphrase puts each name behind whatever only the other said. One book whose thesis is secondarily described is the most we actually have. |
| 2026-09-11 | all | `verify-quotes.mjs` now sends variant quotations through `checkQuote` | They were being neither validated nor counted: the site reported 114 quotations and carries 155, and 6 paraphrases where there are 11. Fifth instance of the same enumerate failure. |
| 2026-09-11 | 15 | No Earman variant, despite his being the standard reference | A variant has to change what the objection must do. Earman's move *is* the parent argument here, so splitting it would have printed the same objection twice. He is in the sources and named in the objection prose. |
| 2026-09-11 | 15 | Swinburne is quoted on his definition rather than on his conclusion | The definition is the variant's whole move, and it is the only wording of his that could be corroborated. A fragment quoted exactly beats a sentence assembled by us. |
| 2026-09-11 | 13 | Layer 1 held at 5 minutes, not cut to 4 | The page carries a `settledCore` block the four-minute topics do not, and that block is the thing a skimmer on this topic most needs. Cutting to hit the number would have removed it. |
| 2026-09-11 | all | `readingTime` now counts variant objections and `singleVoice` | Sixth instance: variant prose was counted but the objection attached to a variant was not, so the full-read number understated every page carrying an escaping variant. |
| 2026-09-11 | 16 | Kitcher's symmetry argument printed as a labelled paraphrase | It is his signature argument and his reviewers describe it consistently, but no verbatim sentence could be corroborated. It passes the named-person test: this is the argument he is known for making, not an accusation. |
| 2026-09-11 | 16 | Boyer cut from the page after research | The only wording available was a reviewer's compression of his thesis. A second paraphrase would have been worse than one good argument. |
| 2026-09-11 | 16 | The inclusivist variant is quoted from *Nostra Aetate*, not from Rahner | Rahner's own wording could not be corroborated; the conciliar text can be, and an institutional holder is a stronger answer to "who actually holds this" than a theologian summarised at second hand. |
| 2026-09-11 | 17 | Alston printed as a labelled paraphrase | He is the central figure in this literature and leaving him out would have been retrieval deciding inclusion. No verbatim sentence of his could be corroborated; the argument summarised is the one his critics and commentators agree he makes. |
| 2026-09-11 | 17 | Katz quoted for the premise, with the page saying he does not draw the conclusion | The constructivist thesis is his and is quoted verbatim. The atheist step beyond it is the page's, and the locator says so rather than letting a reader infer his agreement. |
| 2026-09-11 | 17 | First `sawWhat: "abstract"` on the site (Griffiths 2006) | The structured abstract came back in full, so the claim rests on more than a snippet. Recorded because the provenance picture in the report turns on this distinction. |
| 2026-09-11 | 17 | The God Helmet is in a note, not an argument slot | It is the most-cited result on the atheist side of this topic and it failed independent replication. A dead result is not a live argument, and the note says why both sides should drop it. |
| 2026-09-11 | 18 | Tag confirmed `interpretive` after re-check | Test 1 fails: no discipline has settled the ledger. Test 2 fails: the metric is contested, not the evidence — grant both sides every fact and the disagreement survives, which is test 3. The settled and measurable sub-questions are parked in the distinctions strip. |
| 2026-09-11 | 18 | The Christian side leads with the borrowed-standard and category arguments, not with a body count | A body-count dispute is a dispute about the first distinction, which the page marks as not live. Cavanaugh and Holland are the strongest available cases and neither requires winning an arithmetic argument. |
| 2026-09-11 | 18 | The Putnam variant carries a `within` objection drawn from the authors' own finding | Their data locate the effect in congregational ties rather than belief. Printing the study without its own qualification would have been quoting half a result. |
| 2026-09-11 | 19 | The Draper–White collapse is the settled core, not an argument slot | Both sides on this page accept it, so arguing it would spend two slots on a question historians closed. The live dispute is about method now, and the strip says so. |
| 2026-09-11 | 19 | Layer 1 held at 5 minutes | A settled-core page carries a block the four-minute topics do not, and that block is exactly what a skimmer on this topic most needs to see. The same reason as topic 13; the background paragraph was moved into a note rather than cut. |
| 2026-09-11 | 19 | The Whitehead variant carries a `within` objection from historians of science | Its popularity outside the discipline outruns its support inside it, and printing it without that would have let a contested causal claim borrow the authority of the uncontested negative finding above it. |
| 2026-09-11 | 20 | The Euthyphro-for-meaning objection is `within`, not from the atheist side | Its premise is the theist argument's own — that a decision by someone does not make a purpose authoritative — turned on the theistic answer. It has been pressed inside theology since the medieval dispute about the divine will. Classified on the premise, not on who tends to say it. |
| 2026-09-11 | 20 | Camus is on the page because he owes nothing to the objective-value argument | Every other answer on the atheist side depends on topic 10 going a particular way. His does not, and the second note says so rather than letting the page look more self-contained than it is. |
| 2026-09-12 | all | `AUDIT.md` added, generated by `scripts/audit-table.mjs` and wired into `milestone` | The audit table and the provenance counts were going to live in a chat message, and a chat message is gone when the session clears. Generated rather than written so it cannot drift from the content. |
| 2026-09-12 | all | The verification worksheet now queues variant paraphrases too | Its filter matched `— the claim`, so five of the thirteen paraphrases never appeared in the queue. Sixth instance of the same enumerate failure, and the first one found by a count disagreeing with another count rather than by reading code. |
