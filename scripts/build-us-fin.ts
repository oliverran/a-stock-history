import path from 'node:path';
import { generateAnnualReturns, generateDrawdown, generateTimeSeries, generateValuationBands } from './_generators';
import { ensureDir, writeJson } from './_utils';

async function main() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'api', 'us', 'fin');
  await ensureDir(dir);

  const priceSeries = generateTimeSeries({ points: 1400, startVal: 30, volatility: 0.02, startDate: '1999-01-01', stepDays: 7 });
  const drawdownSeries = generateDrawdown(priceSeries);
  const annualSeries = generateAnnualReturns(1999, new Date().getFullYear() - 1, { min: -60, max: 60 });
  const valuationSeries = generateValuationBands({ points: 850, startDate: '2002-01-01', base: 14, mean: 14, plus1: 18, minus1: 10 });

  await writeJson(path.join(dir, 'price.json'), {
    meta: { id: 'price', name: 'Financials (XLF)', type: 'line', description: 'Long-run price (sample)' },
    series: priceSeries,
  });

  await writeJson(path.join(dir, 'annual-returns.json'), {
    meta: { id: 'annual-returns', name: 'XLF Annual Returns', type: 'bar', description: 'Annual returns (%) (sample)' },
    series: annualSeries,
  });

  await writeJson(path.join(dir, 'drawdowns.json'), {
    meta: { id: 'drawdowns', name: 'XLF Drawdowns', type: 'drawdown', description: 'Drawdowns from peak (%) (sample)' },
    series: drawdownSeries,
  });

  await writeJson(path.join(dir, 'valuation.json'), {
    meta: { id: 'valuation', name: 'XLF Valuation', type: 'valuation', description: 'Valuation bands (sample)' },
    series: valuationSeries,
  });
}

await main();

