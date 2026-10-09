import sharp from 'sharp';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const [input, slug, ...extra] = process.argv.slice(2);
if (!input || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '') || extra.length) {
  console.error('Usage: node scripts/prepare-hero.mjs <input-image> <slug>');
  process.exit(1);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'src/images/articles', `${slug}.jpg`);
try {
  await mkdir(path.dirname(output), { recursive: true });
  // Buffer first so preparing an existing hero in place is safe.
  const image = await sharp(path.resolve(input)).rotate().resize(1280, 720, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, progressive: true, mozjpeg: true }).toBuffer();
  await writeFile(output, image);
  console.log(`Prepared ${output} (1280x720 JPEG, ${Math.round(image.length / 1024)} KB)`);
} catch (error) {
  console.error(`Could not prepare hero "${slug}": ${error.message}`);
  process.exitCode = 1;
}
