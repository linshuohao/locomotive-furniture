# Atelier Furniture — Locomotive Scroll 跨境家具独立站

> 10 SPU 极简高端家具独立站，复刻 Locomotive.ca 滚动视觉体系

## 在线地址

| 站点     | 地址                                         | Vercel 项目                 |
| -------- | -------------------------------------------- | --------------------------- |
| **主站** | https://locomotive-furniture.vercel.app      | `locomotive-furniture`      |
| **文档** | https://locomotive-furniture-docs.vercel.app | `locomotive-furniture-docs` |

站点元数据见 [`sites.json`](sites.json)。推送到 `main` 后，主站 Vercel 项目会自动部署；文档项目需完成一次 Git 关联（见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)）。

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 功能概览

- **滚动体验**：Locomotive Scroll v5 + GSAP ScrollTrigger 帧同步、ScrollReveal、Hero 进度条、WebGL 蒙层（高端设备）
- **电商闭环**：10 SKU → 规格选择 → 加购 → 购物车 → 结算 → 成功页（Demo）
- **Commerce 层**：`data/providers` 可切换 mock/http + Zod 校验 + 离线 fallback
- **可观测性**：web-vitals 全量指标、typed 转化漏斗、motion jank 追踪
- **工程标准**：Vue 3 + TS + Pinia + Vitest + CI（lint / typecheck / test / build）
- **性能降级**：motion capabilities 分级 + 设备 tier 自动关闭视差/WebGL

## 页面

| 路由                | 页面             | 滚动动效                            |
| ------------------- | ---------------- | ----------------------------------- |
| `/`                 | 首页（长页叙事） | ✅ Locomotive                       |
| `/products`         | 商品列表         | ✅ Hero GSAP + ScrollReveal         |
| `/products/:slug`   | 商品详情         | ✅ PDP copy timeline + ScrollReveal |
| `/cart`             | 购物车           | ✅ ScrollReveal                     |
| `/checkout`         | 结算             | ✅ ScrollReveal                     |
| `/checkout/success` | 订单确认         | ✅ Success burst timeline           |
| `/about`            | 关于我们         | ✅ Locomotive                       |

## 脚本

```bash
npm run dev          # 开发站点
npm run docs:dev     # 开发文档（独立 VitePress 站点）
npm run build        # 构建主站
npm run docs:build   # 构建文档站
npm run preview      # 预览主站
npm run typecheck    # TypeScript 检查
npm run lint         # 代码检查
npm run test         # 单元测试
npm run check        # 推送前门禁（lint + typecheck + test）
npm run deploy       # 手动部署主站（Production）
npm run deploy:docs  # 手动部署文档站（Production）
npm run deploy:all   # 主站 + 文档一并部署
npm run deploy:preview  # 主站 Preview 部署
```

本地 Git hooks（Husky）：提交时 lint-staged + commitlint，推送前 `check`。详见 [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)。

## 部署（Vercel）

主站与文档为**两个独立 Vercel 项目**，已关联 GitHub 仓库，推送到 `main` 自动部署。

| 项目 | 配置               | 构建                                   | 输出    |
| ---- | ------------------ | -------------------------------------- | ------- |
| 主站 | `vercel.json`      | `npm run vercel-build`                 | `dist/` |
| 文档 | `vercel.docs.json` | `npm run vercel-build`（按项目名分流） | `dist/` |

`scripts/vercel-build.mjs` 根据 `VERCEL_PROJECT_NAME` 自动选择主站或文档构建。

```bash
npm run deploy           # 主站 → Production
npm run deploy:docs      # 文档 → Production
npm run deploy:all       # 主站 + 文档
npm run deploy:preview   # 主站 Preview
```

- **主站**：https://locomotive-furniture.vercel.app
- **文档**：https://locomotive-furniture-docs.vercel.app

详见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 文档

| 文档                                         | 说明                   |
| -------------------------------------------- | ---------------------- |
| [docs/RESEARCH.md](docs/RESEARCH.md)         | Locomotive.ca 调研分析 |
| [docs/TRADEOFFS.md](docs/TRADEOFFS.md)       | 全项目取舍权衡清单     |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架构与模块划分         |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)     | 运行/构建/部署         |
| [docs/COMPONENTS.md](docs/COMPONENTS.md)     | 组件库使用             |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md)   | 性能监控手册           |
| [docs/DELIVERY.md](docs/DELIVERY.md)         | 交付清单与验收         |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | 代码门禁与提交规范     |

## 目录结构

```
src/
├── App.vue                 # 根组件
├── main.ts                 # 应用入口
├── router/                 # 路由
├── assets/                 # 静态资源与全局样式
├── components/
│   ├── layout/             # 布局（AppHeader）
│   ├── ui/                 # 通用 UI（Button、Skeleton、LazyImage）
│   ├── product/            # 商品相关（ProductCard、CartItem）
│   └── scroll/             # 滚动动效（ScrollReveal、WebGL）
├── composables/            # Vue 组合式函数（scroll、GSAP、motion）
├── lib/
│   ├── scroll/             # GSAP 时间轴、Lenis 常量
│   ├── motion/             # 性能分级、motion capabilities
│   ├── analytics/          # 埋点与 Web Vitals
│   └── storage.ts          # localStorage 封装
├── data/                   # 商品目录 + Zod + 客户端 API
│   ├── schemas.ts          # 领域类型（Zod 单一来源）
│   ├── client.ts           # fetch / cache / timeout
│   ├── config.ts           # 环境变量契约
│   └── providers/          # mock | http 可切换
├── store/                  # Pinia 状态（购物车）
├── types/                  # 共享 TypeScript 类型
├── views/                  # 页面（按业务域分子目录）
│   ├── home/
│   ├── catalog/
│   ├── cart/
│   ├── checkout/
│   └── about/
└── tests/                  # 单元测试
scripts/
└── generate-seo.mjs        # sitemap + robots
```

## 环境变量

完整示例见 [`.env.example`](.env.example)。

```bash
# 动效
VITE_ENABLE_SMOOTH_SCROLL=true
VITE_ENABLE_PARALLAX=true
VITE_ENABLE_ANALYTICS=false

# 商品数据源 — mock（本地 catalog）| http（真实 API）
VITE_COMMERCE_PROVIDER=mock
VITE_API_BASE_URL=                    # http 模式必填，如 https://api.example.com

# 支付（Phase 2 预留）
VITE_PAYMENT_PROVIDER=none            # none | stripe | shopify

VITE_SITE_URL=http://localhost:5173
```

切换真实 Catalog：设 `VITE_COMMERCE_PROVIDER=http` 并配置 `VITE_API_BASE_URL`。API 约定：

| 方法 | 路径              | 响应                  |
| ---- | ----------------- | --------------------- |
| GET  | `/products`       | `Product[]`           |
| GET  | `/products/:slug` | `Product`             |
| POST | `/checkout`       | `{ orderId: string }` |

请求失败时自动 fallback 到本地 `products.ts` 目录。

## 技术栈

Vue 3 · Vite · TypeScript · TailwindCSS 4 · Locomotive Scroll v5 · Lenis · GSAP · Zod · web-vitals · Pinia · Vitest

## License

MIT
