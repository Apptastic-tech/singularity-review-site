import sharp from 'sharp';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const background = process.argv[2];
await sharp(path.join(root, 'src/favicon.svg')).resize(180, 180).png().toFile(path.join(root, 'src/images/brand/apple-touch-icon.png'));
if (background) {
  const wordmark = (await readFile(path.join(root, 'src/images/brand/wordmark.svg'), 'utf8')).trim().replace(/<title[^>]*>.*?<\/title>/, '').replace(/<\/svg>$/, '');
  const content = wordmark.slice(wordmark.indexOf('>') + 1);
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0B0C0E" opacity=".38"/><g transform="translate(70 180) scale(2.65)">${content}</g><text x="70" y="310" fill="#F4F1EA" font-family="Georgia, serif" font-size="30">AI news for people living through the singularity</text><path d="M70 350h80" stroke="#F2A93B" stroke-width="2"/></svg>`);
  await sharp(background).resize(1200, 630, { fit: 'cover', position: 'centre' }).composite([{ input: overlay }]).jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(path.join(root, 'src/images/brand/og-default.jpg'));
}
console.log('Brand assets prepared');
