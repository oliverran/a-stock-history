import fs from 'node:fs/promises';
import path from 'node:path';
import { ensureDir, writeJson } from './_utils';

type ApiManifestItem = {
  key: string;
  path: string;
  url: string;
  modified: string;
  bytes: number;
};

async function listJsonFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await listJsonFiles(p)));
      continue;
    }
    if (e.isFile() && e.name.endsWith('.json')) out.push(p);
  }
  return out;
}

function toPosix(p: string) {
  return p.replaceAll('\\', '/');
}

async function main() {
  const root = process.cwd();
  const apiDir = path.join(root, 'public', 'api');
  await ensureDir(apiDir);

  const all = await listJsonFiles(apiDir);
  const jsonFiles = all.filter((fsPath) => {
    const rel = toPosix(path.relative(apiDir, fsPath));
    if (rel.startsWith('_')) return false;
    if (rel === 'profile.json') return false;
    return rel.startsWith('cn/') || rel.startsWith('us/');
  });

  const items: ApiManifestItem[] = [];
  for (const fsPath of jsonFiles) {
    const st = await fs.stat(fsPath);
    const rel = toPosix(path.relative(apiDir, fsPath));
    const urlPath = `/api/${rel}`;
    items.push({
      key: rel.replace(/\.json$/i, ''),
      path: urlPath,
      url: urlPath,
      modified: st.mtime.toISOString(),
      bytes: st.size,
    });
  }

  items.sort((a, b) => a.key.localeCompare(b.key));

  const generatedAt = new Date().toISOString();

  await writeJson(path.join(apiDir, '_manifest.json'), {
    version: '2.0.0',
    generatedAt,
    items,
  });

  const marketMap = new Map<string, Map<string, { count: number; lastModified?: string }>>();
  let totalBytes = 0;
  for (const it of items) {
    totalBytes += it.bytes;
    const parts = it.key.split('/');
    const market = parts[0] ?? 'unknown';
    const module = parts[1] ?? 'unknown';
    if (!marketMap.has(market)) marketMap.set(market, new Map());
    const modMap = marketMap.get(market)!;
    const cur = modMap.get(module) ?? { count: 0, lastModified: undefined };
    cur.count += 1;
    if (!cur.lastModified || it.modified > cur.lastModified) cur.lastModified = it.modified;
    modMap.set(module, cur);
  }

  const markets = Array.from(marketMap.entries()).map(([market, modulesMap]) => ({
    market,
    modules: Array.from(modulesMap.entries())
      .map(([module, stats]) => ({ module, ...stats }))
      .sort((a, b) => a.module.localeCompare(b.module)),
  }));

  await writeJson(path.join(apiDir, 'profile.json'), {
    site: 'Market Chronicle',
    generatedAt,
    markets,
    totals: { count: items.length, bytes: totalBytes },
  });
}

await main();

