import type { HubDef } from '../types';

export const usFinHub: HubDef = {
  market: 'us',
  module: 'fin',
  slug: '/us/fin',
  lang: 'en',
  title: 'Financials (XLF) | U.S. Market Chronicle',
  description: 'Financial sector lens: price, annual returns, drawdowns, valuation, and rate sensitivity.',
  heroTitle: 'Financials (XLF)',
  heroDescription: 'Financials are where macro policy becomes P&L: rates, credit, and balance-sheet stress show up as regime shifts.',
  sections: [
    { sectionNumber: '1', title: 'Long Run', panelKeys: ['price'] },
    { sectionNumber: '2', title: 'Risk & Returns', panelKeys: ['annual-returns', 'drawdowns'] },
    { sectionNumber: '3', title: 'Valuation', panelKeys: ['valuation'] },
  ],
  panels: {
    price: {
      key: 'price',
      title: 'Long-Run Price',
      description: 'Long-run price (sample data).',
      apiPath: '/api/us/fin/price.json',
      chart: { id: 'us-fin-price', title: 'XLF long-run price (sample)' },
      relatedKeys: ['drawdowns'],
    },
    'annual-returns': {
      key: 'annual-returns',
      title: 'Annual Returns',
      description: 'Year-by-year outcomes (sample data).',
      apiPath: '/api/us/fin/annual-returns.json',
      chart: { id: 'us-fin-annual', title: 'XLF annual returns (sample)' },
      relatedKeys: ['price', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: 'Drawdowns',
      description: 'Peak-to-trough losses (sample data).',
      apiPath: '/api/us/fin/drawdowns.json',
      chart: { id: 'us-fin-drawdowns', title: 'XLF drawdowns (sample)' },
      relatedKeys: ['price'],
    },
    valuation: {
      key: 'valuation',
      title: 'Valuation Anchor',
      description: 'Valuation bands (sample data).',
      apiPath: '/api/us/fin/valuation.json',
      chart: { id: 'us-fin-valuation', title: 'XLF valuation bands (sample)' },
      relatedKeys: ['annual-returns'],
    },
  },
  related: [
    { href: '/us/sp500', title: 'S&P 500', description: 'Broader benchmark.' },
  ],
};

