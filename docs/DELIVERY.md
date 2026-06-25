# Demo 产物与范围

| 字段     | 内容                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------ |
| 项目类型 | Vue 3 跨境家具独立站 Demo（Locomotive 视觉对标）                                                       |
| 在线地址 | [主站](https://locomotive-furniture.vercel.app) · [文档](https://locomotive-furniture-docs.vercel.app) |
| 关联文档 | [README](./README.md) · [ARCHITECTURE](./ARCHITECTURE.md) · [DEPLOYMENT](./DEPLOYMENT.md)              |

本页说明 **Demo 交付了什么、不交付什么**，以及本地验证方式。技术模块索引见 [ARCHITECTURE](./ARCHITECTURE.md)；完整文档列表见 [README](./README.md)。

---

## 1. 交付范围

| 能力                | 状态 | 说明                                    |
| ------------------- | ---- | --------------------------------------- |
| 10 SPU 电商闭环     | ✅   | 列表 → PDP → 购物车 → Checkout → 成功页 |
| Locomotive 滚动叙事 | ✅   | 首页 css-progress + Lenis 平滑          |
| 微交互点缀          | ✅   | 导航 shuffle、磁性 CTA、商品视差        |
| 双语 i18n           | ✅   | en / zh-CN                              |
| SSR + SEO           | ✅   | sitemap / robots / `usePageSeo`         |
| 可观测性            | ✅   | Web Vitals + transport + jankGuard      |
| 真实支付            | ❌   | Demo 漏斗埋点                           |
| 全站 hover shuffle  | ❌   | 仅导航 + 关键 CTA                       |

可选扩展（P4）：全站链接 shuffle、首页团队 3D（`/about` 已集成 `TeamScene3D`）。

---

## 2. 工程产物

| 路径            | 说明                                                                   |
| --------------- | ---------------------------------------------------------------------- |
| 项目根目录      | Vue 3 + Nuxt 4 + TS 完整前端 Demo（SSR）                               |
| `app/`          | pages / layouts / components / lib / data / store                      |
| `i18n/locales/` | `@nuxtjs/i18n` v10 翻译 JSON（`langDir: 'locales'` → `i18n/locales/`） |
| `.output/`      | 生产构建产物（`npm run build`）                                        |
| `docs/`         | VitePress 文档站（本站点）                                             |

---

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
| `vitest.config.ts`                           | 单元测试配置                                    |
| `playwright.config.ts`                       | E2E 测试配置                                    |

---

## 4. 在线部署

| 站点 | 生产地址                                     | 配置               |
| ---- | -------------------------------------------- | ------------------ |
| 主站 | https://locomotive-furniture.vercel.app      | `vercel.json`      |
| 文档 | https://locomotive-furniture-docs.vercel.app | `vercel.docs.json` |

元数据：[`sites.json`](../sites.json)。Git 推送到 `main` 触发 Vercel 自动部署。详见 [DEPLOYMENT](./DEPLOYMENT.md)。

---

## 5. 本地验证

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run test     # Vitest：cart / commerce / motion / jankGuard 等
npm run e2e      # Playwright：电商主流程 + locale + scroll init
npm run lint
npm run check:perf
```

动效与微交互验收清单见 [VISUAL-DESIGN §七](./VISUAL-DESIGN.md#七验收与调试)。

---

## 6. 性能指标

以 **`npm run build && npm run check:perf`** 输出为准（非文档手写快照）。预算阈值见 [PERFORMANCE §1](./PERFORMANCE.md#1-量化指标)：

| 指标              | 门禁     |
| ----------------- | -------- |
| scroll chunk gzip | < 200 KB |
| vendor chunk gzip | < 280 KB |

---

## 7. 范围外（后续扩展）

以下能力有意不在本 Demo 内实现：

- 真实支付网关对接
- 后端库存 API
- 多币种（i18n en/zh 已实现）

---

## 下一步阅读

- 了解原站机制与复刻策略 → [RESEARCH](./RESEARCH.md)
- 查看六层架构与模块索引 → [ARCHITECTURE](./ARCHITECTURE.md)
- 本地开发与部署 → [DEPLOYMENT](./DEPLOYMENT.md)
- 常见问题排错 → [FAQ](./FAQ.md)
