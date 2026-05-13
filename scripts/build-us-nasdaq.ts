import path from 'node:path';
import { generateAnnualReturns, generateDrawdown, generateTimeSeries, generateValuationBands } from './_generators';
import { computeDrawdownEvents } from './_drawdown';
import { ensureDir, writeJson } from './_utils';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'nasdaq');
  await ensureDir(dir);

  const compositeSeries = generateTimeSeries({ points: 2200, startVal: 80, volatility: 0.025, startDate: '1971-02-05', stepDays: 7 });
  const drawdownSeries = generateDrawdown(compositeSeries);
  const drawdownEvents = computeDrawdownEvents(drawdownSeries);
  const annualSeries = generateAnnualReturns(1971, new Date().getFullYear() - 1, { min: -60, max: 70 });
  const valuationSeries = generateValuationBands({ points: 1200, startDate: '1985-01-01', base: 24, mean: 24, plus1: 34, minus1: 18 });

  await writeJson(path.join(dir, 'composite.json'), {
    meta: { id: 'composite', name: '纳指综合指数', type: 'line', description: '长期价格（示例）' },
    series: compositeSeries,
  });

  await writeJson(path.join(dir, 'annual-returns.json'), {
    meta: { id: 'annual-returns', name: '纳指年度回报', type: 'bar', description: '年度回报（%）（示例）' },
    series: annualSeries,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: '纳指回撤', type: 'drawdown', description: '距离峰值回撤（%）（示例）' },
    series: drawdownSeries,
    events: drawdownEvents,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: '纳指估值', type: 'valuation', description: '估值带（示例）' },
    series: valuationSeries,
  });
}

await main();

