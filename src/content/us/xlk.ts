import type { HubDef } from '../types';

export const usXlkHub: HubDef = {
  market: 'us',
  module: 'xlk',
  slug: '/us/xlk',
  lang: 'en',
  title: 'Technology (XLK) | U.S. Market Chronicle',
  description: 'Technology sector lens: long-run price, annual returns, drawdowns, and valuation anchors.',
  heroTitle: 'Technology (XLK)',
  heroDescription: 'Sector ETFs make “composition” part of the story: weighting shifts and concentration change the effective exposure over time.',
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
      apiPath: '/api/us/xlk/price.json',
      chart: { id: 'us-xlk-price', title: 'XLK long-run price (sample)' },
      relatedKeys: ['drawdowns'],
    },
    'annual-returns': {
      key: 'annual-returns',
      title: 'Annual Returns',
      description: 'Year-by-year outcomes (sample data).',
      apiPath: '/api/us/xlk/annual-returns.json',
      chart: { id: 'us-xlk-annual', title: 'XLK annual returns (sample)' },
      relatedKeys: ['price', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: 'Drawdowns',
      description: 'Peak-to-trough losses (sample data).',
      apiPath: '/api/us/xlk/drawdowns.json',
      chart: { id: 'us-xlk-drawdowns', title: 'XLK drawdowns (sample)' },
      relatedKeys: ['price'],
    },
    valuation: {
      key: 'valuation',
      title: 'Valuation Anchor',
      description: 'Valuation bands (sample data).',
      apiPath: '/api/us/xlk/valuation.json',
      chart: { id: 'us-xlk-valuation', title: 'XLK valuation bands (sample)' },
      relatedKeys: ['annual-returns'],
    },
  },
  related: [
    { href: '/us/mag7', title: 'Mag7', description: 'Concentration within tech exposure.' },
    { href: '/us/sp500', title: 'S&P 500', description: 'Broader benchmark.' },
  ],
};

