import path from 'node:path';
import { ensureDir, writeJson } from './_utils';
import { computeAnnualReturns } from './_annual';
import { computeDrawdown, computeDrawdownEvents } from './_drawdown';
import { fetchSohuIndexDaily, toSeriesFromSohuHq } from './_sohu';

async function buildOne(params: { key: string; name: string; sohuCode: string }) {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'broad');
  await ensureDir(dir);

  const hq = await fetchSohuIndexDaily({ code: params.sohuCode, start: '19900101', end: '20500101' });
  const priceSeries = toSeriesFromSohuHq(hq);
  if (!priceSeries.length) throw new Error(`Empty Sohu series: ${params.sohuCode}`);

  const totalReturnSeries = priceSeries;
  const annual = computeAnnualReturns(totalReturnSeries);
  const dd = computeDrawdown(totalReturnSeries);
  const ddSeries = dd.map((it) => ({ date: it.date, value: it.value }));
  const ddEvents = computeDrawdownEvents(dd);

  await writeJson(path.join(dir, `${params.key}.json`), {
    meta: { id: params.key, name: params.name, type: 'line', description: `收盘价（搜狐证券，日频，${params.sohuCode}）` },
    series: priceSeries,
  });

  await writeJson(path.join(dir, `${params.key}-total-return.json`), {
    meta: {
      id: `${params.key}-total-return`,
      name: `${params.name}总回报（代理）`,
      type: 'line',
      description: '暂以价格指数近似总回报（不含分红再投入），后续可替换为官方全收益指数',
    },
    series: totalReturnSeries,
  });

  await writeJson(path.join(dir, `${params.key}-annual-returns.json`), {
    meta: { id: `${params.key}-annual-returns`, name: `${params.name}年度回报`, type: 'bar', description: '年度回报（%）（暂基于价格指数）' },
    series: annual,
  });

  await writeJson(path.join(dir, `${params.key}-drawdowns.json`), {
    meta: { id: `${params.key}-drawdowns`, name: `${params.name}回撤`, type: 'drawdown', description: '距离峰值回撤（%）（暂基于价格指数）' },
    series: ddSeries,
    events: ddEvents,
  });
}

async function main() {
  await buildOne({ key: 'shenzhen-component', name: '深证成指', sohuCode: 'zs_399001' });
  await buildOne({ key: 'chinext', name: '创业板指', sohuCode: 'zs_399006' });
}

await main();
