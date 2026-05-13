import type { HubDef } from '../types';

export const usXlkHub: HubDef = {
  market: 'us',
  module: 'xlk',
  slug: '/us/xlk',
  lang: 'zh-CN',
  title: '科技（XLK） | A股编年史',
  description: '科技行业视角：长期形状、年度结果、回撤名册与估值锚点。',
  heroTitle: 'XLK / 科技',
  heroDescription: '行业 ETF 的“成分变化”本身就是叙事的一部分：权重迁移与集中度会改变你的实际暴露。',
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
      judgement: '科技板块的关键变量之一是集中度：当权重集中在少数龙头时，风险与回报会更“指数化”。',
      apiPath: '/api/us/xlk/price.json',
      chart: { id: 'us-xlk-price', title: 'XLK 长期价格（示例）' },
      sources: ['示例数据：scripts/build-us-xlk.ts（随机生成）'],
      relatedKeys: ['drawdowns'],
    },
    'annual-returns': {
      key: 'annual-returns',
      title: '年度回报',
      description: '逐年结账（示例数据）。',
      apiPath: '/api/us/xlk/annual-returns.json',
      chart: { id: 'us-xlk-annual', title: 'XLK 年度回报（示例）' },
      sources: ['示例数据：scripts/build-us-xlk.ts（随机生成）'],
      relatedKeys: ['price', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: '回撤名册',
      description: '高点到低点的损失（示例数据）。',
      apiPath: '/api/us/xlk/drawdowns.json',
      chart: { id: 'us-xlk-drawdowns', title: 'XLK 历史回撤（示例）' },
      sources: ['示例数据：scripts/build-us-xlk.ts（随机生成）'],
      relatedKeys: ['price'],
    },
    valuation: {
      key: 'valuation',
      title: '估值锚点',
      description: '估值带（示例数据）。',
      apiPath: '/api/us/xlk/valuation.json',
      chart: { id: 'us-xlk-valuation', title: 'XLK 估值带（示例）' },
      sources: ['示例数据：scripts/build-us-xlk.ts（随机生成）'],
      relatedKeys: ['annual-returns'],
    },
  },
  related: [
    { href: '/us/mag7', title: 'Mag7（七巨头）', description: '科技暴露里的集中度与贡献度。' },
    { href: '/us/sp500', title: '标普500（S&P 500）', description: '更宽的基准对照。' },
  ],
};

