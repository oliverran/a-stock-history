import path from 'node:path';
import { generateAnnualReturns, generateDrawdown, generateTimeSeries, generateValuationBands } from './_generators';
import { computeDrawdownEvents } from './_drawdown';
import { ensureDir, writeJson } from './_utils';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'semi');
  await ensureDir(dir);

  const priceSeries = generateTimeSeries({ points: 1600, startVal: 50, volatility: 0.03, startDate: '1993-01-01', stepDays: 7 });
  const drawdownSeries = generateDrawdown(priceSeries);
  const drawdownEvents = computeDrawdownEvents(drawdownSeries);
  const annualSeries = generateAnnualReturns(1993, new Date().getFullYear() - 1, { min: -70, max: 90 });
  const valuationSeries = generateValuationBands({ points: 900, startDate: '1998-01-01', base: 22, mean: 22, plus1: 32, minus1: 16 });

  await writeJson(path.join(dir, 'price.json'), {
    meta: { id: 'price', name: '半导体', type: 'line', description: '长期价格（示例）' },
    series: priceSeries,
  });

  await writeJson(path.join(dir, 'annual-returns.json'), {
    meta: { id: 'annual-returns', name: '半导体年度回报', type: 'bar', description: '年度回报（%）（示例）' },
    series: annualSeries,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: '半导体回撤', type: 'drawdown', description: '距离峰值回撤（%）（示例）' },
    series: drawdownSeries,
    events: drawdownEvents,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: '半导体估值', type: 'valuation', description: '估值带（示例）' },
    series: valuationSeries,
  });
}

await main();

