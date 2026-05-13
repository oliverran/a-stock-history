import path from 'node:path';
import { copyDirJsonFiles } from './_utils';

async function main() {
  const root = process.cwd();
  const srcDir = path.join(root, 'public', 'api', 'sectors');
  const destDir = path.join(root, 'public', 'api', 'cn', 'sectors');
  await copyDirJsonFiles(srcDir, destDir);
}

await main();

