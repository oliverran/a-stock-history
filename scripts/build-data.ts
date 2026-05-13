import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_API_DIR = path.resolve(__dirname, '../public/api');

const dirs = [
  PUBLIC_API_DIR,
  path.join(PUBLIC_API_DIR, 'broad'),
  path.join(PUBLIC_API_DIR, 'sectors'),
  path.join(PUBLIC_API_DIR, 'clusters'),
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ==========================================
// 1. Manifest
// ==========================================
const manifest = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  endpoints: {
    broad: '/api/broad/',
    sectors: '/api/sectors/',
    clusters: '/api/clusters/'
  }
};
fs.writeFileSync(path.join(PUBLIC_API_DIR, '_manifest.json'), JSON.stringify(manifest, null, 2));

// ==========================================
// 2. Mock Data Generators
// ==========================================

function generateTimeSeries(points: number, startVal: number, volatility: number = 0.02, startDateStr: string = '2000-01-01') {
  const data = [];
  let current = startVal;
  const startDate = new Date(startDateStr);
  
  for (let i = 0; i < points; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    // skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    
    current = current * (1 + (Math.random() - 0.49) * volatility);
    data.push({
      date: d.toISOString().split('T')[0],
      value: Number(current.toFixed(2))
    });
  }
  return data;
}

function generateDrawdown(points: number, startDateStr: string = '2000-01-01') {
  const ts = generateTimeSeries(points, 1000, 0.03, startDateStr);
  let peak = ts[0].value;
  return ts.map(item => {
    if (item.value > peak) peak = item.value;
    const dd = (item.value - peak) / peak;
    return {
      date: item.date,
      value: Number((dd * 100).toFixed(2)) // percentage
    };
  });
}

function generateAnnualReturns(startYear: number, endYear: number) {
  const data = [];
  for (let y = startYear; y <= endYear; y++) {
    const ret = (Math.random() - 0.4) * 60; // -24% to 36%
    data.push({
      date: y.toString(),
      value: Number(ret.toFixed(2))
    });
  }
  return data;
}

function generateValuationBands(points: number, startDateStr: string = '2010-01-01') {
  const ts = generateTimeSeries(points, 15, 0.01, startDateStr); // Base PE
  return ts.map(item => {
    return {
      date: item.date,
      value: item.value,
      mean: 15,
      plus1: 18,
      minus1: 12
    };
  });
}

function generateHeatmapData() {
  const data = [];
  const years = Array.from({length: 15}, (_, i) => 2010 + i);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  years.forEach((y, yIdx) => {
    months.forEach((m, mIdx) => {
      const val = (Math.random() - 0.45) * 10;
      // [x, y, value] for echarts heatmap
      data.push([mIdx, yIdx, Number(val.toFixed(2))]);
    });
  });
  return { data, years, months };
}

function generateMultiSeries(points: number, seriesDefs: Array<{name: string, startVal: number, vol: number}>, startDateStr: string = '2015-01-01') {
  const dates = [];
  const seriesData: Record<string, number[]> = {};
  
  // init
  seriesDefs.forEach(def => { seriesData[def.name] = []; });
  
  let currents = seriesDefs.map(d => d.startVal);
  const startDate = new Date(startDateStr);
  
  for (let i = 0; i < points; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    
    dates.push(d.toISOString().split('T')[0]);
    
    seriesDefs.forEach((def, idx) => {
      currents[idx] = currents[idx] * (1 + (Math.random() - 0.49) * def.vol);
      seriesData[def.name].push(Number(currents[idx].toFixed(2)));
    });
  }
  
  return { dates, seriesData };
}

// ==========================================
// 3. Generate Broad Datasets
// ==========================================

