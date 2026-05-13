import path from 'node:path';
import { generateAnnualReturns, generateDrawdown, generateTimeSeries, generateValuationBands } from './_generators';
import { computeDrawdownEvents } from './_drawdown';
import { ensureDir, writeJson } from './_utils';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'xlk');
  await ensureDir(dir);

  const priceSeries = generateTimeSeries({ points: 1400, startVal: 40, volatility: 0.022, startDate: '1999-01-01', stepDays: 7 });
  const drawdownSeries = generateDrawdown(priceSeries);
  const drawdownEvents = computeDrawdownEvents(drawdownSeries);
  const annualSeries = generateAnnualReturns(1999, new Date().getFullYear() - 1, { min: -55, max: 65 });
  const valuationSeries = generateValuationBands({ points: 850, startDate: '2002-01-01', base: 23, mean: 23, plus1: 32, minus1: 17 });

  await writeJson(path.join(dir, 'price.json'), {
    meta: { id: 'price', name: '科技（XLK）', type: 'line', description: '长期价格（示例）' },
    series: priceSeries,
  });

  await writeJson(path.join(dir, 'annual-returns.json'), {
    meta: { id: 'annual-returns', name: 'XLK 年度回报', type: 'bar', description: '年度回报（%）（示例）' },
    series: annualSeries,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: 'XLK 回撤', type: 'drawdown', description: '距离峰值回撤（%）（示例）' },
    series: drawdownSeries,
    events: drawdownEvents,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: 'XLK 估值', type: 'valuation', description: '估值带（示例）' },
    series: valuationSeries,
  });
}

await main();

