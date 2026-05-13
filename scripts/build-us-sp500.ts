import path from 'node:path';
import { generateAnnualReturns, generateDrawdown, generateTimeSeries, generateValuationBands } from './_generators';
import { ensureDir, writeJson } from './_utils';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'sp500');
  await ensureDir(dir);

  const centurySeries = generateTimeSeries({ points: 2600, startVal: 100, volatility: 0.018, startDate: '1928-01-01', stepDays: 7 });
  const drawdownSeries = generateDrawdown(centurySeries);
  const annualSeries = generateAnnualReturns(1928, new Date().getFullYear() - 1, { min: -45, max: 55 });
  const valuationSeries = generateValuationBands({ points: 1600, startDate: '1950-01-01', base: 18, mean: 18, plus1: 24, minus1: 14 });

  await writeJson(path.join(dir, 'century.json'), {
    meta: { id: 'century', name: 'S&P 500', type: 'line', description: 'Century-scale price (sample)' },
    series: centurySeries,
  });

  await writeJson(path.join(dir, 'annual-returns.json'), {
    meta: { id: 'annual-returns', name: 'S&P 500 Annual Returns', type: 'bar', description: 'Annual returns (%) (sample)' },
    series: annualSeries,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: 'S&P 500 Drawdowns', type: 'drawdown', description: 'Drawdowns from peak (%) (sample)' },
    series: drawdownSeries,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: 'S&P 500 Valuation', type: 'valuation', description: 'Valuation bands (sample)' },
    series: valuationSeries,
  });
}

await main();

