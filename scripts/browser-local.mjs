import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

// Serve generated files through Playwright interception. No socket or external request.
export const localOrigin = 'http://singularity.local';
export async function localBrowser() {
  const runtime = process.env.BROWSER_RUNTIME_ROOT || '/tmp/pw-singularity';
  const require = createRequire(path.join(runtime, 'package.json'));
  const { chromium } = require('playwright');
  const executablePath = process.env.BROWSER_EXECUTABLE_PATH || '/Users/araratovsepian/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
  return chromium.launch({ headless: true, executablePath, args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'] });
}
export async function routeSite(context, output = path.resolve('_site')) {
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml' };
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== localOrigin || !['GET', 'HEAD'].includes(route.request().method())) return route.abort();
    try {
      let file = path.resolve(output, '.' + decodeURIComponent(url.pathname));
      if (file !== output && !file.startsWith(output + path.sep)) throw new Error('Invalid path');
      if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
      await route.fulfill({ body: await fs.readFile(file), contentType: mime[path.extname(file)] || 'text/plain' });
    } catch { await route.fulfill({ status: 404, body: 'Not found' }); }
  });
}
