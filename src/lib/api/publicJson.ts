import fs from 'node:fs/promises';
import path from 'node:path';

export async function loadPublicApiJson(apiPath: string) {
  const root = process.cwd();
  const rel = apiPath.startsWith('/api/') ? apiPath.slice('/api/'.length) : apiPath.replace(/^\//, '');
  const filePath = path.join(root, 'public', 'api', rel);
  const text = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(text);
}
