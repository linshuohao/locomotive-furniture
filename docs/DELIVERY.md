# Demo 产物与范围

## 1. 可运行工程

| 路径       | 说明                                                      |
| ---------- | --------------------------------------------------------- |
| 项目根目录 | Vue3 + Nuxt 3 + TS 完整前端 Demo（SSR）                   |
| `src/`     | 源码（pages / layouts / lib / components / data / store） |
| `.output/` | 生产构建产物（`npm run build` 后生成）                    |

## 2. 文档清单

| 文档         | 路径                   | 内容                                 |
| ------------ | ---------------------- | ------------------------------------ |
| 站点调研分析 | `docs/RESEARCH.md`     | Locomotive.ca 原理、优劣势、复刻风险 |
| 取舍权衡清单 | `docs/TRADEOFFS.md`    | 动效/性能/电商/可观测性决策矩阵      |
| 架构与模块   | `docs/ARCHITECTURE.md` | 分层设计、Provider 扩展路径          |
| 运行部署手册 | `docs/DEPLOYMENT.md`   | 启动、构建、Vercel、环境变量         |
| 组件库文档   | `docs/COMPONENTS.md`   | 组件 API、data-scroll 配置           |
| 性能监控手册 | `docs/PERFORMANCE.md`  | Web Vitals、降级策略、调优           |
| 项目 README  | `README.md`            | 快速开始、目录结构、API 约定         |
| 环境变量示例 | `.env.example`         | Commerce / 动效 / 埋点开关           |

## 3. 工程配置

| 文件                                         | 说明                                            |
| -------------------------------------------- | ----------------------------------------------- |
| `nuxt.config.ts`                             | Nuxt 应用配置（SSR、i18n、runtimeConfig）       |
| `.env.development` / `.test` / `.production` | 多环境变量                                      |
| `.env.example`                               | 环境变量模板（含 Commerce Provider）            |
| `eslint.config.js`                           | ESLint 规则                                     |
| `.prettierrc`                                | 代码格式化                                      |
| `commitlint.config.js`                       | Git 提交规范（Conventional Commits）            |
| `.husky/`                                    | Git hooks（pre-commit / commit-msg / pre-push） |
| `.editorconfig`                              | 编辑器统一格式                                  |
| `.github/workflows/ci.yml`                   | CI 流水线                                       |
| `.github/pull_request_template.md`           | PR 模板                                         |
| `docs/CONTRIBUTING.md`                       | 贡献指南与门禁说明                              |
| `vitest.config.ts`                           | 单元测试配置                                    |

## 4. 核心模块

| 模块                | 路径                                     |
| ------------------- | ---------------------------------------- |
| 根布局 + scroll     | `src/layouts/default.vue`                |
| Locomotive 滚动封装 | `src/composables/useLocomotiveScroll.ts` |
| 性能分级降级        | `src/lib/motion/performance.ts`          |
| Web Vitals 埋点     | `src/lib/analytics/webVitals.ts`         |
| 购物车状态          | `src/store/cart.ts`                      |
| 商品 API facade     | `src/data/api.ts`                        |
| Commerce Provider   | `src/data/providers/`（mock / http）     |
| 领域类型（Zod）     | `src/data/schemas.ts`                    |
| 10 SPU 静态目录     | `src/data/products.ts`                   |
| 国际化              | `@nuxtjs/i18n` + `src/i18n/locales/`     |

## 5. 在线部署

| 站点 | 生产地址                                     | 配置               |
| ---- | -------------------------------------------- | ------------------ |
| 主站 | https://locomotive-furniture.vercel.app      | `vercel.json`      |
| 文档 | https://locomotive-furniture-docs.vercel.app | `vercel.docs.json` |

元数据：[`sites.json`](../sites.json)。Git 推送到 `main` 触发 Vercel 自动部署。

## 6. 本地验证

```bash
pnpm install
pnpm dev      # 本地开发（http://localhost:3000）
pnpm build    # 生产构建
pnpm test     # 单元测试
pnpm lint     # 代码规范
```

## 7. 性能指标（构建实测）

| 指标                         | 目标     | 实测                  |
| ---------------------------- | -------- | --------------------- |
| 生产 JS gzip（scroll chunk） | —        | ~8.6 KB               |
| 生产 JS gzip（vendor chunk） | —        | ~39.9 KB              |
| 总 gzip 体积                 | < 600 KB | ~65 KB（核心 bundle） |

## 8. Demo 范围外

以下能力有意不在本 Demo 内实现，可作为后续扩展方向：

- 真实支付网关对接
- 后端库存 API
- 多币种（i18n en/zh 已实现；币种见 ARCHITECTURE.md 扩展路径）
