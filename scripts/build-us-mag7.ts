import path from 'node:path';
import { generateDrawdown, generateTimeSeries, generateValuationBands } from './_generators';
import { ensureDir, writeJson } from './_utils';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'mag7');
  await ensureDir(dir);

  const indexSeries = generateTimeSeries({ points: 1100, startVal: 40, volatility: 0.028, startDate: '2012-01-01', stepDays: 7 });
  const drawdownSeries = generateDrawdown(indexSeries);
  const valuationSeries = generateValuationBands({ points: 650, startDate: '2013-01-01', base: 28, mean: 28, plus1: 38, minus1: 20 });

  await writeJson(path.join(dir, 'index.json'), {
    meta: { id: 'index', name: 'Mag7 Composite', type: 'line', description: 'Composite price (sample)' },
    series: indexSeries,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: 'Mag7 Drawdowns', type: 'drawdown', description: 'Drawdowns from peak (%) (sample)' },
    series: drawdownSeries,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: 'Mag7 Valuation', type: 'valuation', description: 'Valuation bands (sample)' },
    series: valuationSeries,
  });
}

await main();

