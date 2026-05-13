import type { HubDef } from '../types';

export const usSemiHub: HubDef = {
  market: 'us',
  module: 'semi',
  slug: '/us/semi',
  lang: 'en',
  title: 'Semiconductors | U.S. Market Chronicle',
  description: 'SOX-style cycle lens: long-run price, annual returns, drawdowns, and valuation anchors.',
  heroTitle: 'Semiconductors',
  heroDescription: 'Semis compress the macro cycle into a sharper waveform: inventory, capex, and demand show up as clustered drawdowns.',
  sections: [
    { sectionNumber: '1', title: 'Cycle Shape', panelKeys: ['price'] },
    { sectionNumber: '2', title: 'Risk & Returns', panelKeys: ['annual-returns', 'drawdowns'] },
    { sectionNumber: '3', title: 'Valuation', panelKeys: ['valuation'] },
  ],
  panels: {
    price: {
      key: 'price',
      title: 'Long-Run Price',
      description: 'Long-run price (sample data).',
      apiPath: '/api/us/semi/price.json',
      chart: { id: 'us-semi-price', title: 'Semis long-run price (sample)' },
      relatedKeys: ['drawdowns'],
    },
    'annual-returns': {
      key: 'annual-returns',
      title: 'Annual Returns',
      description: 'Year-by-year outcomes (sample data).',
      apiPath: '/api/us/semi/annual-returns.json',
      chart: { id: 'us-semi-annual', title: 'Semis annual returns (sample)' },
      relatedKeys: ['price', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: 'Drawdowns',
      description: 'Peak-to-trough losses (sample data).',
      apiPath: '/api/us/semi/drawdowns.json',
      chart: { id: 'us-semi-drawdowns', title: 'Semis drawdowns (sample)' },
      relatedKeys: ['price'],
    },
    valuation: {
      key: 'valuation',
      title: 'Valuation Anchor',
      description: 'Valuation bands (sample data).',
      apiPath: '/api/us/semi/valuation.json',
      chart: { id: 'us-semi-valuation', title: 'Semis valuation bands (sample)' },
      relatedKeys: ['annual-returns'],
    },
  },
  related: [
    { href: '/us/nasdaq', title: 'Nasdaq', description: 'Tech-heavy benchmark.' },
    { href: '/us/mag7', title: 'Mag7', description: 'Concentration and contribution.' },
  ],
};

