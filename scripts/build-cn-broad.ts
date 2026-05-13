import path from 'node:path';
import { copyDirJsonFiles } from './_utils';

async function main() {
  const root = process.cwd();
  const srcDir = path.join(root, 'public', 'api', 'broad');
  const destDir = path.join(root, 'public', 'api', 'cn', 'broad');
  await copyDirJsonFiles(srcDir, destDir);
}

await main();

