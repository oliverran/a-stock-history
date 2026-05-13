import { fetchJsonWithRetry } from './_net';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ensureDir } from './_utils';

function yyyymmddToIso(d: string) {
  const s = String(d ?? '').trim();
  if (!/^\d{8}$/.test(s)) return '';
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

function isoToYyyymmdd(d: string) {
  const s = String(d ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return '';
  return s.replaceAll('-', '');
}

export function getDefaultCsindexDateRange(params?: { startDate?: string; endDate?: string }) {
  const startDate = params?.startDate ?? '19900101';
  const endIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const endDate = params?.endDate ?? isoToYyyymmdd(endIso) ?? '20260512';
  return { startDate, endDate };
}

let queue: Promise<void> = Promise.resolve();
async function withThrottle<T>(fn: () => Promise<T>) {
  const prev = queue;
  let release: () => void = () => {};
  queue = new Promise<void>((r) => (release = r));
  await prev.catch(() => {});
  try {
    return await fn();
  } finally {
    await new Promise((r) => setTimeout(r, 250));
    release();
  }
}

async function tryLoadCache(params: { indexCode: string; startDate: string; endDate: string }) {
  const root = process.cwd();
  const dir = path.join(root, 'data', 'external', 'csindex', 'index-perf-cache');
  const exact = path.join(dir, `${params.indexCode}_${params.startDate}_${params.endDate}.json`);
  try {
    const text = await fs.readFile(exact, 'utf-8');
    const json = JSON.parse(text);
    return Array.isArray(json?.data) ? (json.data as any[]) : null;
  } catch {
    return null;
  }
}

async function tryLoadLatestCache(params: { indexCode: string; startDate: string }) {
  const root = process.cwd();
  const dir = path.join(root, 'data', 'external', 'csindex', 'index-perf-cache');
  try {
    const files = await fs.readdir(dir);
    const prefix = `${params.indexCode}_${params.startDate}_`;
    const candidates = files.filter((f) => f.startsWith(prefix) && f.endsWith('.json')).sort().reverse();
    const pick = candidates[0];
    if (!pick) return null;
    const text = await fs.readFile(path.join(dir, pick), 'utf-8');
    const json = JSON.parse(text);
    return Array.isArray(json?.data) ? (json.data as any[]) : null;
  } catch {
    return null;
  }
}

async function writeCache(params: { indexCode: string; startDate: string; endDate: string }, json: any) {
  const root = process.cwd();
  const dir = path.join(root, 'data', 'external', 'csindex', 'index-perf-cache');
  await ensureDir(dir);
  const p = path.join(dir, `${params.indexCode}_${params.startDate}_${params.endDate}.json`);
  await fs.writeFile(p, JSON.stringify(json, null, 2), 'utf-8');
}

export async function fetchCsindexIndexPerf(params: { indexCode: string; startDate: string; endDate: string }) {
  const cached = await tryLoadCache(params);
  if (cached) return cached;

  return await withThrottle(async () => {
    const { indexCode, startDate, endDate } = params;
    const url =
      'https://www.csindex.com.cn/csindex-home/perf/index-perf?indexCode=' +
      encodeURIComponent(indexCode) +
      '&startDate=' +
      encodeURIComponent(startDate) +
      '&endDate=' +
      encodeURIComponent(endDate);

    try {
      const json: any = await fetchJsonWithRetry(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Referer: 'https://www.csindex.com.cn/',
          Origin: 'https://www.csindex.com.cn',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      await writeCache(params, json);
      const rows: any[] = Array.isArray(json?.data) ? json.data : [];
      return rows;
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (msg.includes('HTTP 403')) {
        const fallback = (await tryLoadLatestCache({ indexCode, startDate })) ?? (await tryLoadCache(params));
        if (fallback) return fallback;
      }
      throw e;
    }
  });
}

export function toSeriesFromCsindex(rows: any[]) {
  return rows
    .map((r) => ({ date: yyyymmddToIso(r.tradeDate), value: Number(r.close) }))
    .filter((it) => it.date && Number.isFinite(it.value) && it.value > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}
