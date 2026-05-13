import path from 'node:path';
import { ensureDir, writeJson } from './_utils';
import fs from 'node:fs/promises';
import { computeAnnualReturns } from './_annual';
import { computeDrawdown, computeDrawdownEvents } from './_drawdown';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'sp500');
  await ensureDir(dir);

  const csvPath = path.join(root, 'data', 'external', 'shiller', 'shiller_data.csv');
  const text = await fs.readFile(csvPath, 'utf-8');
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0]?.split(',') ?? [];
  const idxDate = header.indexOf('Date');
  const idxP = header.indexOf('P');
  const idxD = header.indexOf('Dividend');
  const idxE = header.indexOf('Earnings');
  if (idxDate < 0 || idxP < 0 || idxD < 0 || idxE < 0) throw new Error('Unexpected Shiller CSV header');

  const dataRows = lines
    .slice(1)
    .map((line) => line.split(','))
    .map((cols) => ({
      ym: String(cols[idxDate] ?? '').trim(),
      p: Number(cols[idxP]),
      d: Number(cols[idxD]),
      e: Number(cols[idxE]),
    }))
    .filter((r) => /^\d{4}\.\d{1,2}$/.test(r.ym) && Number.isFinite(r.p) && r.p > 0)
    .map((r) => {
      const [yy, mm] = r.ym.split('.');
      const month = mm.padStart(2, '0');
      return { date: `${yy}-${month}-01`, p: r.p, d: Number.isFinite(r.d) ? r.d : 0, e: Number.isFinite(r.e) ? r.e : 0 };
    })
    .filter((r) => r.date >= '1928-01-01');

  const priceSeries = dataRows.map((r) => ({ date: r.date, value: Number(r.p.toFixed(2)) }));

  const totalReturnSeries = (() => {
    const out: Array<{ date: string; value: number }> = [];
    if (dataRows.length === 0) return out;
    let tr = 100;
    out.push({ date: dataRows[0].date, value: tr });
    for (let i = 1; i < dataRows.length; i++) {
      const prev = dataRows[i - 1];
      const cur = dataRows[i];
      const factor = prev.p === 0 ? 1 : (cur.p + cur.d) / prev.p;
      tr = tr * factor;
      out.push({ date: cur.date, value: Number(tr.toFixed(2)) });
    }
    return out;
  })();

  const annualTotalReturn = computeAnnualReturns(totalReturnSeries);
  const dd = computeDrawdown(totalReturnSeries);
  const ddSeries = dd.map((it) => ({ date: it.date, value: it.value }));
  const ddEvents = computeDrawdownEvents(dd);

  const peSeriesRaw = dataRows
    .filter((r) => r.e > 0)
    .map((r) => ({ date: r.date, value: r.p / r.e }));
  const peVals = peSeriesRaw.map((r) => r.value);
  const mean = peVals.reduce((a, b) => a + b, 0) / (peVals.length || 1);
  const variance = peVals.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (peVals.length || 1);
  const std = Math.sqrt(variance);
  const valuationSeries = peSeriesRaw.map((r) => ({
    date: r.date,
    value: Number(r.value.toFixed(2)),
    mean: Number(mean.toFixed(2)),
    plus1: Number((mean + std).toFixed(2)),
    minus1: Number(Math.max(0, mean - std).toFixed(2)),
  }));

  const epsSeries = dataRows.filter((r) => r.e > 0).map((r) => ({ date: r.date, value: Number(r.e.toFixed(2)) }));

  await writeJson(path.join(dir, 'century.json'), {
    meta: { id: 'century', name: '标普500', type: 'line', description: '世纪尺度价格（Shiller 月度数据）' },
    series: priceSeries,
  });

  await writeJson(path.join(dir, 'annual-returns.json'), {
    meta: { id: 'annual-returns', name: '标普500年度回报', type: 'bar', description: '年度回报（%）（总回报，含分红再投入）' },
    series: annualTotalReturn,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: '标普500回撤', type: 'drawdown', description: '距离峰值回撤（%）（基于总回报指数）' },
    series: ddSeries,
    events: ddEvents,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: '标普500估值', type: 'valuation', description: 'PE=价格/盈利（Shiller 月度数据）' },
    series: valuationSeries,
  });

  await writeJson(path.join(dir, 'eps.json'), {
    meta: { id: 'eps', name: '标普500每股收益（E）', type: 'line', description: '盈利（Shiller 月度数据，名义）' },
    series: epsSeries,
  });

  await writeJson(path.join(dir, 'total-return.json'), {
    meta: { id: 'total-return', name: '标普500总回报指数', type: 'line', description: '含分红再投入的总回报指数（Shiller 数据推算，月频）' },
    series: totalReturnSeries,
  });
}

await main();

