# Atelier Furniture — Locomotive Scroll 跨境家具独立站

> 精选系列极简高端家具独立站 Demo（10 SKU 数据层），复刻 Locomotive.ca 滚动视觉体系

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

访问 http://localhost:3000

## 功能概览

- **滚动体验**：Locomotive Scroll v5 + GSAP ScrollTrigger 帧同步；MaskReveal 逐行遮罩、MarqueeBand 文字带、CyclingText 循环文案、ScrollReveal clip/scale 变体；Hero 进度条、WebGL 蒙层（高端设备）
- **电商闭环**：10 SKU → 规格选择 → 加购 → 购物车 → 结算 → 成功页（Demo）
- **Commerce 层**：`data/providers` 可切换 mock/http + Zod 校验 + 离线 fallback
- **SSR + i18n**：Nuxt 3 服务端渲染；`@nuxtjs/i18n` 支持 en / zh（`prefix_except_default`）
- **可观测性**：web-vitals 全量指标、typed 转化漏斗、motion jank 追踪
- **工程标准**：Vue 3 + Nuxt 3 + TS + Pinia + Vitest + Playwright E2E + CI（lint / typecheck / test / build / e2e）
- **性能降级**：motion capabilities 分级 + 设备 tier 自动关闭视差/WebGL

## 页面

| 路由                | 页面             | 滚动动效                                      |
| ------------------- | ---------------- | --------------------------------------------- |
| `/`                 | 首页（长页叙事） | ✅ 遮罩行 + Marquee + scrub 叙事 + scale 交错 |
| `/products`         | 商品列表         | ✅ Hero GSAP + scale 交错网格                 |
| `/products/:slug`   | 商品详情         | ✅ PDP copy timeline + ScrollReveal           |
| `/cart`             | 购物车           | ✅ ScrollReveal                               |
| `/checkout`         | 结算             | ✅ form cascade timeline                      |
| `/checkout/success` | 订单确认         | ✅ Success burst timeline                     |
| `/about`            | 关于我们         | ✅ MaskReveal + Marquee + clip 图片           |

中文路由在路径前加 `/zh` 前缀（如 `/zh/products`）。链接统一通过 `useLocale().localizedPath()` 生成。

## 脚本

```bash
npm run dev          # 开发站点（Nuxt dev server）
npm run docs:dev     # 开发文档（独立 VitePress 站点）
npm run build        # 构建主站（Nuxt SSR）
npm run generate     # 静态预渲染（可选）
npm run docs:build   # 构建文档站
npm run preview      # 预览主站（nuxt preview）
npm run typecheck    # TypeScript 检查（nuxt typecheck）
npm run lint         # 代码检查
npm run test         # 单元测试
npm run e2e:install  # 安装 Playwright Chromium（首次）
npm run e2e          # E2E 测试（build:e2e + Playwright）
npm run e2e:ui       # Playwright UI 调试
npm run check:changed # 增量检查（pre-push hook 默认）
npm run check        # 全量 lint + typecheck + test（推送前可选）
npm run deploy       # 手动部署主站（Production）
npm run deploy:docs  # 手动部署文档站（Production）
npm run deploy:all   # 主站 + 文档一并部署
npm run deploy:preview  # 主站 Preview 部署
```

本地 Git hooks（Husky）：提交时 lint-staged + commitlint，推送前 `check:changed`（增量）。分支管理采用 **GitHub Flow**（`main` + 功能分支 + PR），详见 [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)。

## 部署（Vercel）

主站与文档为**两个独立 Vercel 项目**，已关联 GitHub 仓库，推送到 `main` 自动部署。

| 项目 | 配置               | 构建                                   | 框架     |
| ---- | ------------------ | -------------------------------------- | -------- |
| 主站 | `vercel.json`      | `npm run vercel-build`                 | `nuxtjs` |
| 文档 | `vercel.docs.json` | `npm run vercel-build`（按项目名分流） | 静态     |

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

