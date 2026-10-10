import { execFileSync } from 'node:child_process';
// No server, production requests or fixture writes in the protected source tree.
for (const name of ['site', 'content', 'rebrand', 'lensing', 'rework', 'chrome', 'skyline', 'headings', 'static-pages']) {
  process.stdout.write(execFileSync(process.execPath, [`scripts/verify-${name}.mjs`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }));
}
console.log('SKYLINE SUITE VERIFIED: all nine static/Node verification scripts passed');
