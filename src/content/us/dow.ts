import type { HubDef } from '../types';

export const usDowHub: HubDef = {
  market: 'us',
  module: 'dow',
  slug: '/us/dow',
  lang: 'en',
  title: 'Dow Jones | U.S. Market Chronicle',
  description: 'A legacy lens: long-run price, annual returns, drawdowns, and valuation anchors.',
  heroTitle: 'Dow Jones',
  heroDescription: 'The Dow is a compact story of U.S. industrial-to-service evolution, best read as a long-run compounding series with a changing basket.',
  sections: [
    { sectionNumber: '1', title: 'Long Run', panelKeys: ['century'] },
    { sectionNumber: '2', title: 'Risk & Returns', panelKeys: ['annual-returns', 'drawdowns'] },
    { sectionNumber: '3', title: 'Valuation', panelKeys: ['valuation'] },
  ],
  panels: {
    century: {
      key: 'century',
      title: 'Long-Run Price',
      description: 'Century-scale price (sample data).',
      apiPath: '/api/us/dow/century.json',
      chart: { id: 'us-dow-century', title: 'Dow long-run price (sample)' },
      relatedKeys: ['drawdowns'],
    },
    'annual-returns': {
      key: 'annual-returns',
      title: 'Annual Returns',
      description: 'Year-by-year outcomes (sample data).',
      apiPath: '/api/us/dow/annual-returns.json',
      chart: { id: 'us-dow-annual', title: 'Dow annual returns (sample)' },
      relatedKeys: ['century', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: 'Drawdowns',
      description: 'Peak-to-trough losses (sample data).',
      apiPath: '/api/us/dow/drawdowns.json',
      chart: { id: 'us-dow-drawdowns', title: 'Dow drawdowns (sample)' },
      relatedKeys: ['century'],
    },
    valuation: {
      key: 'valuation',
      title: 'Valuation Anchor',
      description: 'Valuation bands (sample data).',
      apiPath: '/api/us/dow/valuation.json',
      chart: { id: 'us-dow-valuation', title: 'Dow valuation bands (sample)' },
      relatedKeys: ['annual-returns'],
    },
  },
  related: [
    { href: '/us/sp500', title: 'S&P 500', description: 'Broad benchmark.' },
  ],
};

