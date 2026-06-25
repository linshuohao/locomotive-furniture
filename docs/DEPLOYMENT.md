# 项目运行 & 构建 & 部署说明书

## 1. 环境依赖

- **Node.js** 22（与 CI 一致；lockfile 需 npm 10+）
- **包管理器**：npm / pnpm / yarn 任选

## 2. 本地开发

```bash
pnpm install    # 或 npm install
pnpm dev        # 启动 http://localhost:3000
```

开发环境特性：

- 热更新（Nuxt HMR）
- 控制台输出滚动 FPS（Web Vitals 埋点 debug 模式）
- `.env.development` 自动加载

## 3. 代码质量

```bash
pnpm lint       # ESLint + Prettier 检查
pnpm lint:fix   # 自动修复
pnpm typecheck  # nuxt typecheck
pnpm test       # Vitest 单元测试
pnpm test:coverage
```

## 4. 生产构建

```bash
pnpm build              # Nuxt SSR 构建 → .output/
pnpm preview            # 预览站点（默认端口 3000）
pnpm generate           # 可选：静态预渲染
```

文档（独立站点）：

```bash
npm run docs:dev        # 本地文档开发
npm run docs:build      # → docs/.vitepress/dist
npm run docs:preview    # 预览文档站
```

构建优化：

- 代码分包（vendor / scroll，见 `nuxt.config.ts` vite.rollupOptions）
- TS 类型剔除（`nuxt typecheck`）
- 页面级代码分割（Nuxt 自动）

## 5. 在线地址

站点元数据统一维护在仓库根目录 [`sites.json`](../sites.json)：

| 站点 | 生产地址                                     | Vercel 项目                 |
| ---- | -------------------------------------------- | --------------------------- |
| 主站 | https://locomotive-furniture.vercel.app      | `locomotive-furniture`      |
| 文档 | https://locomotive-furniture-docs.vercel.app | `locomotive-furniture-docs` |

## 6. Vercel 部署

站点与文档为**两个独立 Vercel 项目**，共用同一 GitHub 仓库；主站 Header 不展示文档入口。

| 项目 | 配置文件           | 构建命令               | 框架     |
| ---- | ------------------ | ---------------------- | -------- |
| 主站 | `vercel.json`      | `npm run vercel-build` | `nuxtjs` |
| 文档 | `vercel.docs.json` | `npm run vercel-build` | 静态     |

`scripts/vercel-build.mjs` 根据环境变量 `VERCEL_PROJECT_NAME` 分流：

- 项目名含 `docs` → `npm run docs:build`，产物复制到 `dist/`
- 否则 → `npm run build`（Nuxt SSR，Vercel 自动识别 `.output/`）

### Git 自动部署（推荐）

仓库：`github.com/linshuohao/locomotive-furniture`

| 分支事件      | 主站                | 文档                |
| ------------- | ------------------- | ------------------- |
| 推送到 `main` | Production 自动部署 | Production 自动部署 |
| Pull Request  | Preview 部署        | Preview 部署        |

**首次配置文档项目 Git 关联**（主站已关联）：

```bash
vercel link --yes --project locomotive-furniture-docs
vercel git connect https://github.com/linshuohao/locomotive-furniture.git
vercel link --yes --project locomotive-furniture   # 恢复主站本地关联
```

推送前本地门禁：`npm run check:changed`（pre-push hook 已启用；全量校验可手动 `npm run check`）。

### 手动 CLI 部署

```bash
npm run deploy           # 主站 Production
npm run deploy:docs      # 文档 Production
npm run deploy:all       # 主站 + 文档
npm run deploy:preview   # 主站 Preview
```

### 环境变量（Production）

**主站**：

```bash
NUXT_PUBLIC_SITE_URL=https://locomotive-furniture.vercel.app
NUXT_PUBLIC_COMMERCE_PROVIDER=mock
NUXT_PUBLIC_ENABLE_ANALYTICS=true
```

**文档**（导航栏「返回站点」链接）：

```bash
VITE_SITE_URL=https://locomotive-furniture.vercel.app
```

