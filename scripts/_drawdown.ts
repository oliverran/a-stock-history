export type Point = { date: string; value: number };

export function computeDrawdown(series: Point[]) {
  let peak = series[0]?.value ?? 0;
  let peakDate = series[0]?.date ?? '';
  const out: Array<{ date: string; value: number; peakDate: string }> = [];
  for (const it of series) {
    if (it.value >= peak) {
      peak = it.value;
      peakDate = it.date;
    }
    const dd = peak === 0 ? 0 : ((it.value - peak) / peak) * 100;
    out.push({ date: it.date, value: Number(dd.toFixed(2)), peakDate });
  }
  return out;
}

export function computeDrawdownEvents(dd: Array<{ date: string; value: number; peakDate: string }>) {
  const events: Array<{
    name: string;
    start: string;
    trough: string;
    end: string;
    depth: number;
    durationDays: number;
    recoveryDays: number;
  }> = [];

  let inEvent = false;
  let start = '';
  let trough = '';
  let end = '';
  let depth = 0;

  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / dayMs);

  for (let i = 0; i < dd.length; i++) {
    const it = dd[i];
    const isDown = it.value < 0;
    const isRecovered = it.value === 0;

    if (!inEvent && isDown) {
      inEvent = true;
      start = it.peakDate || it.date;
      trough = it.date;
      depth = it.value;
      continue;
    }

    if (inEvent) {
      if (it.value < depth) {
        depth = it.value;
        trough = it.date;
      }
      if (isRecovered) {
        end = it.date;
        const idx = events.length + 1;
        const year = start.slice(0, 4);
        events.push({
          name: `${year} 回撤#${idx}`,
          start,
          trough,
          end,
          depth: Number(depth.toFixed(2)),
          durationDays: Math.max(0, diffDays(start, trough)),
          recoveryDays: Math.max(0, diffDays(trough, end)),
        });
        inEvent = false;
        start = '';
        trough = '';
        end = '';
        depth = 0;
      }
    }
  }

  return events;
}
