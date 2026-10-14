// Packs the filtered Tiny ImageNet set into the built-in example library:
//
//   public/library/<slug>.jpg          — one sprite sheet per class (COLS x rows of TILE px)
//   src/library/libraryManifest.json   — class list the app imports statically
//   scripts/library-picks.json         — which source files went into each sprite
//   <dataset>/shipped_review.html      — every shipped image, for a quick visual check
//
// The source dataset is large (~180 MB) and isn't part of the repo, so the outputs
// above are committed and this only needs re-running when the library changes:
//
//   npm run build:library -- <path-to-neuropocket_dataset>
//
// Picks are a seeded shuffle per class (same result on every run). To hand-pick or
// drop images, add scripts/library-overrides.json:
//   { "<friendly name>": { "include": ["n0..._12.JPEG"], "exclude": ["n0..._7.JPEG"] } }

import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const PER_CLASS = 30;
const COLS = 6;
const TILE = 64;
const QUALITY = 85;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const datasetDir = process.argv[2];
if (!datasetDir || !existsSync(join(datasetDir, 'class_list.csv'))) {
  console.error('Usage: npm run build:library -- <path-to-neuropocket_dataset>');
  process.exit(1);
}

const spriteDir = join(root, 'public', 'library');
const manifestPath = join(root, 'src', 'library', 'libraryManifest.json');
const picksPath = join(root, 'scripts', 'library-picks.json');
const overridesPath = join(root, 'scripts', 'library-overrides.json');
const reviewPath = join(datasetDir, 'shipped_review.html');

// Minimal CSV parser (quoted fields may contain commas and doubled quotes).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.length > 1);
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

// Deterministic per-class shuffle, seeded from the class name.
function seededShuffle(items, seedText) {
  let seed = 0;
  for (const ch of seedText) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) | 0;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const flagFor = (row) => {
  if (row.reason.startsWith('borderline')) return 'borderline';
  return row.culture_flag || null;
};

const classes = parseCsv(readFileSync(join(datasetDir, 'class_list.csv'), 'utf8').replace(/^﻿/, ''))
  .filter((r) => r.status === 'included');
const overrides = existsSync(overridesPath) ? JSON.parse(readFileSync(overridesPath, 'utf8')) : {};

rmSync(spriteDir, { recursive: true, force: true });
mkdirSync(spriteDir, { recursive: true });
mkdirSync(dirname(manifestPath), { recursive: true });

const manifest = { tile: TILE, cols: COLS, classes: [] };
const picks = {};
let totalBytes = 0;

for (const row of classes) {
  const name = row.friendly_name;
  const slug = slugify(name);
  const imageDir = join(datasetDir, 'images', name);
  const available = readdirSync(imageDir).filter((f) => /\.jpe?g$/i.test(f)).sort();

  const { include = [], exclude = [] } = overrides[name] ?? {};
  const pool = available.filter((f) => !exclude.includes(f) && !include.includes(f));
  const chosen = [...include.filter((f) => available.includes(f)), ...seededShuffle(pool, name)]
    .slice(0, PER_CLASS);

  const rows = Math.ceil(chosen.length / COLS);
  const tiles = await Promise.all(
    chosen.map(async (file, i) => ({
      input: await sharp(join(imageDir, file))
        .resize(TILE, TILE, { fit: 'cover' })
        .removeAlpha()
        .toColourspace('srgb')
        .toBuffer(),
      left: (i % COLS) * TILE,
      top: Math.floor(i / COLS) * TILE,
    }))
  );

  const spritePath = join(spriteDir, `${slug}.jpg`);
  await sharp({
    create: { width: COLS * TILE, height: rows * TILE, channels: 3, background: '#ffffff' },
  })
    .composite(tiles)
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(spritePath);

  totalBytes += statSync(spritePath).size;
  manifest.classes.push({ slug, name, wnid: row.wnid, flag: flagFor(row), count: chosen.length });
  picks[name] = chosen;
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
writeFileSync(picksPath, JSON.stringify(picks, null, 2) + '\n', 'utf8');

// Review page: each class's sprite, scaled up, with its flag. Lives next to the
// dataset (not in public/) so it never ships with the app.
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const reviewHtml = `<!doctype html><meta charset="utf-8"><title>Shipped library review</title>
<style>body{font:14px system-ui;margin:24px;background:#fafafa}section{display:inline-block;margin:0 16px 24px 0;vertical-align:top}
h2{font-size:15px;margin:0 0 6px}small{color:#a15c00;margin-left:6px}img{width:${COLS * TILE * 1.5}px;image-rendering:auto;border:1px solid #ddd;background:#fff}</style>
<h1>${manifest.classes.length} classes · ${PER_CLASS} images each · ${(totalBytes / 1048576).toFixed(1)} MB</h1>
${manifest.classes
  .map(
    (c) => `<section><h2>${esc(c.name)}${c.flag ? `<small>${c.flag}</small>` : ''}</h2>` +
      `<img src="${pathToFileURL(join(spriteDir, `${c.slug}.jpg`)).href}" title="${esc(picks[c.name].join(', '))}"></section>`
  )
  .join('\n')}`;
writeFileSync(reviewPath, reviewHtml, 'utf8');

console.log(
  `Wrote ${manifest.classes.length} sprites to public/library (${(totalBytes / 1048576).toFixed(1)} MB)\n` +
    `Wrote ${manifestPath}\nReview: ${reviewPath}`
);
