export function computeAnnualReturns(series: Array<{ date: string; value: number }>) {
  const byYear = new Map<string, Array<{ date: string; value: number }>>();
  for (const it of series) {
    const y = it.date.slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(it);
  }
  const years = Array.from(byYear.keys()).sort();
  const out: Array<{ date: string; value: number }> = [];
  for (let i = 1; i < years.length; i++) {
    const y0 = years[i - 1];
    const y1 = years[i];
    const a = byYear.get(y0)!;
    const b = byYear.get(y1)!;
    const v0 = a[a.length - 1]?.value;
    const v1 = b[b.length - 1]?.value;
    if (!Number.isFinite(v0) || !Number.isFinite(v1) || v0 === 0) continue;
    const ret = ((v1 - v0) / v0) * 100;
    out.push({ date: y1, value: Number(ret.toFixed(2)) });
  }
  return out;
}
