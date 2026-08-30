import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * A quotation from a named thinker.
 *
 * `verification` records how far the wording was actually checked, because that
 * is the one thing this site cannot afford to be vague about:
 *
 *   primary      the wording was read in the source text, or in a scan or
 *                facsimile of it
 *   corroborated the wording was confirmed across several independent secondary
 *                sources, but nobody here has read it in the original
 *   paraphrase   our own words, not the author's
 *
 * The last two are labelled in the page, so the reader sees the standard rather
 * than having to trust it. A quotation still needs an author, a work, a year and
 * a source URL at every level; the build fails otherwise.
 */
const quote = z.object({
  text: z.string().min(1),
  author: z.string().min(1),
  work: z.string().min(1),
  /** String, not number: some sources are "c. 415" or "1st ed. 1859". */
  year: z.string().min(1),
  sourceUrl: z.string().url(),
  verification: z.enum(['primary', 'corroborated', 'paraphrase']),
  /** Page, section or line reference within the work, where one is known. */
  locator: z.string().optional(),
  original: z
    .object({
      text: z.string().min(1),
      language: z.string().min(1),
    })
    .optional(),
});

export type Quote = z.infer<typeof quote>;

/**
 * One argument, stated as its best defenders state it.
 *
 * `claim` is the whole of the argument in one line: it is what the default view
 * shows, and everything else here sits behind a disclosure. `counter` gives the
 * strongest objection an opponent raises and, where the defender has one, the
 * response. Those three levels are what the argument-map view walks.
 *
 * `quote` must be the words of someone who holds the claim, and `counter.quote`
 * the words of someone who raises the objection. An argument that carries only
 * an opponent's quote fails the build.
 */
const argument = z.object({
  /** Stable across locales; used for anchors, so the language switcher can keep the reader's place. */
  id: z.string().regex(/^[a-z0-9-]+$/),
  claim: z.string().min(1),
  explanation: z.string().min(1),
  quote: quote.optional(),
  counter: z
    .object({
      objection: z.string().min(1),
      response: z.string().optional(),
      quote: quote.optional(),
    })
    .optional(),
});

const side = z.object({
  label: z.string().min(1),
  position: z.enum(['theist', 'atheist']),
  arguments: z.array(argument).min(2).max(4),
});

/**
 * Setup a particular topic needs and others do not.
 *
 * Topic 6's live disagreement runs between four Christian positions rather than
 * between the two sides, and no summary of the two sides can carry that. Topics
 * 13 and 19 have the same shape. Topics that need no such section simply omit
 * the field: the twenty topics genuinely differ, and forcing one structure onto
 * all of them would cost more than it saves.
 *
 * `quote` is the position's positive case, stated by someone who holds it.
 * `standingQuote` is the reply from outside it. A position given only the reply
 * fails the build.
 *
 * `onConflict` is separate on purpose. A movement's most-quoted line is often
 * the one its critics chose — the sentence about what it does when the data
 * disagrees, rather than the case it would lead with. Quoting only that is a
 * strawman built entirely from true quotations. So the positive case goes in
 * `quote`, the defensive posture goes here, and the page shows them in that
 * order.
 */
const contextEntry = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  heldBy: z.string().min(1),
  /** The position in a single line. Shown in the default view; the rest is disclosed. */
  oneLine: z.string().min(1),
  summary: z.string().min(1),
  /** The positive case: what this position argues *for*. */
  quote: quote.optional(),
  /** How the position handles evidence against it. Never the only voice it gets. */
  onConflict: z
    .object({
      text: z.string().min(1),
      quote: quote.optional(),
    })
    .optional(),
  /** Where the evidence lands on this position, said plainly. */
  standing: z.string().min(1),
  standingQuote: quote.optional(),
});

