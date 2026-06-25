# 项目技术架构与取舍权衡

## 1. 五层架构

```
┌─────────────────────────────────────────┐
│  Pages (Nuxt 文件路由)                   │
│  pages/index · products · cart · …      │
├─────────────────────────────────────────┤
│  Layouts (根布局)                        │
│  layouts/default.vue                    │
├─────────────────────────────────────────┤
│  Components (layout / ui / product / scroll) │
├─────────────────────────────────────────┤
│  Lib + Composables (滚动 / 动效 / i18n / SEO) │
│  lib/scroll · lib/motion · lib/analytics│
│  composables/useLocomotiveScroll        │
├─────────────────────────────────────────┤
│  Data (catalog + Zod + API) + store/    │
└─────────────────────────────────────────┘
```

Pages → Components → Composables/Lib → Data/Store。禁止下层引用上层。

## 2. 技术栈选型

| 类别     | 选型                              | 理由                             |
| -------- | --------------------------------- | -------------------------------- |
| 框架     | Vue 3 + Nuxt 3 + TS（SSR）        | SEO、文件路由、运行时配置        |
| 国际化   | `@nuxtjs/i18n`                    | en / zh，`prefix_except_default` |
| 样式     | TailwindCSS 4                     | 设计 Token 集中管理              |
| 滚动     | Locomotive Scroll v5 + Lenis      | 对标参考站                       |
| 动画     | GSAP ScrollTrigger + ticker       | 与 Lenis 帧同步                  |
| 数据     | Zod + 静态 catalog                | 运行时校验                       |
| Commerce | `data/api.ts` + `data/providers/` | mock/http 可切换，Zod 校验       |
| 状态     | Pinia + localStorage              | 购物车持久化                     |
| 可观测   | web-vitals + typed analytics      | 全链路指标                       |
| 测试     | Vitest + CI typecheck             | 质量门禁                         |

## 3. Trade-off 清单

完整决策矩阵见 [TRADEOFFS.md](./TRADEOFFS.md)。

### 3.1 动效 vs 性能

- Locomotive + GSAP ticker（非双 RAF）
- 全站 Locomotive init；首页/About 叙事视差最重
- Locomotive 风格增强：逐行遮罩（`MaskReveal`）、Marquee 文字带、Hero 循环文案、clip/scale 揭示
- GSAP 工厂集中于 `lib/scroll/animation.ts`，页面通过 `useGsapTimeline` 挂载
- `motionCapabilities`：`full | reduced | static`
- WebGL Hero 仅 `tier.full`；Marquee 在 `prefers-reduced-motion` 下静止

### 3.2 业务 vs 视觉

- 商品列表：async fetch + Skeleton + InView 入场
- PDP：ProductViewTracker 漏斗
- Checkout → `/checkout/success`

### 3.3 工程 vs 成本

- `prebuild` 生成 sitemap/robots
- CI：lint → typecheck → test → build → e2e
- Nuxt SSR 首屏 HTML + `usePageSeo` / `useSeoMeta`

## 4. 核心模块

| 模块            | 路径                                                    |
| --------------- | ------------------------------------------------------- |
| 应用配置        | `nuxt.config.ts`                                        |
| 根布局          | `src/layouts/default.vue`                               |
| Locomotive 封装 | `src/composables/useLocomotiveScroll.ts`                |
| GSAP 时间轴     | `src/lib/scroll/animation.ts`                           |
| GSAP 生命周期   | `src/composables/useGsapTimeline.ts`                    |
| 滚动常量        | `src/lib/scroll/scrollConstants.ts`                     |
| Motion 能力分级 | `src/lib/motion/motionCapabilities.ts`                  |
| 国际化          | `src/composables/useLocale.ts` + `src/i18n/locales/`    |
| 页面 SEO        | `src/composables/usePageSeo.ts`                         |
| 商品 API        | `src/data/api.ts`（facade）                             |
| Provider 切换   | `src/data/providers/` + `NUXT_PUBLIC_COMMERCE_PROVIDER` |
| 领域类型        | `src/data/schemas.ts`（Zod 单一来源）                   |
| 基础设施类型    | `src/types/`（滚动、性能 tier）                         |
| Analytics       | `src/lib/analytics/analytics.ts`                        |
| Web Vitals      | `src/lib/analytics/webVitals.ts`                        |
| Nuxt 插件       | `src/plugins/*.client.ts`（cart、analytics）            |

## 5. 扩展路径

- 新增页面：`src/pages/<route>.vue`（文件路由自动注册）
- 新增 SPU：`src/data/products.ts` + 更新 `scripts/generate-seo.mjs` slugs
- 接真实 Catalog：设 `NUXT_PUBLIC_COMMERCE_PROVIDER=http` + `NUXT_PUBLIC_API_BASE_URL`，实现 REST 三端点（见 README）
- 接 Shopify：新增 `data/providers/shopify.ts` 并在 `providers/index.ts` 注册
- 生产 analytics：实现 `fetch('/api/analytics')` in `analytics.ts`
