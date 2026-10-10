import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const files = (await fs.readdir('scripts')).filter(file => /^verify-.*\.mjs$/.test(file) && !file.includes('browser')).sort();
const failures = [];
for (const file of files) {
  const result = spawnSync(process.execPath, ['scripts/' + file], { encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024 });
  console.log(file + ': ' + (result.status === 0 ? 'PASS' : 'FAIL'));
  if (result.status !== 0) { failures.push(file); console.error(result.stdout + result.stderr); if (result.error) console.error(result.error.message); }
}
if (failures.length) { console.error('Restore suite failed: ' + failures.join(', ')); process.exit(1); }
console.log('Restore suite passed: ' + files.length + ' non-browser verification scripts.');
