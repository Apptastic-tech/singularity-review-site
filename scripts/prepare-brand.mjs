import sharp from 'sharp';
import path from 'node:path';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
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
// Logo assets carry the white "AI" (Orbitron Bold, OFL) inside the black hole shadow. They are rendered by
// brand-src/ai/make_ai.py and brand-src/ai/cover3.py (Python + Pillow) and copied here unchanged so reruns keep them.
const ai = path.join(root, 'brand-src/ai');
for (const name of ['favicon-32.png', 'favicon-48.png', 'favicon.svg']) await copyFile(path.join(ai, name), path.join(root, 'src', name));
for (const name of ['apple-touch-icon.png', 'social-avatar.png', 'og-default.jpg']) await copyFile(path.join(ai, name), path.join(destination, name));
await copyFile(path.join(ai, 'header-mark-96.png'), path.join(destination, 'mark-ai-96.png'));
await copyFile(path.join(ai, 'header-mark-192.png'), path.join(destination, 'mark-ai-192.png'));
await writeFile(path.join(destination, 'wordmark.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="56" viewBox="0 0 420 56"><title>Singularity Review</title><text x="0" y="40" fill="#F4F1EA" font-family="Newsreader, Georgia, serif" font-size="40" font-weight="500">Singularity Review</text></svg>\n`);
console.log('Brand assets prepared: AI-marked black hole icons, header mark, social avatar, OG card and text wordmark');
