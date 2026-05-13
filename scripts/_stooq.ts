export async function fetchStooqDaily(symbol: string) {
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${symbol}: ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 3) throw new Error(`Empty CSV for ${symbol}`);
  const header = lines[0].split(',');
  const idxDate = header.indexOf('Date');
  const idxClose = header.indexOf('Close');
  if (idxDate < 0 || idxClose < 0) throw new Error(`Unexpected CSV header for ${symbol}: ${lines[0]}`);
  const out: Array<{ date: string; value: number }> = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const date = cols[idxDate];
    const close = Number(cols[idxClose]);
    if (!date || !Number.isFinite(close)) continue;
    out.push({ date, value: Number(close.toFixed(2)) });
  }
  return out;
}
