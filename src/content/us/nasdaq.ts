import type { HubDef } from '../types';

export const usNasdaqHub: HubDef = {
  market: 'us',
  module: 'nasdaq',
  slug: '/us/nasdaq',
  lang: 'en',
  title: 'Nasdaq | U.S. Market Chronicle',
  description: 'Composite vs large-cap tech tilt: long-run shape, annual outcomes, drawdowns, valuation, and concentration.',
  heroTitle: 'Nasdaq',
  heroDescription: 'Nasdaq is where duration meets narrative: bubbles look similar in price, but different in valuation and concentration.',
  sections: [
    { sectionNumber: '1', title: 'Long Run', panelKeys: ['composite'] },
    { sectionNumber: '2', title: 'Risk & Returns', panelKeys: ['annual-returns', 'drawdowns'] },
    { sectionNumber: '3', title: 'Valuation', panelKeys: ['valuation'] },
  ],
  panels: {
    composite: {
      key: 'composite',
      title: 'Nasdaq Composite',
      description: 'Long-run price (sample data).',
      apiPath: '/api/us/nasdaq/composite.json',
      chart: { id: 'us-nasdaq-composite', title: 'Nasdaq Composite long-run (sample)' },
      relatedKeys: ['drawdowns', 'valuation'],
    },
    'annual-returns': {
      key: 'annual-returns',
      title: 'Annual Returns',
      description: 'Year-by-year outcomes (sample data).',
      apiPath: '/api/us/nasdaq/annual-returns.json',
      chart: { id: 'us-nasdaq-annual', title: 'Nasdaq annual returns (sample)' },
      relatedKeys: ['composite', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: 'Drawdowns',
      description: 'Peak-to-trough losses (sample data).',
      apiPath: '/api/us/nasdaq/drawdowns.json',
      chart: { id: 'us-nasdaq-drawdowns', title: 'Nasdaq drawdowns (sample)' },
      relatedKeys: ['composite', 'valuation'],
    },
    valuation: {
      key: 'valuation',
      title: 'Valuation Anchor',
      description: 'Valuation bands (sample data).',
      apiPath: '/api/us/nasdaq/valuation.json',
      chart: { id: 'us-nasdaq-valuation', title: 'Nasdaq valuation bands (sample)' },
      relatedKeys: ['annual-returns'],
    },
  },
  related: [
    { href: '/us/sp500', title: 'S&P 500', description: 'A broad benchmark for comparison.' },
    { href: '/us/semi', title: 'Semiconductors', description: 'Cycle overlays and bubble echoes.' },
  ],
};

