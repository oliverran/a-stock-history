import fs from 'node:fs/promises';
import path from 'node:path';

export function publicPathToFsPath(publicPath: string) {
  const p = publicPath.startsWith('/') ? publicPath.slice(1) : publicPath;
  return path.join(process.cwd(), 'public', p);
}

export async function readPublicJson<T>(publicPath: string): Promise<T> {
  const fsPath = publicPathToFsPath(publicPath);
  const raw = await fs.readFile(fsPath, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function statPublicFile(publicPath: string) {
  const fsPath = publicPathToFsPath(publicPath);
  return fs.stat(fsPath);
}

