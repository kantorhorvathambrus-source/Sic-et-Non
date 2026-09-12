/**
 * Writes AUDIT.md: the shape of all twenty topics in one table, plus the two
 * provenance counts that matter and cannot be eyeballed.
 *
 * Generated rather than hand-kept for the reason every count on this project is
 * now generated: five separate enumerate failures on this site were all a hand
 * or a filter that skipped a branch, and each one read as a smaller, tidier
 * number than the truth.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const EN = 'src/content/topics/en';

/** Source classes, most self-sufficient first. Order matters: first match wins. */
const SOURCE_CLASS = [
  {
    label: 'primary text, freely published',
    match:
      /gutenberg\.org|marxists\.org|davidhume\.org|victorianweb\.org|bible\.oremus\.org|hanover\.edu|vatican\.va|bible-researcher\.com|newadvent\.org|ccel\.org|dhspriory\.org|archive\.org|darwinproject\.ac\.uk|onthewing\.org/,
    note: 'The text itself is online and the wording is stable across many independent printings.',
  },
  {
    label: "author's own site or paper",
    match:
      /reasonablefaith\.org|edwardfeser\.blogspot|preposterousuniverse|toconnor\.org|tedsider\.org|samharris\.org|jpmoreland\.com|keithfrankish\.com|marcusjborg\.org|drjohnsanders\.com|nick-lane\.net|ehrmanblog\.org|robertdputnam\.com|stephenprothero\.com|users\.ox\.ac\.uk|acadiau\.ca|willamette\.edu|andrewmbailey\.com|stafforini\.com|spot\.colorado\.edu|russell-j\.com/,
    note: 'Hosted by the author or by a course page reproducing their text.',
  },
  {
    label: 'journal, encyclopedia or scholarly index',
    match:
      /plato\.stanford\.edu|iep\.utm\.edu|philpapers\.org|ndpr\.nd\.edu|jstor\.org|pubmed|academic\.oup\.com|cambridge\.org|springer|sciencedirect|onlinelibrary\.wiley|journals\.|nature\.com|direct\.mit\.edu|online\.ucpress\.edu|digitalcommons|place\.asburyseminary|bibleandcriticaltheory|ctc\.cam\.ac\.uk/,
    note: 'A source with its own editorial standard, quoting the wording.',
  },
  {
    label: 'publisher, institution or organisation page',
    match:
      /global\.oup\.com|press\.princeton\.edu|books\.google|hachettebookgroup|eerdmans\.com|yalebooks|wwnorton|simonandschuster|answersingenesis|biologos\.org|reknew\.org|philosophyofreligion\.org|bu\.edu|bc\.edu|bennington\.edu|cslewisinstitute|thegospelcoalition|str\.org|infidels\.org|naturalhistorymag|edge\.org|npr\.org|billmoyers|biotacast|betweentwocities|rachelheldevans|en\.wikipedia\.org|biblicalscholarship/,
    note: 'An institutional page carrying the wording; a single upstream in most cases.',
  },
  {
    label: 'quotation aggregator only',
    match: /goodreads\.com|wikiquote\.org|quotefancy|libquotes|quotepark|azquotes/,
    note:
      'THE WEAK CLASS. Aggregators copy from each other, so several agreeing hits can be one upstream. ' +
      'Every quotation here is named below so it can be pulled first.',
  },
];

const classOf = (url) =>
  SOURCE_CLASS.find((entry) => entry.match.test(url ?? '')) ?? {
    label: 'unclassified',
    note: 'No class matched the host. Treat as weak until checked.',
  };

const words = (parts) => {
  const text = parts.filter(Boolean).join(' ').trim();
  return text ? text.replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1').split(/\s+/).length : 0;
};

const files = (await readdir(EN)).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort();

const rows = [];
const sawWhat = new Map();
const byClass = new Map();
const weak = [];
let quotesTotal = 0;
let paraTotal = 0;

for (const file of files) {
  const topic = JSON.parse(await readFile(join(EN, file), 'utf8'));
  const shown = [
    topic.title,
    topic.realQuestion,
    topic.settledCore,
    topic.whereItStands,
    topic.commonMistake,
  ];
  const hidden = [];
  const variants = { theist: 0, atheist: 0 };
  let argsPerSide = 0;
  let within = 0;
  let quotes = 0;
  let paraphrases = 0;
  let singleVoice = false;

  const tally = (quote) => {
    if (!quote) return;
    quotes += 1;
    quotesTotal += 1;
    if (quote.verification === 'paraphrase') {
      paraphrases += 1;
      paraTotal += 1;
    }
    sawWhat.set(quote.sawWhat, (sawWhat.get(quote.sawWhat) ?? 0) + 1);
    const cls = classOf(quote.sourceUrl);
    byClass.set(cls.label, (byClass.get(cls.label) ?? 0) + 1);
    if (cls.label === 'quotation aggregator only' || cls.label === 'unclassified') {
      weak.push({ topic: topic.number, quote, cls: cls.label });
    }
  };

  for (const item of topic.distinctions ?? []) shown.push(item.label, item.gloss);
  for (const item of topic.notes ?? []) {
    shown.push(item.heading, item.oneLine);
    hidden.push(item.text, item.quote?.text);
    tally(item.quote);
  }

  for (const side of topic.sides) {
    shown.push(side.label, side.singleVoice);
    if (side.singleVoice) singleVoice = true;
    argsPerSide = Math.max(argsPerSide, side.arguments.length);
    for (const argument of side.arguments) {
      shown.push(argument.claim);
      hidden.push(argument.explanation, argument.quote?.text);
      tally(argument.quote);
      if (argument.counter) {
        hidden.push(
          argument.counter.objection,
          argument.counter.sharedPremise,
          argument.counter.response,
          argument.counter.quote?.text,
        );
        tally(argument.counter.quote);
        if (argument.counter.objectionFrom === 'within') within += 1;
      }
      for (const item of argument.variants ?? []) {
        variants[side.position] += 1;
        hidden.push(
          item.label,
          item.heldBy,
          item.oneLine,
          item.summary,
          item.quote.text,
          item.changesTheObjection,
          item.againstSettledCore,
          item.objection?.text,
          item.objection?.sharedPremise,
          item.objection?.response,
          item.objection?.quote?.text,
        );
        tally(item.quote);
        tally(item.objection?.quote);
        if (item.objection?.from === 'within') within += 1;
      }
    }
  }

  if (topic.context) {
    shown.push(topic.context.heading, topic.context.intro);
    if (topic.context.note) {
      shown.push(topic.context.note.heading, topic.context.note.oneLine);
      hidden.push(topic.context.note.text, topic.context.note.quote?.text);
      tally(topic.context.note.quote);
    }
    for (const entry of topic.context.entries) {
      shown.push(entry.name, entry.oneLine);
      hidden.push(entry.heldBy, entry.summary, entry.standing, entry.quote?.text, entry.standingQuote?.text);
      tally(entry.quote);
      tally(entry.onConflict?.quote);
      tally(entry.standingQuote);
    }
  }

  const first = words(shown);
  rows.push({
    number: topic.number,
    title: topic.title,
    status: topic.status,
    argsPerSide,
    variants,
    singleVoice,
    within,
    quotes,
    paraphrases,
    notes: (topic.notes ?? []).length,
    layer1: Math.max(1, Math.round(first / 200)),
    full: Math.max(1, Math.round((first + words(hidden)) / 200)),
  });
}

