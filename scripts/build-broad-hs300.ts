import path from 'node:path';
import fs from 'node:fs/promises';
import * as XLSX from 'xlsx';
import { ensureDir, writeJson } from './_utils';
import { computeAnnualReturns } from './_annual';
import { computeDrawdown, computeDrawdownEvents } from './_drawdown';
import { fetchCsindexIndexPerf, getDefaultCsindexDateRange, toSeriesFromCsindex } from './_csindex';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'broad');
  await ensureDir(dir);

  const { startDate, endDate } = getDefaultCsindexDateRange({ startDate: '20050104' });

  const hs300PriceRows = await fetchCsindexIndexPerf({ indexCode: '000300', startDate, endDate });
  const hs300TrRows = await fetchCsindexIndexPerf({ indexCode: 'H00300', startDate, endDate });

  const priceSeries = toSeriesFromCsindex(hs300PriceRows);
  const totalReturnSeries = toSeriesFromCsindex(hs300TrRows);

  const annualTotalReturn = computeAnnualReturns(totalReturnSeries);
  const dd = computeDrawdown(totalReturnSeries);
  const ddSeries = dd.map((it) => ({ date: it.date, value: it.value }));
  const ddEvents = computeDrawdownEvents(dd);

  const indicatorPath = path.join(root, 'data', 'external', 'csindex', '000300indicator.xls');
  const wb = XLSX.read(await fs.readFile(indicatorPath), { type: 'buffer' });
  const sheet = wb.Sheets[wb.SheetNames[0] ?? ''];
  if (!sheet) throw new Error('Missing sheet in CSIndex indicator workbook');
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, blankrows: false });
  const body = rows.slice(1);

  const peSeriesRaw = body
    .map((r) => ({ date: String(r?.[0] ?? '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'), pe1: Number(r?.[6]) }))
    .filter((it) => it.date && Number.isFinite(it.pe1) && it.pe1 > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (peSeriesRaw.length === 0) throw new Error('Empty PE series from CSIndex indicator file');

  const peVals = peSeriesRaw.map((r) => r.pe1);
  const mean = peVals.reduce((a, b) => a + b, 0) / (peVals.length || 1);
  const variance = peVals.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (peVals.length || 1);
  const std = Math.sqrt(variance);

  const valuationSeries = peSeriesRaw.map((r) => ({
    date: r.date,
    value: Number(r.pe1.toFixed(2)),
    mean: Number(mean.toFixed(2)),
    plus1: Number((mean + std).toFixed(2)),
    minus1: Number(Math.max(0, mean - std).toFixed(2)),
  }));

  const closeByDate = new Map(priceSeries.map((p) => [p.date, p.value]));
  const epsSeries = peSeriesRaw
    .map((r) => {
      const close = closeByDate.get(r.date);
      if (!Number.isFinite(close) || close === 0) return null;
      return { date: r.date, value: Number((close / r.pe1).toFixed(2)) };
    })
    .filter(Boolean) as Array<{ date: string; value: number }>;
  if (epsSeries.length === 0) throw new Error('Empty EPS series (from close/PE)');

  await writeJson(path.join(dir, 'hs300.json'), {
    meta: { id: 'hs300', name: '沪深300', type: 'line', description: '收盘价（CSIndex，日频）' },
    series: priceSeries,
  });

  await writeJson(path.join(dir, 'hs300-total-return.json'), {
    meta: { id: 'hs300-total-return', name: '沪深300总回报指数', type: 'line', description: '全收益指数 H00300（CSIndex，日频）' },
    series: totalReturnSeries,
  });

  await writeJson(path.join(dir, 'hs300-annual-returns.json'), {
    meta: { id: 'hs300-annual-returns', name: '沪深300年度回报', type: 'bar', description: '年度回报（%）（基于全收益指数）' },
    series: annualTotalReturn,
  });

  await writeJson(path.join(dir, 'hs300-drawdowns.json'), {
    meta: { id: 'hs300-drawdowns', name: '沪深300回撤', type: 'drawdown', description: '距离峰值回撤（%）（基于全收益指数）' },
    series: ddSeries,
    events: ddEvents,
  });

  await writeJson(path.join(dir, 'hs300-valuation.json'), {
    meta: { id: 'hs300-valuation', name: '沪深300估值（PE1）', type: 'valuation', description: 'PE1（CSIndex 指数估值文件）' },
    series: valuationSeries,
  });

  await writeJson(path.join(dir, 'hs300-eps.json'), {
    meta: { id: 'hs300-eps', name: '沪深300盈利（推算）', type: 'line', description: 'EPS≈指数点位/PE1（仅限估值文件覆盖区间）' },
    series: epsSeries,
  });
}

await main();
