export function generateTimeSeries(params: {
  points: number;
  startVal: number;
  volatility?: number;
  startDate: string;
  stepDays?: number;
}) {
  const { points, startVal, volatility = 0.02, startDate, stepDays = 1 } = params;
  const data: Array<{ date: string; value: number }> = [];
  let current = startVal;
  const start = new Date(startDate);

  for (let i = 0; i < points; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i * stepDays);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    current = current * (1 + (Math.random() - 0.49) * volatility);
    data.push({ date: d.toISOString().slice(0, 10), value: Number(current.toFixed(2)) });
  }

  return data;
}

export function generateDrawdown(series: Array<{ date: string; value: number }>) {
  let peak = series[0]?.value ?? 0;
  let peakDate = series[0]?.date ?? '';
  return series.map((it) => {
    if (it.value > peak) {
      peak = it.value;
      peakDate = it.date;
    }
    const dd = peak === 0 ? 0 : ((it.value - peak) / peak) * 100;
    return { date: it.date, value: Number(dd.toFixed(2)), peakDate };
  });
}

export function generateAnnualReturns(startYear: number, endYear: number, range: { min: number; max: number } = { min: -35, max: 45 }) {
  const data: Array<{ date: string; value: number }> = [];
  for (let y = startYear; y <= endYear; y++) {
    const ret = range.min + Math.random() * (range.max - range.min);
    data.push({ date: String(y), value: Number(ret.toFixed(2)) });
  }
  return data;
}

export function generateValuationBands(params: {
  points: number;
  startDate: string;
  base: number;
  volatility?: number;
  mean: number;
  plus1: number;
  minus1: number;
}) {
  const { points, startDate, base, volatility = 0.01, mean, plus1, minus1 } = params;
  const ts = generateTimeSeries({ points, startVal: base, volatility, startDate });
  return ts.map((it) => ({ date: it.date, value: it.value, mean, plus1, minus1 }));
}

