import type { HubDef } from '../types';

export const usDowHub: HubDef = {
  market: 'us',
  module: 'dow',
  slug: '/us/dow',
  lang: 'zh-CN',
  title: '道琼斯（Dow） | A股编年史',
  description: '老牌基准：长期形状、年度回报、回撤名册与估值锚点。',
  heroTitle: 'Dow / 道琼斯',
  heroDescription: '道指是一段浓缩的“产业结构变迁史”。把它当作长期复利曲线来读，同时记住成分篮子会变。',
  sections: [
    { sectionNumber: '1', title: '长期形状', panelKeys: ['century'] },
    { sectionNumber: '2', title: '年度与回撤', panelKeys: ['annual-returns', 'drawdowns'] },
    { sectionNumber: '3', title: '估值锚点', panelKeys: ['valuation'] },
  ],
  panels: {
    century: {
      key: 'century',
      title: '世纪尺度价格',
      description: '长期价格曲线（示例数据）。',
      judgement: '把它当作“基准的基准”：更适合观察长期复利与大回撤，而不是用来解释短期风格切换。',
      apiPath: '/api/us/dow/century.json',
      chart: { id: 'us-dow-century', title: '道指长期价格（示例）' },
      methodology: '示例数据为脚本生成；替换真实数据后需明确指数复权与分红口径。',
      sources: ['示例数据：scripts/build-us-dow.ts（随机生成）'],
      relatedKeys: ['drawdowns'],
    },
    'annual-returns': {
      key: 'annual-returns',
      title: '年度回报',
      description: '逐年结账（示例数据）。',
      apiPath: '/api/us/dow/annual-returns.json',
      chart: { id: 'us-dow-annual', title: '道指年度回报（示例）' },
      methodology: '示例数据按区间随机生成年度收益率。',
      sources: ['示例数据：scripts/build-us-dow.ts（随机生成）'],
      relatedKeys: ['century', 'drawdowns'],
    },
    drawdowns: {
      key: 'drawdowns',
      title: '回撤名册',
      description: '高点到低点的损失（示例数据）。',
      apiPath: '/api/us/dow/drawdowns.json',
      chart: { id: 'us-dow-drawdowns', title: '道指历史回撤（示例）' },
      methodology: '回撤按“距离历史峰值的百分比”计算。',
      sources: ['示例数据：scripts/build-us-dow.ts（随机生成）'],
      relatedKeys: ['century'],
    },
    valuation: {
      key: 'valuation',
      title: '估值锚点',
      description: '估值带（示例数据）。',
      apiPath: '/api/us/dow/valuation.json',
      chart: { id: 'us-dow-valuation', title: '道指估值带（示例）' },
      methodology: '当前为示例估值带结构；替换真实估值时需明确口径与样本窗口。',
      sources: ['示例数据：scripts/build-us-dow.ts（随机生成）'],
      relatedKeys: ['annual-returns'],
    },
  },
  related: [
    { href: '/us/sp500', title: '标普500（S&P 500）', description: '更宽的基准对照。' },
  ],
};

