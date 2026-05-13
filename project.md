# A股编年史 · The Chronicle of China A-Shares

## 1. 项目目标

构建一个可发布、可引用、可索引的 A 股历史数据与编年史网站，参考 historyofmarket.com 的结构方法，但内容完全切换到中国 A 股市场。

网站不是单纯的“行情页”或“量化面板”，而是一份编辑式金融年鉴：

- 用宽基指数记录市场的长期形状
- 用行业指数记录轮动与风格迁移
- 用抱团叙事记录不同阶段的共识资产如何形成、扩张和退潮

## 2. 产品定位

一句话定位：
一份关于中国 A 股市场的长周期编年体档案。

核心关键词：
A股、编年史、历史数据、估值、回撤、行业轮动、抱团叙事、静态页、可引用、可索引。

## 3. 核心参考

结构参考网站：
<https://historyofmarket.com>

需要学习的不是视觉复刻，而是以下方法：

1. 首页作为总览页
2. 主 Tab 作为大专题
3. 每张核心图有独立静态页
4. 每个页面可被搜索引擎索引
5. 每张图有对应 JSON 数据接口
6. 页面具备 metadata / canonical / OG / JSON-LD

## 4. 网站信息架构

### 顶层结构

- /
- /broad/
- /sectors/
- /clusters/
- /methodology/
- /api/
- /about/

### 三个主 Tab

#### A. broad（宽基）

记录 A 股整体市场结构和时代分幕：

- 上证综指
- 深证成指
- 沪深300
- 创业板指
- 科创50
- 中证500
- 年度回报
- 回撤名册
- 六时代
- 估值锚点
- 风格比值
- 季节性

#### B. sectors（行业）

记录七个重点行业：

- 白酒
- 医药
- 新能源
- 半导体
- 银行
- 地产
- AI（用计算机 / AI 代理线）

#### C. clusters（抱团叙事）

记录四代抱团：

- 茅指数代理组合
- 宁组合代理组合
- 中特估代理组合
- AI算力代理组合
- 集中度
- 相关性
- 祖谱/谱系
- 切换时点
- 回撤与修复速度

## 5. 页面要求

### 首页

首页必须有：

- 超大主标题
- 总导语
- 三大 Tab 入口
- 精选图入口
- 方法说明
- 最新更新时间
- API 说明入口

### 专题页

每个主 Tab 首页必须有：

- 导语
- 内容卡片导航
- 章节结构（§ I / § II / § III ...）
- 若干核心图表
- 跳转到独立静态页

### 静态页

每张核心图必须有独立页面，包含：

- title
- description
- canonical
- og tags
- json-ld
- 更新时间
- 数据口径说明
- API 数据链接
- 继续阅读导航

## 6. 数据输出要求

所有图表底层数据统一输出到：
/public/api/

需要有：

- /api/\_manifest.json
- /api/profile.json
- /api/broad/\*.json
- /api/sectors/\*.json
- /api/clusters/\*.json

所有 JSON 命名需稳定、可预测。

## 7. 技术栈要求

- Astro
- TypeScript
- ECharts
- Node.js 脚本生成 JSON
- 静态构建输出
- 可部署到 Cloudflare Pages / Vercel / Netlify

## 8. 视觉要求

风格参考 historyofmarket.com 的编辑式金融专题：

- 温暖纸张底色
- 深墨色文字
- 细线分隔
- 超大标题
- 大留白
- 编辑式章节号
- 不做互联网资讯站风格
- 不做交易软件 UI 风格

A股语境可使用：

- 暗红表示上涨
- 墨绿表示下跌
  但整体仍需克制。

## 9. 开发优先级

### Phase 1

完成项目脚手架、全站路由、公共布局、设计系统、示例页面

### Phase 2

完成宽基 Tab 及其静态页与 API

### Phase 3

完成行业 Tab 及其静态页与 API

### Phase 4

完成抱团叙事 Tab 及其静态页与 API

### Phase 5

完成 SEO、JSON-LD、OG、sitemap、about、methodology、api index

## 10. 验收标准

网站必须满足：

1. 有完整首页
2. 有 broad / sectors / clusters 三大 Tab
3. 至少 30+ 图表
4. 每个核心图可独立访问
5. 每个图有对应 API JSON
6. 所有页面可静态构建
7. 样式统一，不是 demo 拼凑感
8. 页面文案不是占位符，必须具有编辑式叙事语气

