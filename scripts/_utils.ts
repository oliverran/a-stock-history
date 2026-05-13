import fs from 'node:fs/promises';
import path from 'node:path';

export async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeJson(filePath: string, data: unknown) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function copyDirJsonFiles(srcDir: string, destDir: string) {
  await ensureDir(destDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((e) => e.isFile() && e.name.endsWith('.json'))
      .map((e) => fs.copyFile(path.join(srcDir, e.name), path.join(destDir, e.name)))
  );
}

