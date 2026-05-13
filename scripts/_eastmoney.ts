import { fetchJsonWithRetry } from './_net';

export async function fetchEastmoneyDailyKline(params: { secid: string; beg?: string; end?: string }) {
  const beg = params.beg ?? '19900101';
  const end = params.end ?? '20500101';
  const url =
    'https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=' +
    encodeURIComponent(params.secid) +
    '&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6' +
    '&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61' +
    '&klt=101&fqt=0&beg=' +
    encodeURIComponent(beg) +
    '&end=' +
    encodeURIComponent(end);
  const json: any = await fetchJsonWithRetry(url, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://quote.eastmoney.com/' } });
  const klines: string[] = json?.data?.klines ?? [];
  return klines;
}

export function toSeriesFromEastmoneyKlines(klines: string[]) {
  return klines
    .map((line) => String(line ?? '').split(','))
    .map((cols) => ({ date: String(cols[0] ?? '').slice(0, 10), value: Number(cols[2]) }))
    .filter((it) => /^\d{4}-\d{2}-\d{2}$/.test(it.date) && Number.isFinite(it.value) && it.value > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}
