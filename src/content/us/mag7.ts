import type { HubDef } from '../types';

export const usMag7Hub: HubDef = {
  market: 'us',
  module: 'mag7',
  slug: '/us/mag7',
  lang: 'en',
  title: 'Mag7 | U.S. Market Chronicle',
  description: 'A concentration lens: contribution, valuation, drawdowns, and crowding proxies.',
  heroTitle: 'Mag7',
  heroDescription: 'When a handful of names dominate the index, the market becomes a weighted referendum on a small set of cashflow narratives.',
  sections: [
    { sectionNumber: '1', title: 'Composite', panelKeys: ['index'] },
    { sectionNumber: '2', title: 'Risk', panelKeys: ['drawdowns'] },
    { sectionNumber: '3', title: 'Valuation', panelKeys: ['valuation'] },
  ],
  panels: {
    index: {
      key: 'index',
      title: 'Mag7 Composite',
      description: 'A simple composite (sample data).',
      apiPath: '/api/us/mag7/index.json',
      chart: { id: 'us-mag7-index', title: 'Mag7 composite (sample)' },
      relatedKeys: ['valuation', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: 'Drawdowns',
      description: 'Peak-to-trough losses (sample data).',
      apiPath: '/api/us/mag7/drawdowns.json',
      chart: { id: 'us-mag7-drawdowns', title: 'Mag7 drawdowns (sample)' },
      relatedKeys: ['index'],
    },
    valuation: {
      key: 'valuation',
      title: 'Valuation Overlay',
      description: 'Valuation bands (sample data).',
      apiPath: '/api/us/mag7/valuation.json',
      chart: { id: 'us-mag7-valuation', title: 'Mag7 valuation (sample)' },
      relatedKeys: ['index'],
    },
  },
  related: [
    { href: '/us/sp500', title: 'S&P 500', description: 'Benchmark comparison.' },
    { href: '/us/xlk', title: 'XLK', description: 'Sector context.' },
  ],
};

