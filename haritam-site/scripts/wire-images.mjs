import fs from 'fs/promises';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const imgDir = path.join(root, 'assets', 'img');
const indexFile = path.join(root, 'index.html');
const galleryFile = path.join(root, 'gallery.html');

function toAlt(base) {
  return base.replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

async function listBases() {
  const files = await fs.readdir(imgDir);
  const bases = new Set();
  for (const f of files) {
    const m = f.match(/^(.*?)-(?:\d+|thumb)\.(?:avif|webp|jpe?g)$/i);
    if (m) bases.add(m[1]);
  }
  return Array.from(bases).sort();
}

function chooseHero(bases) {
  const byPref = bases.find(b => /hero/i.test(b))
    || bases.find(b => /interior/i.test(b))
    || bases[0];
  return byPref;
}

function buildPicture(base, sizes = [800, 1200, 1600]) {
  const srcsetAvif = sizes.map(w => `/assets/img/${base}-${w}.avif ${w}w`).join(', ');
  const srcsetWebp = sizes.map(w => `/assets/img/${base}-${w}.webp ${w}w`).join(', ');
  const fallback = `/assets/img/${base}-${sizes[sizes.length - 1]}.jpg`;
  const alt = toAlt(base);
  return `\n<picture>\n  <source type="image/avif" srcset="${srcsetAvif}" sizes="100vw" />\n  <source type="image/webp" srcset="${srcsetWebp}" sizes="100vw" />\n  <img class="hero__image" src="${fallback}" alt="${alt}" loading="eager" />\n</picture>`;
}

function buildThumbAnchor(base) {
  const alt = toAlt(base);
  const href = `/assets/img/${base}-1200.avif`;
  const thumb = `/assets/img/${base}-thumb.avif`;
  return `\n  <a href="${href}" class="thumb" data-lightbox data-caption="${alt}">\n    <img src="${thumb}" alt="${alt}" loading="lazy" />\n  </a>`;
}

async function rewriteIndex(bases) {
  let html = await fs.readFile(indexFile, 'utf8');
  const hero = chooseHero(bases);
  // Replace hero image or picture block
  html = html.replace(/<picture>[\s\S]*?<\/picture>|<img class=\"hero__image\"[\s\S]*?>/i, buildPicture(hero));

  // Homepage thumbs: take first 6 non-hero
  const thumbs = bases.filter(b => b !== hero).slice(0, 6).map(buildThumbAnchor).join('');
  html = html.replace(/(<div class=\"grid thumbs\">)[\s\S]*?(<\/div>)/, `$1${thumbs}\n$2`);

  await fs.writeFile(indexFile, html, 'utf8');
}

async function rewriteGallery(bases) {
  let html = await fs.readFile(galleryFile, 'utf8');
  const items = bases.map(buildThumbAnchor).join('');
  html = html.replace(/(<div class=\"grid thumbs\">)[\s\S]*?(<\/div>)/, `$1${items}\n$2`);
  await fs.writeFile(galleryFile, html, 'utf8');
}

async function main() {
  const bases = await listBases();
  if (bases.length === 0) {
    console.error('No optimized images found in assets/img');
    process.exit(1);
  }
  await rewriteIndex(bases);
  await rewriteGallery(bases);
  console.log('Rewired index.html and gallery.html with optimized images.');
}

main().catch((e) => { console.error(e); process.exit(1); });