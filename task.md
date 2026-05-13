# Tasks

## Task 1: 初始化工程
- 用 Astro + TypeScript 初始化项目
- 配置全局样式
- 建立 layouts / components / pages / scripts / public/api 目录
- 完成 BaseLayout、HeadMeta、PageHero、SectionBlock 组件
- 完成首页基础布局
- 输出一个可运行的初始版本

## Task 2: 建立设计系统
- 定义颜色变量、字体层级、边框、阴影、留白规则
- 模仿编辑式金融专题风格
- 实现 tabs、cards、section number、chart box、meta footer 等样式

## Task 3: 宽基模块
- 先接入现有 MVP 数据结构
- 构建 broad 首页
- 构建以下页面：
  - shanghai-composite
  - shenzhen-component
  - hs300
  - chinext
  - star50
  - csi500
  - annual
  - drawdown
  - eras
  - valuation
  - style-ratios
  - seasonality
- 每页至少包含导语 + 主图 + 数据口径 + 继续阅读

## Task 4: 行业模块
- 构建 sectors 首页
- 构建七个行业独立页：
  - baijiu
  - pharma
  - new-energy
  - semi
  - banks
  - property
  - ai
- 增加 rotation / sector-valuation 页面

## Task 5: 抱团叙事模块
- 构建 clusters 首页
- 构建以下页面：
  - liquor-club
  - ning-combo
  - special-valuation
  - ai-compute
  - concentration
  - correlation
  - predecessors

## Task 6: 数据脚本
- 用 Node/TypeScript 编写脚本生成 public/api 下的数据文件
- 输出 _manifest.json 和 profile.json
- 保证命名稳定

## Task 7: SEO 与发布
- 生成 sitemap
- 配置 robots
- 每页输出 JSON-LD
- 优化静态构建结果
- 确保可部署
