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

## 5. Vercel 部署（推荐）

站点与文档为**两个独立 Vercel 项目**，互不干扰；主站 Header 不展示文档入口。

| 项目 | 配置文件           | 构建命令             | 输出目录               |
| ---- | ------------------ | -------------------- | ---------------------- |
| 主站 | `vercel.json`      | `npm run build`      | `dist`                 |
| 文档 | `vercel.docs.json` | `npm run docs:build` | `docs/.vitepress/dist` |

### 主站项目

1. 导入本仓库（使用仓库根目录）
2. 使用默认 `vercel.json`
3. 环境变量（Production）：

```bash
VITE_SITE_URL=https://your-app.vercel.app
VITE_COMMERCE_PROVIDER=mock
VITE_ENABLE_ANALYTICS=true
```

```bash
vercel --prod
```

### 文档项目

1. **同一仓库**再新建一个 Vercel Project（同样使用仓库根目录）
2. **Project Settings → General → Build & Development Settings**：
   - 或在 CLI 使用：`vercel --local-config vercel.docs.json`
3. 环境变量（Production）— 用于导航栏「返回站点」链接：

```bash
VITE_SITE_URL=https://your-app.vercel.app
```

```bash
vercel --local-config vercel.docs.json --prod
```

文档站独立域名示例：`https://atelier-docs.vercel.app/`

---

## 6. 其他平台部署

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

## 7. 环境切换

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

## 8. CI/CD 与代码门禁

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
5. `npm run build`

## 9. E2E 测试（可选扩展）

```bash
npm install -D cypress
npx cypress open
```

建议覆盖：加购 → 购物车 → 结算完整流程。

## 10. 线上动画动态开关

通过环境变量或后台配置注入 `VITE_ENABLE_SMOOTH_SCROLL=false` 可在不重新开发的情况下关闭平滑滚动。
