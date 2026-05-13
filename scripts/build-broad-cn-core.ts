import path from 'node:path';
import { ensureDir, writeJson } from './_utils';
import { computeAnnualReturns } from './_annual';
import { computeDrawdown, computeDrawdownEvents } from './_drawdown';
import { fetchCsindexIndexPerf, getDefaultCsindexDateRange, toSeriesFromCsindex } from './_csindex';

async function buildOne(params: {
  key: string;
  name: string;
  priceCode: string;
  totalReturnCode: string;
  startDate?: string;
}) {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'broad');
  await ensureDir(dir);

  const { startDate, endDate } = getDefaultCsindexDateRange({ startDate: params.startDate ?? '19900101' });

  const priceRows = await fetchCsindexIndexPerf({ indexCode: params.priceCode, startDate, endDate });
  const trRows = await fetchCsindexIndexPerf({ indexCode: params.totalReturnCode, startDate, endDate });

  const priceSeries = toSeriesFromCsindex(priceRows);
  const totalReturnSeries = toSeriesFromCsindex(trRows);
  if (!priceSeries.length) throw new Error(`Empty price series: ${params.priceCode}`);
  if (!totalReturnSeries.length) throw new Error(`Empty total return series: ${params.totalReturnCode}`);

  const annualTotalReturn = computeAnnualReturns(totalReturnSeries);
  const dd = computeDrawdown(totalReturnSeries);
  const ddSeries = dd.map((it) => ({ date: it.date, value: it.value }));
  const ddEvents = computeDrawdownEvents(dd);

  await writeJson(path.join(dir, `${params.key}.json`), {
    meta: { id: params.key, name: params.name, type: 'line', description: `收盘价（CSIndex，日频，${params.priceCode}）` },
    series: priceSeries,
  });

  await writeJson(path.join(dir, `${params.key}-total-return.json`), {
    meta: {
      id: `${params.key}-total-return`,
      name: `${params.name}总回报指数`,
      type: 'line',
      description: `全收益指数（CSIndex，日频，${params.totalReturnCode}）`,
    },
    series: totalReturnSeries,
  });

  await writeJson(path.join(dir, `${params.key}-annual-returns.json`), {
    meta: { id: `${params.key}-annual-returns`, name: `${params.name}年度回报`, type: 'bar', description: '年度回报（%）（基于全收益指数）' },
    series: annualTotalReturn,
  });

  await writeJson(path.join(dir, `${params.key}-drawdowns.json`), {
    meta: { id: `${params.key}-drawdowns`, name: `${params.name}回撤`, type: 'drawdown', description: '距离峰值回撤（%）（基于全收益指数）' },
    series: ddSeries,
    events: ddEvents,
  });
}

async function main() {
  await buildOne({ key: 'shanghai-composite', name: '上证综指', priceCode: '000001', totalReturnCode: '000888', startDate: '19900101' });
  await buildOne({ key: 'star50', name: '科创50', priceCode: '000688', totalReturnCode: '000688CNY01', startDate: '20190101' });
  await buildOne({ key: 'csi500', name: '中证500', priceCode: '000905', totalReturnCode: 'H00905', startDate: '20050101' });
  await buildOne({ key: 'csi1000', name: '中证1000', priceCode: '000852', totalReturnCode: 'H00852', startDate: '20141017' });
  await buildOne({ key: 'csi-dividend', name: '中证红利', priceCode: '000922', totalReturnCode: 'H00922', startDate: '20050101' });
}

await main();
