import sharp from 'sharp';
import path from 'node:path';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'src/images/brand');
// Pass the owner supplied source directory to import art. Subsequent runs use the committed copies.
const source = process.argv[2] ? path.resolve(process.argv[2]) : destination;
await mkdir(destination, { recursive: true });
if (source !== destination) {
  // Preserve every source pixel; responsive compression happens only in Eleventy Image.
  await copyFile(path.join(source, 'skyline-kittpeak-graded-5472.jpg'), path.join(destination, 'skyline-kittpeak.jpg'));
}
const blackhole = path.join(destination, 'blackhole-wide.jpg');
// Crop around the shadow and lensed disk. The ring fills most of a tiny favicon without flattening the photograph.
const mark = await sharp(blackhole).extract({ left: 410, top: 140, width: 460, height: 460 }).normalise().png().toBuffer();
for (const size of [32, 48]) {
  await sharp(mark).resize(size, size).sharpen().png().toFile(path.join(root, `src/favicon-${size}.png`));
}
await sharp(mark).resize(180, 180).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(path.join(destination, 'apple-touch-icon.png'));
for (const size of [80, 160]) {
  await sharp(mark).resize(size, size).webp({ quality: 88 }).toFile(path.join(destination, `blackhole-mark-${size}.webp`));
}
const favicon = (await readFile(path.join(root, 'src/favicon-48.png'))).toString('base64');
await writeFile(path.join(root, 'src/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><title>Singularity Review black hole</title><image width="48" height="48" href="data:image/png;base64,${favicon}"/></svg>\n`);
const logo = (await sharp(mark).resize(80, 80).webp().toBuffer()).toString('base64');
await writeFile(path.join(destination, 'wordmark.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="56" viewBox="0 0 400 56"><title>Singularity Review</title><defs><clipPath id="crop"><circle cx="28" cy="28" r="24"/></clipPath></defs><image width="56" height="56" clip-path="url(#crop)" href="data:image/webp;base64,${logo}"/><text x="68" y="35" fill="#F4F1EA" font-family="Georgia, serif" font-size="30">Singularity <tspan font-style="italic">Review</tspan></text></svg>\n`);
const skyline = path.join(destination, 'skyline-kittpeak.jpg');
// Screen blending preserves the photograph's light trails while removing its black background from the sky.
const disk = await sharp(blackhole).resize(490, 276).toBuffer();
// Keep the photographed shadow opaque when its light is screen-composited.
const shadow = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><circle cx="908" cy="174" r="50" fill="#000"/></svg>');
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><text x="70" y="266" fill="#F4F1EA" font-family="Georgia, serif" font-size="73">Singularity</text><text x="70" y="349" fill="#F4F1EA" font-family="Georgia, serif" font-style="italic" font-size="80">Review</text></svg>`);
await sharp(skyline).resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([{ input: shadow }, { input: disk, left: 658, top: 42, blend: 'screen' }, { input: overlay }])
  .jpeg({ quality: 88, progressive: true, chromaSubsampling: '4:4:4' }).toFile(path.join(destination, 'og-default.jpg'));
console.log('Brand assets prepared: photographic logos, favicon crops and social cover');
