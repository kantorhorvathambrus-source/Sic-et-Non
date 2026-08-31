// Generates the raster icons and the Open Graph card from the same marks used
// on the site, so there is nothing to keep in sync by hand.
//
// Run it when the palette or the wordmark changes; the output is committed.
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const ROOT = new URL('..', import.meta.url).pathname;
const PUBLIC = join(ROOT, 'public');

// The two side accents at their light-theme values, and the page ground.
const THEIST = 'oklch(46% 0.09 300)';
const ATHEIST = 'oklch(46% 0.09 180)';
const GROUND = 'oklch(98.4% 0.004 85)';
const INK = 'oklch(24% 0.012 275)';
const RULE = 'oklch(72% 0.01 275)';

const icon = (size) => `
<style>
  html, body { margin: 0; }
  .mark {
    width: ${size}px; height: ${size}px;
    background: ${GROUND};
    display: grid; place-items: center;
    position: relative;
  }
  .rule { position: absolute; width: ${Math.max(1, size / 32)}px; height: ${size * 0.7}px; background: ${RULE}; }
  .dots { display: flex; gap: ${size * 0.19}px; }
  .dot { width: ${size * 0.225}px; height: ${size * 0.225}px; border-radius: 50%; }
  .t { background: ${THEIST}; }
  .a { background: ${ATHEIST}; }
</style>
<div class="mark">
  <div class="rule"></div>
  <div class="dots"><div class="dot t"></div><div class="dot a"></div></div>
</div>`;

const card = `
<style>
  @font-face {
    font-family: 'EB Garamond';
    src: url('FONT_GARAMOND') format('woff2');
    font-weight: 400;
  }
  html, body { margin: 0; }
  .card {
    width: 1200px; height: 630px;
    background: ${GROUND};
    color: ${INK};
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 96px; box-sizing: border-box;
    font-family: 'EB Garamond', Georgia, serif;
  }
  h1 { font-size: 104px; margin: 0 0 28px; font-weight: 400; letter-spacing: -0.01em; }
  p { font-size: 40px; margin: 0; color: oklch(45% 0.012 275); max-width: 26em; line-height: 1.35; }
  .rule { height: 3px; width: 220px; margin: 44px 0 0;
          background: linear-gradient(to right, ${THEIST} 0 50%, ${ATHEIST} 50% 100%); }
</style>
<div class="card">
  <h1>Sic et Non</h1>
  <p>Twenty debates between atheism and Christianity, both sides at their strongest.</p>
  <div class="rule"></div>
</div>`;

await mkdir(PUBLIC, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page = await context.newPage();

for (const [name, size] of [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-512.png', 512],
]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(icon(size));
  await page.screenshot({ path: join(PUBLIC, name), omitBackground: false });
  console.log(name, `${size}x${size}`);
}

// The card uses the site's own display face, read straight out of node_modules
// so it cannot drift from what the pages use.
const fontUrl = new URL(
  '../node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff2',
  import.meta.url,
).href;
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(card.replace('FONT_GARAMOND', fontUrl));
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(PUBLIC, 'og.png') });
console.log('og.png', '1200x630');

await context.close();
await browser.close();
