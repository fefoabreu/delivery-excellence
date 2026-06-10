// Rasterizes the brand SVGs to the PNGs the site ships.
// Run from frontend/:  node branding/render.mjs
// Requires @resvg/resvg-js (installed transiently; node_modules is gitignored).
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';

const render = (svgPath, outPath, width) => {
  const svg = readFileSync(svgPath, 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true },
    background: 'rgba(0,0,0,0)',
  });
  writeFileSync(outPath, resvg.render().asPng());
  console.log(`  ✓ ${outPath} (${width}px wide)`);
};

render('branding/icon-master.svg', 'public/apple-touch-icon.png', 180);
render('branding/icon-master.svg', 'public/icon-512.png', 512);
render('branding/icon-master.svg', 'public/favicon-32.png', 32);
render('branding/og-banner.svg', 'public/og-banner.png', 1200);
console.log('done.');
