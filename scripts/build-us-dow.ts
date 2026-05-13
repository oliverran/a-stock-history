import path from 'node:path';
import { generateAnnualReturns, generateDrawdown, generateTimeSeries, generateValuationBands } from './_generators';
import { computeDrawdownEvents } from './_drawdown';
import { ensureDir, writeJson } from './_utils';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'dow');
  await ensureDir(dir);

  const centurySeries = generateTimeSeries({ points: 2600, startVal: 70, volatility: 0.016, startDate: '1928-01-01', stepDays: 7 });
  const drawdownSeries = generateDrawdown(centurySeries);
  const drawdownEvents = computeDrawdownEvents(drawdownSeries);
  const annualSeries = generateAnnualReturns(1928, new Date().getFullYear() - 1, { min: -45, max: 50 });
  const valuationSeries = generateValuationBands({ points: 1600, startDate: '1950-01-01', base: 16, mean: 16, plus1: 22, minus1: 12 });

  await writeJson(path.join(dir, 'century.json'), {
    meta: { id: 'century', name: '道琼斯', type: 'line', description: '世纪尺度价格（示例）' },
    series: centurySeries,
  });

  await writeJson(path.join(dir, 'annual-returns.json'), {
    meta: { id: 'annual-returns', name: '道琼斯年度回报', type: 'bar', description: '年度回报（%）（示例）' },
    series: annualSeries,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: '道琼斯回撤', type: 'drawdown', description: '距离峰值回撤（%）（示例）' },
    series: drawdownSeries,
    events: drawdownEvents,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: '道琼斯估值', type: 'valuation', description: '估值带（示例）' },
    series: valuationSeries,
  });
}

await main();