| 文档                                         | 说明                            |
| -------------------------------------------- | ------------------------------- |
| [docs/RESEARCH.md](docs/RESEARCH.md)         | Locomotive.ca 调研分析          |
| [docs/TRADEOFFS.md](docs/TRADEOFFS.md)       | 全项目取舍权衡清单              |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架构与模块划分                  |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)     | 运行/构建/部署                  |
| [docs/COMPONENTS.md](docs/COMPONENTS.md)     | 组件库使用                      |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md)   | 性能监控手册                    |
| [docs/DELIVERY.md](docs/DELIVERY.md)         | Demo 范围与产物清单             |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | GitHub Flow、代码门禁与提交规范 |

## 目录结构

```
nuxt.config.ts              # Nuxt 应用配置
src/
├── pages/                  # 文件路由（Nuxt pages）
│   ├── index.vue
│   ├── about.vue
│   ├── cart.vue
│   ├── checkout/
│   └── products/
├── layouts/
│   └── default.vue         # 根布局（scroll 生命周期、页脚）
├── plugins/                # Nuxt 插件（*.client.ts）
├── i18n/locales/           # en.json / zh-CN.json
├── assets/styles/          # 全局样式（Tailwind）
├── components/
│   ├── layout/             # 布局（AppHeader）
│   ├── ui/                 # 通用 UI（Button、Skeleton、LazyImage）
│   ├── product/            # 商品相关（ProductCard、CartItem）
│   └── scroll/             # 滚动动效（ScrollReveal、MaskReveal、MarqueeBand、WebGL）
├── composables/            # Vue 组合式函数（scroll、GSAP、motion、locale、SEO）
├── lib/
│   ├── scroll/             # GSAP 时间轴、Lenis 常量
│   ├── motion/             # 性能分级、motion capabilities
│   ├── analytics/          # 埋点与 Web Vitals
│   ├── i18n/               # 语言常量
│   └── storage.ts          # localStorage 封装
├── data/                   # 商品目录 + Zod + 客户端 API
│   ├── schemas.ts          # 领域类型（Zod 单一来源）
│   ├── client.ts           # fetch / cache / timeout
│   ├── config.ts           # runtimeConfig 契约
│   └── providers/          # mock | http 可切换
├── store/                  # Pinia 状态（购物车）
├── types/                  # 共享 TypeScript 类型
└── tests/                  # 单元测试
scripts/
└── generate-seo.mjs        # sitemap + robots
```

## 环境变量

完整示例见 [`.env.example`](.env.example)。Nuxt 公开变量以 `NUXT_PUBLIC_` 为前缀，在 `nuxt.config.ts` → `runtimeConfig.public` 中声明。

```bash
# 动效
NUXT_PUBLIC_ENABLE_SMOOTH_SCROLL=true
NUXT_PUBLIC_ENABLE_PARALLAX=true
NUXT_PUBLIC_ENABLE_ANALYTICS=false

# 商品数据源 — mock（本地 catalog）| http（真实 API）
NUXT_PUBLIC_COMMERCE_PROVIDER=mock
NUXT_PUBLIC_API_BASE_URL=                    # http 模式必填，如 https://api.example.com

# 支付（Phase 2 预留）
NUXT_PUBLIC_PAYMENT_PROVIDER=none            # none | stripe | shopify

NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

切换真实 Catalog：设 `NUXT_PUBLIC_COMMERCE_PROVIDER=http` 并配置 `NUXT_PUBLIC_API_BASE_URL`。API 约定：

| 方法 | 路径              | 响应                  |
| ---- | ----------------- | --------------------- |
| GET  | `/products`       | `Product[]`           |
| GET  | `/products/:slug` | `Product`             |
| POST | `/checkout`       | `{ orderId: string }` |

请求失败时自动 fallback 到本地 `products.ts` 目录。

## 技术栈

Vue 3 · Nuxt 3 · TypeScript · TailwindCSS 4 · Locomotive Scroll v5 · Lenis · GSAP · Zod · web-vitals · Pinia · @nuxtjs/i18n · Vitest

## License

MIT