const broadDatasets = [
  {
    id: 'shanghai-composite',
    name: '上证综指',
    type: 'line',
    desc: '上海证券交易所综合股价指数',
    series: generateTimeSeries(5000, 1000, 0.02, '1990-12-19')
  },
  {
    id: 'shenzhen-component',
    name: '深证成指',
    type: 'line',
    desc: '深圳证券交易所成份股价指数',
    series: generateTimeSeries(5000, 1000, 0.022, '1991-04-03')
  },
  {
    id: 'hs300',
    name: '沪深 300',
    type: 'line',
    desc: '沪深300指数',
    series: generateTimeSeries(4000, 1000, 0.018, '2005-04-08')
  },
  {
    id: 'chinext',
    name: '创业板指',
    type: 'line',
    desc: '创业板指数',
    series: generateTimeSeries(3000, 1000, 0.03, '2010-06-01')
  },
  {
    id: 'star50',
    name: '科创 50',
    type: 'line',
    desc: '科创50指数',
    series: generateTimeSeries(1000, 1000, 0.035, '2020-01-01')
  },
  {
    id: 'csi500',
    name: '中证 500',
    type: 'line',
    desc: '中证500指数',
    series: generateTimeSeries(4000, 1000, 0.025, '2005-01-01')
  },
  {
    id: 'annual',
    name: '沪深300年度回报',
    type: 'bar',
    desc: '沪深300历年收益率 (%)',
    series: generateAnnualReturns(2005, 2023)
  },
  {
    id: 'drawdown',
    name: '沪深300历史回撤',
    type: 'drawdown',
    desc: '沪深300自高点回撤幅度 (%)',
    series: generateDrawdown(4000, '2005-04-08')
  },
  {
    id: 'eras',
    name: '六时代走势',
    type: 'line-mark',
    desc: '上证综指各时代划分',
    series: generateTimeSeries(5000, 1000, 0.02, '1990-12-19')
    // mark areas will be handled in frontend
  },
  {
    id: 'valuation',
    name: '沪深300 PE(TTM) 走势',
    type: 'valuation',
    desc: '估值与均值回归带',
    series: generateValuationBands(3000, '2010-01-01')
  },
  {
    id: 'style-ratios',
    name: '大盘/小盘 风格比值',
    type: 'line',
    desc: '沪深300 / 中证1000 相对走势',
    series: generateTimeSeries(3000, 1, 0.01, '2010-01-01')
  },
  {
    id: 'seasonality',
    name: 'A股月度胜率季节性',
    type: 'heatmap',
    desc: '沪深300历年月度涨跌幅 (%)',
    series: generateHeatmapData()
  }
];

broadDatasets.forEach(ds => {
  const payload = {
    meta: {
      id: ds.id,
      name: ds.name,
      type: ds.type,
      description: ds.desc
    },
    series: ds.series
  };
  fs.writeFileSync(
    path.join(PUBLIC_API_DIR, 'broad', `${ds.id}.json`),
    JSON.stringify(payload, null, 2)
  );
});

console.log('✅ All broad API data generated successfully.');

// ==========================================
// 4. Generate Sectors Datasets
// ==========================================

const sectorsDatasets = [
  {
    id: 'baijiu',
    name: '中证白酒',
    type: 'line',
    desc: '中证白酒指数相对沪深300的超额收益走势',
    series: generateTimeSeries(3000, 1000, 0.03, '2014-01-01')
  },
  {
    id: 'pharma',
    name: '中证医药',
    type: 'line',
    desc: '中证医药指数历史走势',
    series: generateTimeSeries(4000, 1000, 0.025, '2005-01-01')
  },
  {
    id: 'new-energy',
    name: '新能源车指数',
    type: 'line',
    desc: '新能源车产业链指数走势',
    series: generateTimeSeries(2500, 1000, 0.04, '2015-01-01')
  },
  {
    id: 'semi',
    name: '中华半导体',
    type: 'line',
    desc: '中华半导体芯片指数走势',
    series: generateTimeSeries(2500, 1000, 0.045, '2015-01-01')
  },
  {
    id: 'banks',
    name: '中证银行',
    type: 'line',
    desc: '中证银行指数走势',
    series: generateTimeSeries(4000, 1000, 0.015, '2005-01-01')
  },
  {
    id: 'property',
    name: '国证地产',
    type: 'line',
    desc: '国证房地产指数走势',
    series: generateTimeSeries(4000, 1000, 0.03, '2005-01-01')
  },
  {
    id: 'ai',
    name: '人工智能指数',
    type: 'line',
    desc: '中证人工智能产业指数走势',
    series: generateTimeSeries(2000, 1000, 0.04, '2016-01-01')
  },
  {
    id: 'rotation',
    name: '行业轮动总图',
    type: 'multi-line',
    desc: '各大核心行业指数相对走势对比',
    series: generateMultiSeries(2000, [
      { name: '白酒', startVal: 100, vol: 0.02 },
      { name: '医药', startVal: 100, vol: 0.02 },
      { name: '新能源', startVal: 100, vol: 0.03 },
      { name: '半导体', startVal: 100, vol: 0.03 },
      { name: '银行', startVal: 100, vol: 0.01 },
    ], '2016-01-01')
  },
  {
    id: 'sector-valuation',
    name: '行业估值对比',
    type: 'bar', // 也可以用特定的散点图/分位数图，这里用 bar 简化
    desc: '各大行业当前 PE 所处历史分位数 (%)',
    series: [
      { date: '白酒', value: 35 },
      { date: '医药', value: 12 },
      { date: '新能源', value: 5 },
      { date: '半导体', value: 65 },
      { date: '银行', value: 15 },
      { date: '地产', value: 8 },
      { date: '人工智能', value: 85 }
    ]
  }
];