---

## 7. 其他平台部署

主站为 Nuxt SSR，推荐 Node 运行时或支持 Nuxt 的平台（Vercel、Netlify、Nitro preset）。文档站为纯静态资源：

| 平台    | 主站                                         | 文档站                       |
| ------- | -------------------------------------------- | ---------------------------- |
| Vercel  | `framework: nuxtjs`（推荐）                  | 静态 `dist/`                 |
| Netlify | Nitro `netlify` preset                       | `_redirects` 或 netlify.toml |
| Node    | `node .output/server/index.mjs`              | —                            |
| OSS/CDN | 需 SSR 运行时；或使用 `nuxt generate` 静态化 | 上传 `docs/.vitepress/dist`  |

## 8. 环境切换

| 文件               | 用途                 |
| ------------------ | -------------------- |
| `.env.development` | 本地开发             |
| `.env.test`        | 测试环境（关闭视差） |
| `.env.production`  | 生产环境             |

关键变量（`NUXT_PUBLIC_` 前缀）：

- `NUXT_PUBLIC_ENABLE_SMOOTH_SCROLL` — 平滑滚动开关
- `NUXT_PUBLIC_ENABLE_PARALLAX` — 视差开关
- `NUXT_PUBLIC_ENABLE_ANALYTICS` — 埋点开关
- `NUXT_PUBLIC_COMMERCE_PROVIDER` — 商品数据源（`mock` | `http`）
- `NUXT_PUBLIC_API_BASE_URL` — REST API 根地址（http 模式必填）
- `NUXT_PUBLIC_PAYMENT_PROVIDER` — 支付集成预留（`none` | `stripe` | `shopify`）
- `NUXT_PUBLIC_SITE_URL` — 站点根 URL（SEO、sitemap）

详见项目根目录 `.env.example` 与 `nuxt.config.ts` → `runtimeConfig.public`。

## 9. CI/CD 与代码门禁

### 本地 Git Hooks（Husky）

`npm install` 后自动启用：

| Hook       | 检查                                                             |
| ---------- | ---------------------------------------------------------------- |
| pre-commit | lint-staged（ESLint + Prettier，仅暂存文件）                     |
| commit-msg | commitlint（Conventional Commits）                               |
| pre-push   | `npm run check:changed`（增量；配置/依赖变更时自动全量 `check`） |

提交规范与完整说明见 [docs/CONTRIBUTING.md](./CONTRIBUTING.md)。

### GitHub Actions

配置见 `.github/workflows/ci.yml`（Node.js 22）：

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run build:e2e`
6. `npx playwright install --with-deps chromium`
7. `npx playwright test`

CI 负责代码质量门禁；生产部署由 Vercel Git 集成触发。

## 10. E2E 测试（Playwright）

项目使用 Playwright 覆盖浏览器内电商主流程，与 Vitest 单元测试分层：

| 目录         | 工具       | 范围                          |
| ------------ | ---------- | ----------------------------- |
| `src/tests/` | Vitest     | store、commerce、storage 逻辑 |
| `e2e/`       | Playwright | 加购 → 购物车 → 结算 → 成功页 |

### 本地运行

```bash
npm run e2e:install   # 首次克隆后安装 Chromium
npm run e2e           # build:e2e + playwright test
npm run e2e:ui        # UI 模式调试
```

`build:e2e` 会关闭平滑滚动/视差，并强制 `NUXT_PUBLIC_COMMERCE_PROVIDER=mock`，避免生产 `.env.production` 的 http provider 导致超时。Playwright 通过 `nuxt preview --port 3000` 启动预览服务。

### CI

GitHub Actions `build` job 在单元测试后执行 `build:e2e` → `playwright install --with-deps chromium` → `playwright test`。E2E 失败会阻断 PR 合并。

配置见根目录 [`playwright.config.ts`](../playwright.config.ts)。

## 11. 线上动画动态开关

通过环境变量注入 `NUXT_PUBLIC_ENABLE_SMOOTH_SCROLL=false` 可在不重新开发的情况下关闭平滑滚动。
