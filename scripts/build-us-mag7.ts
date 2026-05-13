import path from 'node:path';
import { generateDrawdown, generateTimeSeries, generateValuationBands } from './_generators';
import { computeDrawdownEvents } from './_drawdown';
import { ensureDir, writeJson } from './_utils';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'mag7');
  await ensureDir(dir);

  const indexSeries = generateTimeSeries({ points: 1100, startVal: 40, volatility: 0.028, startDate: '2012-01-01', stepDays: 7 });
  const drawdownSeries = generateDrawdown(indexSeries);
  const drawdownEvents = computeDrawdownEvents(drawdownSeries);
  const valuationSeries = generateValuationBands({ points: 650, startDate: '2013-01-01', base: 28, mean: 28, plus1: 38, minus1: 20 });

  await writeJson(path.join(dir, 'index.json'), {
    meta: { id: 'index', name: 'Mag7 合成指数', type: 'line', description: '合成价格（示例）' },
    series: indexSeries,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: 'Mag7 回撤', type: 'drawdown', description: '距离峰值回撤（%）（示例）' },
    series: drawdownSeries,
    events: drawdownEvents,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: 'Mag7 估值', type: 'valuation', description: '估值带（示例）' },
    series: valuationSeries,
  });
}

await main();

