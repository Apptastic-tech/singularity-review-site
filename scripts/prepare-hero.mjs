import sharp from 'sharp';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// The skyline source stays untouched. Regenerate its local crop contract on request.
if (process.argv[2] === '--skyline-contract') {
  const source = { width: 5472, height: 3648, path: 'src/images/brand/skyline-kittpeak.jpg' };
  const metadata = await sharp(source.path).metadata();
  if (metadata.width !== source.width || metadata.height !== source.height) throw new Error('Unexpected skyline dimensions');
  const contract = { source, mobileCrop: { left: 350, top: 0, width: 3648, height: 3648 }, dome: { left: .586, top: .600, right: .698, bottom: .796 }, method: 'Conservative bounds around the connected bright observatory structure in the existing source photograph. Source coordinates remain unchanged.' };
  await writeFile('src/_data/heroPhoto.json', JSON.stringify(contract, null, 2) + '\n');
  console.log('Prepared skyline contract from the existing Kitt Peak photograph; no source pixels changed.');
  process.exit(0);
}
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
