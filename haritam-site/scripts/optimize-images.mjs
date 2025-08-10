import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const projectRoot = path.resolve(__dirname, '..');
const outDir = path.resolve(projectRoot, 'assets', 'img');

async function ensureDir(dir) { await fs.mkdir(dir, { recursive: true }); }
function isImage(file) { return /\.(jpe?g|png|tiff?|webp|avif)$/i.test(file); }

async function processImage(srcPath, baseName) {
  const image = sharp(srcPath).rotate();
  const { width } = await image.metadata();
  const base = path.join(outDir, baseName);

  // Full sizes
  const sizes = [1600, 1200, 800];
  for (const w of sizes) {
    const pipe = sharp(srcPath).rotate().resize({ width: Math.min(w, width || w), withoutEnlargement: true });
    await pipe.avif({ quality: 60 }).toFile(`${base}-${w}.avif`);
    await pipe.webp({ quality: 70 }).toFile(`${base}-${w}.webp`);
    await pipe.jpeg({ quality: 78, mozjpeg: true }).toFile(`${base}-${w}.jpg`);
  }

  // Thumbnail
  const thumb = sharp(srcPath).rotate().resize({ width: 600, withoutEnlargement: true });
  await thumb.avif({ quality: 55 }).toFile(`${base}-thumb.avif`);
  await thumb.webp({ quality: 65 }).toFile(`${base}-thumb.webp`);
  await thumb.jpeg({ quality: 75, mozjpeg: true }).toFile(`${base}-thumb.jpg`);
}

async function main() {
  const srcDir = process.argv[2];
  if (!srcDir) {
    console.error('Usage: npm run optimize:images -- "/absolute/path/to/source-images"');
    process.exit(1);
  }
  await ensureDir(outDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  const files = entries.filter(e => e.isFile() && isImage(e.name));
  console.log(`Found ${files.length} images to process...`);
  for (const file of files) {
    const nameNoExt = path.basename(file.name, path.extname(file.name))
      .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const srcPath = path.join(srcDir, file.name);
    console.log(`Processing ${file.name} -> ${nameNoExt}`);
    await processImage(srcPath, nameNoExt);
  }
  console.log('Done. Outputs in assets/img');
}

main().catch((e) => { console.error(e); process.exit(1); });