import type { HubDef } from '../types';

export const cnClustersHub: HubDef = {
  market: 'cn',
  module: 'clusters',
  slug: '/cn/clusters',
  lang: 'zh-CN',
  title: '抱团 | A股编年史',
  description: '把抱团交易从情绪词变成可量化对象：集中度、相关性、谱系与贡献度。',
  heroTitle: 'Clusters / 抱团',
  heroDescription: '抱团不是“坏”或“好”，而是集中度上升后的必然副作用：更高的相关性、更脆的回撤、更强的叙事依赖。',
  sections: [
    {
      sectionNumber: '1',
      title: '典型组合',
      panelKeys: ['liquor-club', 'ning-combo', 'special-valuation', 'ai-compute'],
    },
    {
      sectionNumber: '2',
      title: '结构指标',
      panelKeys: ['concentration', 'correlation', 'predecessors'],
    },
  ],
  panels: {
    'liquor-club': {
      key: 'liquor-club',
      title: '茅指数',
      description: '高集中度的经典样本。',
      apiPath: '/api/cn/clusters/liquor-club.json',
      chart: { id: 'cn-clusters-liquor', title: '茅指数（示例）' },
      relatedKeys: ['concentration', 'correlation'],
    },
    'ning-combo': {
      key: 'ning-combo',
      title: '宁组合',
      description: '新能源抱团的代表性叙事。',
      apiPath: '/api/cn/clusters/ning-combo.json',
      chart: { id: 'cn-clusters-ning', title: '宁组合（示例）' },
      relatedKeys: ['concentration', 'correlation'],
    },
    'special-valuation': {
      key: 'special-valuation',
      title: '中特估',
      description: '估值修复与预期变化。',
      apiPath: '/api/cn/clusters/special-valuation.json',
      chart: { id: 'cn-clusters-special', title: '中特估（示例）' },
      relatedKeys: ['concentration', 'predecessors'],
    },
    'ai-compute': {
      key: 'ai-compute',
      title: 'AI 算力',
      description: '新叙事的拥挤度试验场。',
      apiPath: '/api/cn/clusters/ai-compute.json',
      chart: { id: 'cn-clusters-ai', title: 'AI 算力（示例）' },
      relatedKeys: ['correlation', 'concentration'],
    },
    concentration: {
      key: 'concentration',
      title: '集中度',
      description: '用集中度解释“为什么会一起涨跌”。',
      apiPath: '/api/cn/clusters/concentration.json',
      chart: { id: 'cn-clusters-concentration', title: '集中度（示例）' },
      relatedKeys: ['correlation'],
    },
    correlation: {
      key: 'correlation',
      title: '相关性',
      description: '拥挤交易的核心变量。',
      apiPath: '/api/cn/clusters/correlation.json',
      chart: { id: 'cn-clusters-correlation', title: '相关性（示例）' },
      relatedKeys: ['concentration', 'predecessors'],
    },
    predecessors: {
      key: 'predecessors',
      title: '历史祖谱',
      description: '每一轮抱团都有前身。',
      apiPath: '/api/cn/clusters/predecessors.json',
      chart: { id: 'cn-clusters-predecessors', title: '抱团祖谱（示例）' },
      relatedKeys: ['liquor-club', 'ning-combo'],
    },
  },
  related: [
    { href: '/cn/broad', title: '宽基（Broad）', description: '把“母曲线”与回撤节奏先看清。' },
    { href: '/cn/sectors', title: '行业（Sectors）', description: '抱团往往发生在行业轮动的拐点。' },
  ],
};

