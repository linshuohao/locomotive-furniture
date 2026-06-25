# 项目运行 & 构建 & 部署说明书

## 1. 环境依赖

- **Node.js** ≥ 18.16
- **包管理器**：npm / pnpm / yarn 任选

## 2. 本地开发

```bash
pnpm install    # 或 npm install
pnpm dev        # 启动 http://localhost:5173
```

开发环境特性：

- 热更新
- 控制台输出滚动 FPS（Web Vitals 埋点 debug 模式）
- `.env.development` 自动加载

## 3. 代码质量

```bash
pnpm lint       # ESLint + Prettier 检查
pnpm lint:fix   # 自动修复
pnpm test       # Vitest 单元测试
pnpm test:coverage
```

## 4. 生产构建

```bash
pnpm build              # 站点 → dist/
pnpm preview            # 预览站点
```

文档（独立站点）：

```bash
npm run docs:dev        # 本地文档开发
npm run docs:build      # → docs/.vitepress/dist
npm run docs:preview    # 预览文档站
```

构建优化：

- 代码分包（vendor / scroll）
- TS 类型剔除
- 路由懒加载

## 5. 在线地址

站点元数据统一维护在仓库根目录 [`sites.json`](../sites.json)：

| 站点 | 生产地址                                     | Vercel 项目                 |
| ---- | -------------------------------------------- | --------------------------- |
| 主站 | https://locomotive-furniture.vercel.app      | `locomotive-furniture`      |
| 文档 | https://locomotive-furniture-docs.vercel.app | `locomotive-furniture-docs` |

## 6. Vercel 部署

站点与文档为**两个独立 Vercel 项目**，共用同一 GitHub 仓库；主站 Header 不展示文档入口。

| 项目 | 配置文件           | 构建命令               | 输出目录 |
| ---- | ------------------ | ---------------------- | -------- |
| 主站 | `vercel.json`      | `npm run vercel-build` | `dist`   |
| 文档 | `vercel.docs.json` | `npm run vercel-build` | `dist`   |

`scripts/vercel-build.mjs` 根据环境变量 `VERCEL_PROJECT_NAME` 分流：

- 项目名含 `docs` → `npm run docs:build`，产物复制到 `dist/`
- 否则 → `npm run build`（主站）

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

推送前本地门禁：`npm run check`（pre-push hook 已启用）。

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
VITE_SITE_URL=https://locomotive-furniture.vercel.app
VITE_COMMERCE_PROVIDER=mock
VITE_ENABLE_ANALYTICS=true
```

**文档**（导航栏「返回站点」链接）：

```bash
VITE_SITE_URL=https://locomotive-furniture.vercel.app
```

---

## 7. 其他平台部署

`dist/` 为纯静态资源，亦支持：

| 平台    | 方式                                       |
| ------- | ------------------------------------------ |
| Nginx   | root 指向 dist，history fallback           |
| Netlify | `_redirects` 或 netlify.toml               |
| OSS/CDN | 分别上传 `dist/` 与 `docs/.vitepress/dist` |

### Nginx 示例

```nginx
server {
  listen 80;
  root /var/www/atelier/dist;
  index index.html;

  gzip on;
  gzip_types text/css application/javascript application/json;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|webp|svg|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
}
```

## 8. 环境切换

| 文件               | 用途                 |
| ------------------ | -------------------- |
| `.env.development` | 本地开发             |
| `.env.test`        | 测试环境（关闭视差） |
| `.env.production`  | 生产环境             |

关键变量：

- `VITE_ENABLE_SMOOTH_SCROLL` — 平滑滚动开关
- `VITE_ENABLE_PARALLAX` — 视差开关
- `VITE_ENABLE_ANALYTICS` — 埋点开关
- `VITE_COMMERCE_PROVIDER` — 商品数据源（`mock` | `http`）
- `VITE_API_BASE_URL` — REST API 根地址（http 模式必填）
- `VITE_PAYMENT_PROVIDER` — 支付集成预留（`none` | `stripe` | `shopify`）

详见项目根目录 `.env.example` 文件。

## 9. CI/CD 与代码门禁

### 本地 Git Hooks（Husky）

`npm install` 后自动启用：

| Hook       | 检查                                         |
| ---------- | -------------------------------------------- |
| pre-commit | lint-staged（ESLint + Prettier，仅暂存文件） |
| commit-msg | commitlint（Conventional Commits）           |
| pre-push   | `npm run check`（lint + typecheck + test）   |

提交规范与完整说明见 [docs/CONTRIBUTING.md](./CONTRIBUTING.md)。

### GitHub Actions

配置见 `.github/workflows/ci.yml`：

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

`build:e2e` 会关闭平滑滚动/视差，并强制 `VITE_COMMERCE_PROVIDER=mock`，避免生产 `.env.production` 的 http provider 导致超时。

### CI

GitHub Actions `build` job 在单元测试后执行 `build:e2e` → `playwright install --with-deps chromium` → `playwright test`。E2E 失败会阻断 PR 合并。

配置见根目录 [`playwright.config.ts`](../playwright.config.ts)。

## 11. 线上动画动态开关

通过环境变量或后台配置注入 `VITE_ENABLE_SMOOTH_SCROLL=false` 可在不重新开发的情况下关闭平滑滚动。
