import { fetchJsonWithRetry } from './_net';

export async function fetchSohuIndexDaily(params: { code: string; start: string; end: string }) {
  const url =
    'https://q.stock.sohu.com/hisHq?code=' +
    encodeURIComponent(params.code) +
    '&start=' +
    encodeURIComponent(params.start) +
    '&end=' +
    encodeURIComponent(params.end) +
    '&stat=1&order=D&period=d&callback=';
  const json: any = await fetchJsonWithRetry(url, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://q.stock.sohu.com/' } });
  const first = Array.isArray(json) ? json[0] : null;
  const hq: any[] = Array.isArray(first?.hq) ? first.hq : [];
  return hq;
}

export function toSeriesFromSohuHq(hq: any[]) {
  return hq
    .map((row) => ({ date: String(row?.[0] ?? '').slice(0, 10), value: Number(row?.[2]) }))
    .filter((it) => /^\d{4}-\d{2}-\d{2}$/.test(it.date) && Number.isFinite(it.value) && it.value > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

