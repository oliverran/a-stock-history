import type { HubDef } from '../types';

export const usMag7Hub: HubDef = {
  market: 'us',
  module: 'mag7',
  slug: '/us/mag7',
  lang: 'zh-CN',
  title: 'Mag7（七巨头） | A股编年史',
  description: '用集中度视角读市场：回撤、估值与“少数权重”的风险暴露。',
  heroTitle: 'Mag7 / 七巨头',
  heroDescription: '当少数龙头主导指数，市场就更像对一小组现金流叙事的加权公投。',
  sections: [
    { sectionNumber: '1', title: '合成指数', panelKeys: ['index'] },
    { sectionNumber: '2', title: '风险', panelKeys: ['drawdowns'] },
    { sectionNumber: '3', title: '估值', panelKeys: ['valuation'] },
  ],
  panels: {
    index: {
      key: 'index',
      title: 'Mag7 合成指数',
      description: '简单合成（示例数据）。',
      lead: '集中度的研究重点不在“押注谁”，而在“当权重集中时，指数暴露会如何改变”。',
      judgement: '当少数权重主导上涨，风险变成“单一叙事风险”：一旦估值或盈利预期改变，回撤往往同步且更陡。',
      apiPath: '/api/us/mag7/index.json',
      chart: { id: 'us-mag7-index', title: 'Mag7 合成指数（示例）' },
      sources: ['示例数据：scripts/build-us-mag7.ts（随机生成）'],
      relatedKeys: ['valuation', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: '回撤',
      description: '高点到低点的损失（示例数据）。',
      judgement: '把回撤当作“拥挤度的压力测试”：集中度越高，回撤越可能呈现同步放大。',
      apiPath: '/api/us/mag7/drawdowns.json',
      chart: { id: 'us-mag7-drawdowns', title: 'Mag7 历史回撤（示例）' },
      sources: ['示例数据：scripts/build-us-mag7.ts（随机生成）'],
      relatedKeys: ['index'],
    },
    valuation: {
      key: 'valuation',
      title: '估值叠加',
      description: '估值带（示例数据）。',
      judgement: '当估值带处于高位且价格继续上冲，回报更多依赖“叙事持续”；一旦叙事瓦解，均值回归会很快变成回撤。',
      apiPath: '/api/us/mag7/valuation.json',
      chart: { id: 'us-mag7-valuation', title: 'Mag7 估值带（示例）' },
      sources: ['示例数据：scripts/build-us-mag7.ts（随机生成）'],
      relatedKeys: ['index'],
    },
  },
  related: [
    { href: '/us/sp500', title: '标普500（S&P 500）', description: '作为基准对照。' },
    { href: '/us/xlk', title: '科技（XLK）', description: '行业视角的上下文。' },
  ],
};

