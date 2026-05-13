import { readPublicJson } from './public';

export interface ApiManifestItem {
  key: string;
  path: string;
  url: string;
  modified: string;
  bytes: number;
}

export interface ApiManifest {
  version: string;
  generatedAt: string;
  items: ApiManifestItem[];
}

export interface ApiProfile {
  site: string;
  generatedAt: string;
  markets: Array<{
    market: string;
    modules: Array<{
      module: string;
      count: number;
      lastModified?: string;
    }>;
  }>;
  totals: {
    count: number;
    bytes: number;
  };
}

export async function loadApiManifest() {
  const raw = await readPublicJson<any>('/api/_manifest.json');
  if (raw && Array.isArray(raw.items)) return raw as ApiManifest;
  return {
    version: raw?.version ?? 'legacy',
    generatedAt: raw?.lastUpdated ?? raw?.generatedAt ?? new Date().toISOString(),
    items: [],
  } satisfies ApiManifest;
}

export async function loadApiProfile() {
  const raw = await readPublicJson<any>('/api/profile.json');
  if (raw && raw.totals && Array.isArray(raw.markets)) return raw as ApiProfile;
  throw new Error('Invalid profile.json');
}

export function getLastModifiedForPrefix(manifest: ApiManifest, prefixPath: string) {
  const prefix = prefixPath.endsWith('/') ? prefixPath : `${prefixPath}/`;
  let latest: string | undefined;
  for (const it of manifest.items) {
    if (!it.path.startsWith(prefix)) continue;
    if (!latest || it.modified > latest) latest = it.modified;
  }
  return latest;
}