const out = [];
out.push('# Twenty topics, audited');
out.push('');
out.push('Generated by `node scripts/audit-table.mjs`. Do not hand-edit.');
out.push('');
out.push('Every number here is walked from the content files, including variant slots and');
out.push('the objections attached to variants. Five separate undercounts on this project');
out.push('were a hand or a filter skipping a branch, and every one of them read lower than');
out.push('the truth, so nothing on this page is counted by eye.');
out.push('');
out.push('`C/A` is variants on the Christian and atheist sides. An asymmetric pair is a');
out.push('real answer: where one side has no live split the side says so in `singleVoice`,');
out.push('marked † below, and the schema fails the build if it does not.');
out.push('');
out.push('| # | Topic | Tag | Args/side | Variants C/A | `within` | Quotes | Paraphrases | Notes | Layer 1 | Full |');
out.push('|---|---|---|---|---|---|---|---|---|---|---|');
for (const row of rows) {
  out.push(
    `| ${row.number} | ${row.title} | \`${row.status}\` | ${row.argsPerSide} | ` +
      `${row.variants.theist}/${row.variants.atheist}${row.singleVoice ? ' †' : ''} | ${row.within} | ` +
      `${row.quotes} | ${row.paraphrases} | ${row.notes} | ${row.layer1} min | ${row.full} min |`,
  );
}
const sum = (key) => rows.reduce((n, row) => n + row[key], 0);
out.push(
  `| | **all twenty** | | **${sum('argsPerSide') * 2} slots** | ` +
    `**${rows.reduce((n, r) => n + r.variants.theist, 0)}/${rows.reduce((n, r) => n + r.variants.atheist, 0)}** | ` +
    `**${sum('within')}** | **${quotesTotal}** | **${paraTotal}** | **${sum('notes')}** | | |`,
);
out.push('');

out.push('## How much of the source was actually in front of us');
out.push('');
out.push('`sawWhat` records how much of the source was literally read, not how confident');
out.push('anyone feels. The build fails on `title-only`.');
out.push('');
out.push('| sawWhat | Quotations |');
out.push('|---|---|');
for (const [key, n] of [...sawWhat.entries()].sort((a, b) => b[1] - a[1])) {
  out.push(`| \`${key}\` | ${n} |`);
}
out.push('');
out.push('No quotation on this site has been read in its source text. Nothing is');
out.push('`full-text`, so nothing is `primary`, and every page says so to the reader.');
out.push('');

out.push('## What "corroborated" rests on');
out.push('');
out.push('`corroborated` means the wording was confirmed without the source being read.');
out.push('That covers a wide range, and the range is the point: several agreeing hits can');
out.push('be one upstream copied four times. Classified by what the cited source is.');
out.push('');
out.push('| Source class | Quotations | What it means |');
out.push('|---|---|---|');
for (const entry of [...SOURCE_CLASS, { label: 'unclassified', note: 'No class matched the host. Treat as weak until checked.' }]) {
  const n = byClass.get(entry.label) ?? 0;
  if (n > 0) out.push(`| ${entry.label} | ${n} | ${entry.note} |`);
}
out.push('');
if (weak.length > 0) {
  out.push('### The ones resting on aggregators');
  out.push('');
  out.push('Named individually because the user asked which they were. These are the');
  out.push('quotations most likely to be a single string propagating, and they should be');
  out.push('checked before anything else in this class.');
  out.push('');
  out.push('| Topic | Author | Work | Cited source |');
  out.push('|---|---|---|---|');
  for (const row of weak.sort((a, b) => a.topic - b.topic)) {
    out.push(`| ${row.topic} | ${row.quote.author} | ${row.quote.work} | ${row.quote.sourceUrl} |`);
  }
  out.push('');
}

await writeFile('AUDIT.md', `${out.join('\n')}\n`, 'utf8');
console.log(
  `AUDIT.md written: ${rows.length} topics, ${quotesTotal} quotation(s), ${paraTotal} paraphrase(s), ` +
    `${weak.length} resting on aggregators.`,
);
