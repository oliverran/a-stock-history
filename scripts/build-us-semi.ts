import path from 'node:path';
import { generateAnnualReturns, generateDrawdown, generateTimeSeries, generateValuationBands } from './_generators';
import { ensureDir, writeJson } from './_utils';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'semi');
  await ensureDir(dir);

  const priceSeries = generateTimeSeries({ points: 1600, startVal: 50, volatility: 0.03, startDate: '1993-01-01', stepDays: 7 });
  const drawdownSeries = generateDrawdown(priceSeries);
  const annualSeries = generateAnnualReturns(1993, new Date().getFullYear() - 1, { min: -70, max: 90 });
  const valuationSeries = generateValuationBands({ points: 900, startDate: '1998-01-01', base: 22, mean: 22, plus1: 32, minus1: 16 });

  await writeJson(path.join(dir, 'price.json'), {
    meta: { id: 'price', name: 'Semiconductors', type: 'line', description: 'Long-run price (sample)' },
    series: priceSeries,
  });

  await writeJson(path.join(dir, 'annual-returns.json'), {
    meta: { id: 'annual-returns', name: 'Semiconductors Annual Returns', type: 'bar', description: 'Annual returns (%) (sample)' },
    series: annualSeries,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: 'Semiconductors Drawdowns', type: 'drawdown', description: 'Drawdowns from peak (%) (sample)' },
    series: drawdownSeries,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: 'Semiconductors Valuation', type: 'valuation', description: 'Valuation bands (sample)' },
    series: valuationSeries,
  });
}

await main();

