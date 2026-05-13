# Architecture

## 1. 推荐目录结构
src/
  components/
    charts/
      LineChart.astro
      AnnualBarChart.astro
      DrawdownChart.astro
      HeatmapChart.astro
      EraBarChart.astro
    layout/
      BaseLayout.astro
      PageHero.astro
      SectionBlock.astro
      CardGrid.astro
      MetaFooter.astro
    seo/
      HeadMeta.astro
      JsonLd.astro
  data/
    content/
      site.ts
      tabs.ts
      pages.ts
  pages/
    index.astro
    broad/
      index.astro
      shanghai-composite.astro
      shenzhen-component.astro
      hs300.astro
      chinext.astro
      star50.astro
      csi500.astro
      annual.astro
      drawdown.astro
      eras.astro
      valuation.astro
      style-ratios.astro
      seasonality.astro
    sectors/
      index.astro
      baijiu.astro
      pharma.astro
      new-energy.astro
      semi.astro
      banks.astro
      property.astro
      ai.astro
      rotation.astro
      sector-valuation.astro
    clusters/
      index.astro
      liquor-club.astro
      ning-combo.astro
      special-valuation.astro
      ai-compute.astro
      concentration.astro
      correlation.astro
      predecessors.astro
  styles/
    global.css
scripts/
  build-data.ts
  build-broad.ts
  build-sectors.ts
  build-clusters.ts
public/
  api/
    _manifest.json
    profile.json
    broad/
    sectors/
    clusters/

## 2. 页面生成原则
- Astro 页面负责结构与 SEO
- ECharts 负责客户端图表渲染
- JSON 数据全部来自 public/api
- 页面文本由 src/data/content/pages.ts 集中管理
- 不允许把大段文案硬编码在多个页面里重复维护

## 3. 组件原则
必须先抽出可复用组件：
- 全站 Layout
- 顶部导航
- Hero 区
- 章节 Section
- 卡片网格
- 图表容器
- 页尾数据说明模块

## 4. SEO 原则
每个页面必须支持：
- title
- meta description
- canonical
- og:title
- og:description
- og:type
- json-ld

## 5. 数据原则
所有图表页面都通过 fetch('/api/...') 获取 JSON。
不要把数据内联到 astro 文件里，除了极少量首页配置数据。
