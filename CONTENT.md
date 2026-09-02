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

**Retrofit status.** Variants are in on topic 10. Still to do: topics 7, 8, 9,
11, 12, 13, then topics 1 to 6 in a single pass. Do not let this list go stale.

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
