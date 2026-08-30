import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * A quotation from a named thinker.
 *
 * Editorial rule: only real, verifiable quotations. If the exact wording could
 * not be confirmed against the work itself, `verified` is false and the text is
 * written as a clearly labelled paraphrase, which the UI renders as such.
 *
 * `original` carries the wording in the language the reader would find in the
 * source (English for the modern writers, the standard English translation for
 * Augustine, Aquinas and the like). Non-English locales translate `text` and
 * keep the original underneath in smaller type.
 */
const quote = z.object({
  text: z.string().min(1),
  author: z.string().min(1),
  work: z.string().min(1),
  /** String, not number: some sources are "c. 415" or "1st ed. 1859". */
  year: z.string().min(1),
  sourceUrl: z.string().url(),
  verified: z.boolean(),
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
 * `counter` gives the strongest objection an opponent raises and, where the
 * defender has one, the response. Those three levels are what the argument-map
 * view walks: claim -> objection -> response.
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
  arguments: z.array(argument).min(1),
});

/**
 * Used only where a topic's live dispute runs *inside* one tradition rather
 * than between the two sides — topic 6, where the four positions are all
 * Christian ones. Optional everywhere else.
 */
const familyPosition = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  heldBy: z.string().min(1),
  summary: z.string().min(1),
  scienceStanding: z.string().min(1),
  quote: quote.optional(),
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
  schema: z.object({
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
     * balance on a settled empirical question.
     */
    settledCore: z.string().optional(),
    sides: z.array(side).length(2),
    familyPositions: z.array(familyPosition).optional(),
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
      if (topic.status === 'settled-core' && !topic.settledCore) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['settledCore'],
          message:
            "status 'settled-core' requires a settledCore statement: say plainly what the experts have settled.",
        });
      }
      const positions = topic.sides.map((s) => s.position);
      if (new Set(positions).size !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sides'],
          message: 'the two sides must be one theist and one atheist',
        });
      }
    }),
});

export const collections = { topics };
