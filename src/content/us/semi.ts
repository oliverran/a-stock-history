import type { HubDef } from '../types';

export const usSemiHub: HubDef = {
  market: 'us',
  module: 'semi',
  slug: '/us/semi',
  lang: 'zh-CN',
  title: '半导体（Semis） | A股编年史',
  description: '周期更尖锐的波形：长期形状、年度结果、回撤名册与估值锚点。',
  heroTitle: 'Semis / 半导体',
  heroDescription: '半导体把宏观周期压缩成更尖锐的波形：库存、资本开支与需求的变化常以“簇状回撤”体现。',
  sections: [
    { sectionNumber: '1', title: '周期形状', panelKeys: ['price'] },
    { sectionNumber: '2', title: '年度与回撤', panelKeys: ['annual-returns', 'drawdowns'] },
    { sectionNumber: '3', title: '估值锚点', panelKeys: ['valuation'] },
  ],
  panels: {
    price: {
      key: 'price',
      title: '长期价格',
      description: '长期价格曲线（示例数据）。',
      judgement: '半导体的核心不是“更好/更差”，而是“更周期”：回撤通常更深、更集中。',
      apiPath: '/api/us/semi/price.json',
      chart: { id: 'us-semi-price', title: '半导体长期价格（示例）' },
      methodology: '示例数据为脚本生成；替换真实数据时可叠加库存/PMI/利率等周期变量作对照。',
      sources: ['示例数据：scripts/build-us-semi.ts（随机生成）'],
      relatedKeys: ['drawdowns'],
    },
    'annual-returns': {
      key: 'annual-returns',
      title: '年度回报',
      description: '逐年结账（示例数据）。',
      apiPath: '/api/us/semi/annual-returns.json',
      chart: { id: 'us-semi-annual', title: '半导体年度回报（示例）' },
      sources: ['示例数据：scripts/build-us-semi.ts（随机生成）'],
      relatedKeys: ['price', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: '回撤名册',
      description: '高点到低点的损失（示例数据）。',
      apiPath: '/api/us/semi/drawdowns.json',
      chart: { id: 'us-semi-drawdowns', title: '半导体历史回撤（示例）' },
      sources: ['示例数据：scripts/build-us-semi.ts（随机生成）'],
      relatedKeys: ['price'],
    },
    valuation: {
      key: 'valuation',
      title: '估值锚点',
      description: '估值带（示例数据）。',
      apiPath: '/api/us/semi/valuation.json',
      chart: { id: 'us-semi-valuation', title: '半导体估值带（示例）' },
      sources: ['示例数据：scripts/build-us-semi.ts（随机生成）'],
      relatedKeys: ['annual-returns'],
    },
  },
  related: [
    { href: '/us/nasdaq', title: '纳斯达克（Nasdaq）', description: '科技权重更高的基准。' },
    { href: '/us/mag7', title: 'Mag7（七巨头）', description: '集中度与贡献度。' },
  ],
};

