import path from 'node:path';
import { generateAnnualReturns, generateDrawdown, generateTimeSeries, generateValuationBands } from './_generators';
import { ensureDir, writeJson } from './_utils';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'nasdaq');
  await ensureDir(dir);

  const compositeSeries = generateTimeSeries({ points: 2200, startVal: 80, volatility: 0.025, startDate: '1971-02-05', stepDays: 7 });
  const drawdownSeries = generateDrawdown(compositeSeries);
  const annualSeries = generateAnnualReturns(1971, new Date().getFullYear() - 1, { min: -60, max: 70 });
  const valuationSeries = generateValuationBands({ points: 1200, startDate: '1985-01-01', base: 24, mean: 24, plus1: 34, minus1: 18 });

  await writeJson(path.join(dir, 'composite.json'), {
    meta: { id: 'composite', name: 'Nasdaq Composite', type: 'line', description: 'Long-run price (sample)' },
    series: compositeSeries,
  });

  await writeJson(path.join(dir, 'annual-returns.json'), {
    meta: { id: 'annual-returns', name: 'Nasdaq Annual Returns', type: 'bar', description: 'Annual returns (%) (sample)' },
    series: annualSeries,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: 'Nasdaq Drawdowns', type: 'drawdown', description: 'Drawdowns from peak (%) (sample)' },
    series: drawdownSeries,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: 'Nasdaq Valuation', type: 'valuation', description: 'Valuation bands (sample)' },
    series: valuationSeries,
  });
}

await main();