sectorsDatasets.forEach(ds => {
  const payload = {
    meta: {
      id: ds.id,
      name: ds.name,
      type: ds.type,
      description: ds.desc
    },
    series: ds.series
  };
  fs.writeFileSync(
    path.join(PUBLIC_API_DIR, 'sectors', `${ds.id}.json`),
    JSON.stringify(payload, null, 2)
  );
});

console.log('✅ All sectors API data generated successfully.');

// ==========================================
// 6. Generate Advanced Datasets (History of Market Style)
// ==========================================

// 6.1 收益率分布 (Distribution)
function generateDistribution() {
  // 模拟沪深300自2005年以来的年度收益率分布桶
  const bins = ['<-30%', '-30~-20%', '-20~-10%', '-10~0%', '0~10%', '10~20%', '20~30%', '30~40%', '40~50%', '>50%'];
  const counts = [1, 2, 4, 3, 3, 2, 1, 1, 1, 1]; // 随机模拟频数
  return { bins, counts };
}

// 6.2 戴维斯双击拆解 (Earnings vs Multiple)
function generateDavisDecomposition() {
  const data = [];
  for (let y = 2010; y <= 2023; y++) {
    const totalReturn = (Math.random() - 0.4) * 50; // -20% to +30%
    const epsGrowth = (Math.random() - 0.2) * 20;   // -4% to +16%
    const peExpansion = totalReturn - epsGrowth;
    data.push({
      year: y.toString(),
      total: Number(totalReturn.toFixed(2)),
      eps: Number(epsGrowth.toFixed(2)),
      pe: Number(peExpansion.toFixed(2))
    });
  }
  return data;
}

// 6.3 年内最大回撤 vs 最终回报 (Intrayear Turbulence)
function generateIntrayearTurbulence() {
  const data = [];
  for (let y = 2010; y <= 2023; y++) {
    const finalReturn = (Math.random() - 0.4) * 40;
    // 最大回撤必定为负，且往往比最终收益更低
    const maxDrawdown = -Math.abs((Math.random() * 20) + (finalReturn < 0 ? Math.abs(finalReturn) : 0));
    data.push({
      year: y.toString(),
      final: Number(finalReturn.toFixed(2)),
      intrayear: Number(maxDrawdown.toFixed(2))
    });
  }
  return data;
}

// 6.4 资本回报率锚点 (ROE)
function generateROE() {
  const data = [];
  let currentROE = 12.0;
  for (let y = 2010; y <= 2023; y++) {
    currentROE = currentROE + (Math.random() - 0.5) * 2;
    data.push({
      year: y.toString(),
      value: Number(currentROE.toFixed(2))
    });
  }
  return data;
}

// 6.5 宽基的行业权重演变 (Sector Structure Evolution)
function generateSectorEvolution() {
  const years = Array.from({length: 14}, (_, i) => (2010 + i).toString());
  const sectors = ['金融地产', '消费医药', '信息科技', '工业制造', '原材料', '其他'];
  
  const seriesData: Record<string, number[]> = {};
  sectors.forEach(s => { seriesData[s] = []; });
  
  // 模拟权重变化趋势
  years.forEach((y, idx) => {
    // 假设金融地产权重逐年下降，信息科技逐年上升
    const ratio = idx / years.length;
    let weights = [
      40 - (ratio * 20) + Math.random() * 2, // 金融地产下降
      20 + (ratio * 5) + Math.random() * 2,  // 消费医药略升
      10 + (ratio * 15) + Math.random() * 2, // 科技上升
      15 + Math.random() * 2,
      10 + Math.random() * 2,
      5 + Math.random() * 1
    ];
    // 归一化为100%
    const sum = weights.reduce((a, b) => a + b, 0);
    weights = weights.map(w => Number((w / sum * 100).toFixed(2)));
    
    sectors.forEach((s, sIdx) => {
      seriesData[s].push(weights[sIdx]);
    });
  });
  
  return { years, seriesData };
}

// 6.6 波动率与恐慌指数 (Volatility)
function generateVolatility() {
  const ts = generateTimeSeries(3000, 15, 0.05, '2010-01-01'); // Base Volatility around 15%
  return ts.map(item => ({
    date: item.date,
    value: Math.max(5, item.value) // vol cannot be negative
  }));
}

