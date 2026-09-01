# Decision records

Short notes on choices that look like bugs from the outside. Each one exists
because a future reader — including a future me — would otherwise "fix" it.

---

## D1. The two side accents have unequal WCAG contrast, and that is deliberate

**Date:** 2026-08-30
**Files:** `src/styles/tokens.css`, `scripts/palette-check.mjs`
**Status:** settled; enforced by `npm run check:palette`

### The observation someone will make

Run any contrast checker over the theist and atheist accent colours and you get
two different numbers:

| Theme | Accent OKLCH | Theist (hue 300) | Atheist (hue 180) | Gap |
|---|---|---|---|---|
| light (`:root`) | `L 46% C 0.09` | 7.11:1 | 6.43:1 | 0.68 |
| dark (media query) | `L 82% C 0.085` | 10.35:1 | 11.03:1 | 0.68 |
| dark (toggle) | `L 82% C 0.085` | 10.35:1 | 11.03:1 | 0.68 |

Two things stand out. The numbers are unequal within each theme, and the
*direction* of the inequality flips between light and dark: purple leads in
light, teal leads in dark.

The obvious next move is to nudge one hue's lightness until the two ratios
match. **Do not do that.**

### Why the numbers differ

WCAG relative luminance is a fixed weighted sum of the linearised sRGB
channels — `0.2126 R + 0.7152 G + 0.0722 B`. Green is weighted about ten times
as heavily as blue. A teal at hue 180 puts most of its chroma into the green
channel; a purple at hue 300 puts it into red and blue. So two colours that are
*perceptually* the same lightness land on different WCAG luminances purely
because of where their chroma sits, and the flip between themes is just the
accent moving from below the background to above it.

OKLCH lightness, by contrast, is perceptually uniform by construction. Setting
both accents to the same `L` is the statement we actually want to make: neither
side is visually louder than the other.

### What we chose

Equal OKLCH `L` and `C`, unequal WCAG ratios. The alternative — equal WCAG
ratios — would require unequal OKLCH lightness, which means one side would look
darker than the other on screen. That is a real editorial cost on a site whose
entire premise is that the two positions get symmetrical treatment. We would be
buying a matching pair of numbers in a spreadsheet by introducing a visible
asymmetry on the page: optimising the measurement instead of the thing.

Both ratios clear 4.5:1 with a wide margin — the tightest is 6.43:1, which is
AAA for normal text. Nothing is failing. There is no accessibility problem to
solve here, only a symmetry that a checker cannot see.

### What the check enforces

`scripts/palette-check.mjs` runs in `npm run milestone` and asserts three
things, in this order:

1. **Exact — the OKLCH invariant.** Within a theme, both accents share
   identical `L` and `C`; only hue differs. This is the property we actually
   care about, asserted directly rather than through a proxy.
2. **Floor — each accent is at or above 4.5:1** against its own background.
3. **Alarm, not spec — the WCAG gap between the two accents exceeds 1.5.**

Assertion 3 is a backstop, and its scope is narrower than it looks. **Measured
null result:** holding `L` and `C` fixed and sweeping hue through all 360°, the
WCAG ratio moves by at most **0.77 in light and 0.82 in dark**. The 1.5 alarm is
therefore *unreachable by a hue change alone* — swapping the teal for a yellow
at the same `L` and `C` will not trip it. What does trip it is someone changing
a lightness or chroma value and breaking the invariant, which is exactly the
mistake this record exists to prevent. Assertion 1 catches that first and says
so plainly; assertion 3 catches the same class of error if the invariant is ever
relaxed on purpose.

That distinction matters: read assertion 3 as "the palette drifted", not as
"the hues are unbalanced". It cannot tell you anything about hue.

### Falsification

Each assertion was tested against a deliberately broken `tokens.css` before
being trusted:

- **1** — `--theist` set to `L 50%` against `--atheist` at `L 46%`:
  *"the accents must share one OKLCH lightness; got 50% and 46%."* Fires.
- **2** — both accents raised to `L 85%` in the light theme:
  *"the theist accent is 1.56:1 against its background, below 4.5:1."* Fires.
- **3** — a yellow at hue 95 with equal `L`/`C`: **does not fire**, which
  prompted the hue sweep above. Re-falsified by moving `--atheist` from `L 46%`
  to `L 75%`: *"the two accents are 5.07 apart in WCAG ratio, past the 1.5
  alarm."* Fires.

`tokens.css` was restored from backup afterwards and the check re-run clean.

### If you want to change this

Changing the accent colours is fine. Changing them so that the two OKLCH
lightness values differ is not, unless you are also willing to say in this file
why one side should look heavier than the other.

---

## D2. An outside auditor runs on every build, and it wins ties

**Date:** 2026-09-01
**Files:** `scripts/audit-check.mjs`, `package.json` (`milestone`)
**Status:** standing rule

### The observation someone will make

`npm run milestone` runs axe-core over every built page in both themes,
collapsed and expanded, and Lighthouse over five sampled routes — 108 axe runs
and five Lighthouse runs, on top of eight checkers this repository already
owns. That looks redundant, and it is the slowest stage by a wide margin. The
obvious economy is to drop it, or to demote it to something run by hand before a
release.

Don't. It is here because our own checkers have twice been wrong in a way only
an outside tool could see.

### The two cases

**The measure.** `layout-check.mjs` counted characters per line as
`width / (fontSize * 0.5)` — the same average-glyph assumption that had already
produced a `74ch` cap measuring 89 characters. The checker was applying, to its
own output, the exact guess it existed to test. It passed a footer line running
at **97 characters** in Spanish and French for as long as it existed. What
caught it was replacing the estimate with a measurement, not another rule.

**The contrast.** `layout-check.mjs` read `getComputedStyle().color` and ignored
`opacity`. An `opacity: 0.55` on a 5.25:1 grey measured as 5.25:1 and passed;
the painted value was **2.22:1**. Lighthouse found it within an hour of the CSS
being written. Ours would not have found it at all, because "the colour is what
`color` says" was not a rule it checked — it was an assumption it was built on.

Both are the same failure: **a checker cannot find a mistake it shares.** More
of our own checks would not have helped, because they would have been written by
the same hand, on the same afternoon, out of the same idea of what can go wrong.
The only reliable corrective is a tool built by people who did not share the
assumption.

### The rule

**When the auditors disagree with our own checks, ours are wrong until proven
otherwise.** Find what our checker is failing to see, fix that, and let the
auditor go quiet on its own.

Do not add an exclusion, a rule filter, or a skipped route to make a page pass.
If an auditor is genuinely wrong about something — and they sometimes are —
the exclusion goes in with a comment naming the finding, why it is wrong here,
and what would make it right again. There are none at present.

This already paid for itself on its first run: axe flagged `label-title-only`
on the search input in all five languages. Pagefind labels its field with a
`title` attribute, which is a tooltip, not a label — it never appears for a
keyboard user and never appears on touch. Lighthouse had scored that page 100 on
accessibility. The fix was a real visible label, which is a better search box
than the one we had.

### The floors

`accessibility`, `best-practices` and `seo` are held at **100**, because they are
things we control and currently meet; anything less is a regression worth
reading. `performance` has a floor of **80** and is not a target: the audit runs
against a local server with no latency, no CDN and no compression, so the figure
moves several points between runs and is not comparable to production. Treat it
as a tripwire for something structural — a blocking script, an unsized image —
and re-measure against the deployed origin for anything else.