const topics = defineCollection({
  loader: glob({
    pattern: ['**/*.json', '!**/_*.json'],
    base: './src/content/topics',
    // Without this the loader would key entries by the "id" field inside each
    // file, and the five language versions of one topic would collide. The
    // path is the identity: "en/06-creation-or-evolution".
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: z
    .object({
      /** Stable across locales. Joins the five language versions of one topic. */
      id: z.string().regex(/^[a-z0-9-]+$/),
      number: z.number().int().min(1).max(20),
      /** Localised: each locale's file carries its own URL slug. */
      slug: z.string().regex(/^[a-z0-9-]+$/),
      /** Always phrased as a question. */
      title: z.string().min(1),
      category: z.enum([
        'existence-of-god',
        'natural-science',
        'mind-and-will',
        'morality',
        'history-and-text',
        'faith-and-society',
      ]),
      status: z.enum(['settled-core', 'open', 'interpretive']),
      /** What is actually being disputed, once the slogans are stripped out. */
      realQuestion: z.string().min(1),
      /**
       * Required when status is 'settled-core': the factual core the relevant
       * experts have settled, stated plainly. Editorial rule 3 — never manufacture
       * balance on a settled empirical question. Shown in the default view, not
       * behind a disclosure, because a reader who reads nothing else must see it.
       */
      settledCore: z.string().optional(),
      sides: z.array(side).length(2),
      context: z
        .object({
          heading: z.string().min(1),
          intro: z.string().optional(),
          /** Background the positions do not carry — usually how the dispute arose. */
          note: z
            .object({
              heading: z.string().min(1),
              text: z.string().min(1),
              quote: quote.optional(),
            })
            .optional(),
          entries: z.array(contextEntry).min(2),
        })
        .optional(),
      whereItStands: z.string().min(1),
      commonMistake: z.string().min(1),
      sources: z
        .array(
          z.object({
            title: z.string().min(1),
            author: z.string().optional(),
            year: z.string().optional(),
            url: z.string().url(),
            note: z.string().optional(),
          }),
        )
        .min(1),
      /** Terms defined inline with <dfn>, surfaced on hover/tap and in the glossary. */
      glossary: z
        .array(z.object({ term: z.string().min(1), definition: z.string().min(1) }))
        .optional(),
    })
    .superRefine((topic, ctx) => {
      const fail = (path: (string | number)[], message: string) =>
        ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });

      if (topic.status === 'settled-core' && !topic.settledCore) {
        fail(
          ['settledCore'],
          "status 'settled-core' requires a settledCore statement: say plainly what the experts have settled.",
        );
      }

      if (new Set(topic.sides.map((s) => s.position)).size !== 2) {
        fail(['sides'], 'the two sides must be one theist and one atheist');
      }

      // Symmetry within a topic is the point; sameness across topics is not.
      // A topic may run two, three or four arguments a side, but never a
      // different number on each side, which would read as one side having more
      // to say.
      const [first, second] = topic.sides;
      if (first.arguments.length !== second.arguments.length) {
        fail(
          ['sides'],
          `both sides must carry the same number of arguments; got ${first.arguments.length} and ${second.arguments.length}.`,
        );
      }

      // No position is presented only in an opponent's words.
      topic.sides.forEach((sideValue, s) => {
        sideValue.arguments.forEach((arg, a) => {
          if (arg.counter?.quote && !arg.quote) {
            fail(
              ['sides', s, 'arguments', a],
              `argument "${arg.id}" is quoted only by the side objecting to it. Quote someone who holds the claim, or drop the objection's quote.`,
            );
          }
        });
      });

      (topic.context?.entries ?? []).forEach((entry, e) => {
        if (entry.standingQuote && !entry.quote) {
          fail(
            ['context', 'entries', e],
            `position "${entry.id}" is quoted only by its critics. Quote someone who holds it.`,
          );
        }
        if (entry.onConflict?.quote && !entry.quote) {
          fail(
            ['context', 'entries', e],
            `position "${entry.id}" is quoted only on what it does when evidence disagrees, which is the sentence its critics would choose. Quote its positive case too.`,
          );
        }
      });
    }),
});

export const collections = { topics };