const advancedDatasets = [
  {
    id: 'distribution',
    name: '沪深300收益率分布',
    type: 'distribution-bar',
    desc: '历年收益率分桶统计，打破平均年化幻觉',
    series: generateDistribution()
  },
  {
    id: 'davis-decomposition',
    name: '戴维斯双击/双杀拆解',
    type: 'stacked-bar-dual',
    desc: '年度涨跌幅 = 盈利贡献 + 估值贡献',
    series: generateDavisDecomposition()
  },
  {
    id: 'intrayear-turbulence',
    name: '年内最大回撤 vs 最终回报',
    type: 'range-bar',
    desc: '即使是牛市年份，也要忍受剧烈的年内洗盘',
    series: generateIntrayearTurbulence()
  },
  {
    id: 'roe-anchor',
    name: '沪深300 ROE (净资产收益率)',
    type: 'bar',
    desc: '指数长期复合回报率的物理重力锚',
    series: generateROE()
  },
  {
    id: 'sector-evolution',
    name: '沪深300行业权重变迁',
    type: 'stacked-area',
    desc: '一部 A 股产业结构的微观进化史',
    series: generateSectorEvolution()
  },
  {
    id: 'volatility',
    name: '市场波动率 (中国版VIX代理)',
    type: 'line',
    desc: '当数值飙升，代表市场正在为极度恐慌定价',
    series: generateVolatility()
  }
];

advancedDatasets.forEach(ds => {
  const payload = {
    meta: {
      id: ds.id,
      name: ds.name,
      type: ds.type,
      description: ds.desc
    },
    series: ds.series
  };
  fs.writeFileSync(
    path.join(PUBLIC_API_DIR, 'broad', `${ds.id}.json`), // 归入 broad 目录下
    JSON.stringify(payload, null, 2)
  );
});

console.log('✅ All advanced API data generated successfully.');
// ==========================================

const clustersDatasets = [
  {
    id: 'liquor-club',
    name: '茅指数超额收益',
    type: 'line',
    desc: '茅指数（核心资产代理）相对沪深300走势',
    series: generateTimeSeries(3000, 1000, 0.02, '2016-01-01')
  },
  {
    id: 'ning-combo',
    name: '宁组合超额收益',
    type: 'line',
    desc: '宁组合（高景气赛道代理）相对沪深300走势',
    series: generateTimeSeries(2000, 1000, 0.03, '2019-01-01')
  },
  {
    id: 'special-valuation',
    name: '中特估超额收益',
    type: 'line',
    desc: '中国特色估值体系代理组合相对沪深300走势',
    series: generateTimeSeries(1000, 1000, 0.015, '2022-01-01')
  },
  {
    id: 'ai-compute',
    name: 'AI算力超额收益',
    type: 'line',
    desc: 'AI算力与大模型代理组合相对沪深300走势',
    series: generateTimeSeries(500, 1000, 0.04, '2023-01-01')
  },
  {
    id: 'concentration',
    name: '市场交易集中度',
    type: 'line',
    desc: '前5%个股成交额占全市场总成交额的比例 (%)',
    series: generateTimeSeries(4000, 30, 0.01, '2010-01-01')
  },
  {
    id: 'correlation',
    name: '行业内个股相关性',
    type: 'line', // 简化处理为时序折线，代表抱团瓦解期的万物齐涨齐跌
    desc: '沪深300成分股平均两两相关系数',
    series: generateTimeSeries(4000, 0.5, 0.02, '2010-01-01')
  },
  {
    id: 'predecessors',
    name: '古早抱团史',
    type: 'multi-line',
    desc: '五朵金花与煤飞色舞时代的行业走势对比',
    series: generateMultiSeries(1500, [
      { name: '金融', startVal: 100, vol: 0.02 },
      { name: '地产', startVal: 100, vol: 0.03 },
      { name: '煤炭', startVal: 100, vol: 0.04 },
      { name: '有色', startVal: 100, vol: 0.04 }
    ], '2003-01-01')
  }
];

clustersDatasets.forEach(ds => {
  const payload = {
    meta: {
      id: ds.id,
      name: ds.name,
      type: ds.type,
      description: ds.desc
    },
    series: ds.series
  };
  fs.writeFileSync(
    path.join(PUBLIC_API_DIR, 'clusters', `${ds.id}.json`),
    JSON.stringify(payload, null, 2)
  );
});

console.log('✅ All clusters API data generated successfully.');
