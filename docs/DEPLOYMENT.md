# 项目运行 & 构建 & 部署说明书

## 1. 环境依赖

- **Node.js** ≥ 18.16
- **包管理器**：npm / pnpm / yarn 任选

## 2. 本地开发

```bash
cd locomotive-furniture
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
pnpm build              # 仅站点 → dist/
pnpm run build:vercel   # 站点 + VitePress 文档 → dist/ + dist/docs/
pnpm preview            # 预览站点（不含 /docs，见下方）
```

文档本地开发：

```bash
npm run docs:dev        # http://localhost:5173/docs/
npm run docs:build      # 构建到 docs/.vitepress/dist
npm run docs:preview    # 预览文档站
```

预览**合并产物**（站点 + 文档同域）：

```bash
npm run build:vercel
npx serve dist          # 根路径 = 站点，/docs/ = 文档
```

构建优化：
- 代码分包（vendor / scroll）
- TS 类型剔除
- 路由懒加载

## 5. Vercel 部署（推荐）

项目已包含 `vercel.json`，**单项目**同时托管站点与文档：

| 路径 | 内容 |
|------|------|
| `/` | Vue SPA（Atelier 站点） |
| `/docs/` | VitePress 文档站 |

### 方式 A：Vercel Dashboard

1. 将仓库导入 [vercel.com](https://vercel.com)
2. **Root Directory** 设为 `2/locomotive-furniture`（若 monorepo）或仓库根目录
3. 构建命令 / 输出目录已由 `vercel.json` 指定，无需修改
4. 在 **Environment Variables** 中配置（Production）：

```bash
VITE_SITE_URL=https://your-project.vercel.app
VITE_COMMERCE_PROVIDER=mock
VITE_ENABLE_ANALYTICS=true
```

5. Deploy

### 方式 B：Vercel CLI

```bash
npm i -g vercel
cd locomotive-furniture
vercel login
vercel          # 首次预览部署
vercel --prod   # 生产部署
```

### 本地验证合并构建

```bash
npm run build:vercel
npx serve dist
# 站点 http://localhost:3000/
# 文档 http://localhost:3000/docs/
```

---

## 6. 其他平台部署

`dist/` 为纯静态资源，亦支持：

| 平台 | 方式 |
|------|------|
| Nginx | root 指向 dist，history fallback |
| Netlify | `_redirects` 或 netlify.toml |
| OSS/CDN | 上传 dist 全量（含 docs/ 子目录） |

### Nginx 示例

```nginx
server {
  listen 80;
  root /var/www/atelier/dist;
  index index.html;

  gzip on;
  gzip_types text/css application/javascript application/json;

  location /docs/ {
    try_files $uri $uri/ /docs/index.html;
  }

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

| 文件 | 用途 |
|------|------|
| `.env.development` | 本地开发 |
| `.env.test` | 测试环境（关闭视差） |
| `.env.production` | 生产环境 |

关键变量：
- `VITE_ENABLE_SMOOTH_SCROLL` — 平滑滚动开关
- `VITE_ENABLE_PARALLAX` — 视差开关
- `VITE_ENABLE_ANALYTICS` — 埋点开关
- `VITE_COMMERCE_PROVIDER` — 商品数据源（`mock` | `http`）
- `VITE_API_BASE_URL` — REST API 根地址（http 模式必填）
- `VITE_PAYMENT_PROVIDER` — 支付集成预留（`none` | `stripe` | `shopify`）

详见项目根目录 `.env.example` 文件。

## 8. CI/CD

GitHub Actions 配置见 `.github/workflows/ci.yml`：

1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

## 9. E2E 测试（可选扩展）

```bash
npm install -D cypress
npx cypress open
```

建议覆盖：加购 → 购物车 → 结算完整流程。

## 10. 线上动画动态开关

通过环境变量或后台配置注入 `VITE_ENABLE_SMOOTH_SCROLL=false` 可在不重新开发的情况下关闭平滑滚动。
