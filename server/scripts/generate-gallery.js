'use strict';

/**
 * Generates the bundled gallery artwork in web/public/gallery/.
 *
 * These are real SVG files served as static assets — not CSS placeholders.
 * Replace any file with a same-named .jpg and update the seed paths later to
 * use photographs instead; nothing else in the app needs to change.
 *
 * Run: node server/scripts/generate-gallery.js
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '../../web/public/gallery');

// One scene per gallery slot, per category theme.
const SCENES = [
  'unit', 'floor', 'machining', 'quality', 'warehouse', 'dispatch'
];

const THEME = {
  manufacturing: { hue: 210, scenes: ['unit', 'floor', 'quality', 'warehouse', 'dispatch', 'unit'] },
  machinery: { hue: 224, scenes: ['machining', 'unit', 'quality', 'floor', 'warehouse', 'dispatch'] },
  electronics: { hue: 190, scenes: ['quality', 'machining', 'unit', 'floor', 'warehouse', 'dispatch'] },
  construction: { hue: 28, scenes: ['dispatch', 'unit', 'floor', 'warehouse', 'machining', 'quality'] },
  automotive: { hue: 4, scenes: ['machining', 'dispatch', 'quality', 'unit', 'warehouse', 'floor'] },
  textile: { hue: 320, scenes: ['unit', 'floor', 'quality', 'warehouse', 'dispatch', 'machining'] },
  food: { hue: 38, scenes: ['quality', 'unit', 'floor', 'warehouse', 'dispatch', 'machining'] },
  chemical: { hue: 168, scenes: ['unit', 'quality', 'floor', 'warehouse', 'machining', 'dispatch'] },
  agriculture: { hue: 96, scenes: ['unit', 'dispatch', 'warehouse', 'floor', 'quality', 'machining'] },
  healthcare: { hue: 196, scenes: ['quality', 'machining', 'unit', 'warehouse', 'floor', 'dispatch'] },
  it: { hue: 244, scenes: ['floor', 'quality', 'machining', 'unit', 'warehouse', 'dispatch'] },
  professional: { hue: 258, scenes: ['floor', 'unit', 'quality', 'warehouse', 'dispatch', 'machining'] },
  retail: { hue: 12, scenes: ['unit', 'warehouse', 'dispatch', 'floor', 'quality', 'machining'] },
  logistics: { hue: 208, scenes: ['dispatch', 'warehouse', 'unit', 'floor', 'machining', 'quality'] },
  education: { hue: 176, scenes: ['floor', 'unit', 'quality', 'warehouse', 'dispatch', 'machining'] },
  hospitality: { hue: 342, scenes: ['unit', 'floor', 'quality', 'warehouse', 'dispatch', 'machining'] }
};

const LABELS = {
  unit: 'Manufacturing unit',
  floor: 'Production floor',
  machining: 'CNC machining cell',
  quality: 'Quality inspection',
  warehouse: 'Warehouse & storage',
  dispatch: 'Loading bay & dispatch'
};

// Deterministic pseudo-random from a string so runs are reproducible.
function hashInt(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function shade(hue, light, sat = 46) {
  return `hsl(${hue} ${sat}% ${light}%)`;
}

// Text nodes and aria-label are XML, so & < > must be escaped.
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sceneShapes(kind, hue, rand) {
  const p = [];
  const l1 = shade(hue, 62, 40);
  const l2 = shade(hue, 48, 42);
  const l3 = shade(hue, 32, 38);

  // Horizon / floor plane shared by every scene.
  p.push(`<rect x="0" y="300" width="640" height="300" fill="${shade(hue, 22, 24)}"/>`);
  p.push(`<rect x="0" y="296" width="640" height="6" fill="${shade(hue, 40, 30)}" opacity="0.7"/>`);

  if (kind === 'unit') {
    p.push(`<rect x="70" y="150" width="240" height="150" fill="${l2}"/>`);
    p.push(`<polygon points="70,150 110,120 350,120 310,150" fill="${shade(hue, 52, 42)}"/>`);
    p.push(`<rect x="100" y="185" width="44" height="42" fill="${l1}" opacity="0.9"/>`);
    p.push(`<rect x="160" y="185" width="44" height="42" fill="${l1}" opacity="0.75"/>`);
    p.push(`<rect x="220" y="185" width="44" height="42" fill="${l1}" opacity="0.6"/>`);
    p.push(`<rect x="370" y="120" width="26" height="180" fill="${l3}"/>`);
    p.push(`<rect x="352" y="104" width="62" height="20" fill="${l3}"/>`);
    p.push(`<rect x="430" y="190" width="150" height="110" fill="${shade(hue, 36, 34)}"/>`);
    p.push(`<rect x="450" y="212" width="50" height="34" fill="${l1}" opacity="0.7"/>`);
    p.push(`<rect x="512" y="212" width="50" height="34" fill="${l1}" opacity="0.5"/>`);
  }

  if (kind === 'floor') {
    for (let i = 0; i < 5; i++) {
      const x = 60 + i * 108 + rand() * 10;
      const h = 90 + rand() * 70;
      p.push(`<rect x="${x.toFixed(1)}" y="${(300 - h).toFixed(1)}" width="72" height="${h.toFixed(1)}" fill="${i % 2 ? l2 : l3}"/>`);
      p.push(`<rect x="${(x + 10).toFixed(1)}" y="${(310 - h).toFixed(1)}" width="16" height="16" fill="${l1}" opacity="0.8"/>`);
      p.push(`<rect x="${(x + 36).toFixed(1)}" y="${(320 - h).toFixed(1)}" width="16" height="16" fill="${l1}" opacity="0.55"/>`);
    }
    p.push(`<rect x="0" y="180" width="640" height="10" fill="${shade(hue, 44, 30)}" opacity="0.55"/>`);
  }

  if (kind === 'machining') {
    p.push(`<rect x="90" y="150" width="300" height="150" rx="6" fill="${l2}"/>`);
    p.push(`<rect x="90" y="150" width="300" height="34" rx="6" fill="${shade(hue, 54, 44)}"/>`);
    p.push(`<circle cx="240" cy="240" r="54" fill="${shade(hue, 30, 34)}"/>`);
    p.push(`<circle cx="240" cy="240" r="34" fill="${shade(hue, 44, 40)}"/>`);
    p.push(`<circle cx="240" cy="240" r="14" fill="${shade(hue, 64, 46)}"/>`);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      p.push(`<circle cx="${(240 + Math.cos(a) * 44).toFixed(1)}" cy="${(240 + Math.sin(a) * 44).toFixed(1)}" r="6" fill="${shade(hue, 52, 40)}"/>`);
    }
    p.push(`<rect x="430" y="190" width="130" height="110" fill="${l3}"/>`);
    p.push(`<rect x="450" y="210" width="90" height="12" fill="${l1}" opacity="0.7"/>`);
    p.push(`<rect x="450" y="234" width="66" height="12" fill="${l1}" opacity="0.5"/>`);
    p.push(`<rect x="450" y="258" width="78" height="12" fill="${l1}" opacity="0.35"/>`);
  }

  if (kind === 'quality') {
    p.push(`<rect x="120" y="170" width="240" height="130" rx="8" fill="${shade(hue, 38, 30)}"/>`);
    p.push(`<rect x="140" y="188" width="200" height="94" rx="4" fill="${shade(hue, 24, 26)}"/>`);
    p.push(`<polyline points="152,268 200,232 240,254 288,206 328,224" fill="none" stroke="${shade(hue, 70, 58)}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`);
    p.push(`<circle cx="288" cy="206" r="7" fill="${shade(hue, 74, 60)}"/>`);
    p.push(`<rect x="400" y="196" width="150" height="104" fill="${l3}"/>`);
    p.push(`<rect x="418" y="216" width="114" height="10" fill="${l1}" opacity="0.75"/>`);
    p.push(`<rect x="418" y="238" width="84" height="10" fill="${l1}" opacity="0.55"/>`);
    p.push(`<circle cx="196" cy="120" r="26" fill="${l2}"/>`);
    p.push(`<rect x="188" y="128" width="16" height="34" fill="${shade(hue, 66, 44)}" rx="8"/>`);
  }

  if (kind === 'warehouse') {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const x = 60 + c * 135;
        const y = 130 + r * 58;
        p.push(`<rect x="${x}" y="${y}" width="112" height="44" rx="3" fill="${r % 2 ? l2 : l3}"/>`);
        p.push(`<rect x="${x + 10}" y="${y + 12}" width="46" height="10" fill="${l1}" opacity="${0.75 - r * 0.15}"/>`);
        p.push(`<rect x="${x + 64}" y="${y + 14}" width="34" height="8" fill="${l1}" opacity="${0.5 - r * 0.1}"/>`);
      }
    }
    p.push(`<rect x="50" y="306" width="540" height="10" fill="${shade(hue, 46, 30)}" opacity="0.6"/>`);
  }

  if (kind === 'dispatch') {
    p.push(`<rect x="90" y="140" width="230" height="160" fill="${shade(hue, 46, 38)}"/>`);
    p.push(`<rect x="90" y="140" width="230" height="18" fill="${shade(hue, 56, 42)}"/>`);
    p.push(`<rect x="112" y="182" width="80" height="52" fill="${l1}" opacity="0.75"/>`);
    p.push(`<rect x="208" y="182" width="80" height="52" fill="${l1}" opacity="0.55"/>`);
    p.push(`<rect x="112" y="250" width="80" height="34" fill="${l1}" opacity="0.6"/>`);
    p.push(`<rect x="370" y="196" width="180" height="104" rx="8" fill="${shade(hue, 34, 32)}"/>`);
    p.push(`<polygon points="370,196 550,196 550,224 370,224" fill="${shade(hue, 44, 36)}"/>`);
    p.push(`<circle cx="404" cy="312" r="24" fill="${shade(hue, 18, 30)}"/>`);
    p.push(`<circle cx="516" cy="312" r="24" fill="${shade(hue, 18, 30)}"/>`);
    p.push(`<circle cx="404" cy="312" r="9" fill="${shade(hue, 56, 40)}"/>`);
    p.push(`<circle cx="516" cy="312" r="9" fill="${shade(hue, 56, 40)}"/>`);
  }

  return p.join('\n    ');
}

function buildSvg({ slug, name, scene, hue, seed }) {
  const rand = rng(seed);
  const label = LABELS[scene];
  const id = `${slug}-${scene}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 600" width="640" height="600" role="img" aria-label="${esc(label)} at ${esc(name)}">
  <defs>
    <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${shade(hue, 26, 30)}"/>
      <stop offset="100%" stop-color="${shade(hue, 16, 26)}"/>
    </linearGradient>
    <linearGradient id="vig-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="72%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
    </linearGradient>
  </defs>

  <rect width="640" height="600" fill="url(#sky-${id})"/>
  <circle cx="512" cy="86" r="46" fill="${shade(hue, 70, 52)}" opacity="0.16"/>

  <g opacity="0.34">
    <rect x="0" y="206" width="640" height="94" fill="none" stroke="${shade(hue, 56, 34)}" stroke-width="2"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="${30 + i * 104}" y="216" width="34" height="30" fill="${shade(hue, 58, 36)}" opacity="${(0.18 + i * 0.04).toFixed(2)}"/>`).join('\n    ')}
  </g>

  <g>
    ${sceneShapes(scene, hue, rand)}
  </g>

  <rect width="640" height="600" fill="url(#vig-${id})"/>
  <rect x="0" y="524" width="640" height="76" fill="#0a0f1c" opacity="0.5"/>
  <text x="26" y="558" font-family="Segoe UI, system-ui, sans-serif" font-size="24" font-weight="700" fill="#ffffff">${esc(label)}</text>
  <text x="26" y="582" font-family="Segoe UI, system-ui, sans-serif" font-size="17" font-weight="500" fill="#ffffff" opacity="0.72">${esc(name)}</text>
</svg>
`;
}

function generate() {
  // Pull the BUSINESSES table from the seed so slugs and categories stay in sync.
  const { BUSINESSES } = require('../seed-data');
  const manifest = {};

  for (const [slug, name, categorySlug] of BUSINESSES) {
    const theme = THEME[categorySlug] || { hue: hashInt(slug) % 360, scenes: SCENES };
    const baseHue = theme.hue;
    manifest[slug] = theme.scenes.map((scene, i) => {
      // Nudge the hue per business and per slot so profiles look distinct.
      const hue = (baseHue + (hashInt(slug) % 26) - 13 + i * 3 + 360) % 360;
      const file = `${slug}-${i + 1}.svg`;
      const svg = buildSvg({ slug, name, scene, hue, seed: hashInt(`${slug}:${scene}`) });
      fs.mkdirSync(path.join(OUT_DIR, slug), { recursive: true });
      fs.writeFileSync(path.join(OUT_DIR, slug, file), svg, 'utf8');
      return `/gallery/${slug}/${file}`;
    });
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  // seed-data.js reads this, so seeding and artwork can never drift apart.
  fs.writeFileSync(
    path.resolve(__dirname, '../gallery-manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  const total = Object.values(manifest).reduce((a, b) => a + b.length, 0);
  console.log(`gallery: ${total} images across ${Object.keys(manifest).length} businesses`);
  console.log(`output : ${OUT_DIR}`);
}

if (require.main === module) generate();

module.exports = { generate, THEME, LABELS };
