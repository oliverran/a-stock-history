import type { HubDef } from '../types';

export const usFinHub: HubDef = {
  market: 'us',
  module: 'fin',
  slug: '/us/fin',
  lang: 'zh-CN',
  title: '金融（XLF） | A股编年史',
  description: '金融行业视角：长期形状、年度结果、回撤名册与估值锚点。',
  heroTitle: 'XLF / 金融',
  heroDescription: '金融板块是“宏观政策 → 利润表”的传导通道：利率、信用与资产负债表压力常以制度切换的方式体现。',
  sections: [
    { sectionNumber: '1', title: '长期形状', panelKeys: ['price'] },
    { sectionNumber: '2', title: '年度与回撤', panelKeys: ['annual-returns', 'drawdowns'] },
    { sectionNumber: '3', title: '估值锚点', panelKeys: ['valuation'] },
  ],
  panels: {
    price: {
      key: 'price',
      title: '长期价格',
      description: '长期价格曲线（示例数据）。',
      judgement: '金融板块的关键不是“增长”，而是“风险定价”：回撤与估值的切换往往更受利率与信用环境影响。',
      apiPath: '/api/us/fin/price.json',
      chart: { id: 'us-fin-price', title: 'XLF 长期价格（示例）' },
      sources: ['示例数据：scripts/build-us-fin.ts（随机生成）'],
      relatedKeys: ['drawdowns'],
    },
    'annual-returns': {
      key: 'annual-returns',
      title: '年度回报',
      description: '逐年结账（示例数据）。',
      apiPath: '/api/us/fin/annual-returns.json',
      chart: { id: 'us-fin-annual', title: 'XLF 年度回报（示例）' },
      sources: ['示例数据：scripts/build-us-fin.ts（随机生成）'],
      relatedKeys: ['price', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: '回撤名册',
      description: '高点到低点的损失（示例数据）。',
      apiPath: '/api/us/fin/drawdowns.json',
      chart: { id: 'us-fin-drawdowns', title: 'XLF 历史回撤（示例）' },
      sources: ['示例数据：scripts/build-us-fin.ts（随机生成）'],
      relatedKeys: ['price'],
    },
    valuation: {
      key: 'valuation',
      title: '估值锚点',
      description: '估值带（示例数据）。',
      apiPath: '/api/us/fin/valuation.json',
      chart: { id: 'us-fin-valuation', title: 'XLF 估值带（示例）' },
      sources: ['示例数据：scripts/build-us-fin.ts（随机生成）'],
      relatedKeys: ['annual-returns'],
    },
  },
  related: [
    { href: '/us/sp500', title: '标普500（S&P 500）', description: '更宽的基准对照。' },
  ],
};

