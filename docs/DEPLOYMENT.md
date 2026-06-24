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
pnpm build      # 输出 dist/
pnpm preview    # 本地预览生产包
```

构建优化：
- 代码分包（vendor / scroll）
- TS 类型剔除
- 路由懒加载

## 5. 部署

`dist/` 为纯静态资源，支持：

| 平台 | 方式 |
|------|------|
| Nginx | root 指向 dist，history fallback |
| Vercel | 零配置 SPA |
| Netlify | `_redirects` 或 netlify.toml |
| OSS/CDN | 上传 dist 全量 |

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

## 6. 环境切换

| 文件 | 用途 |
|------|------|
| `.env.development` | 本地开发 |
| `.env.test` | 测试环境（关闭视差） |
| `.env.production` | 生产环境 |

关键变量：
- `VITE_ENABLE_SMOOTH_SCROLL` — 平滑滚动开关
- `VITE_ENABLE_PARALLAX` — 视差开关
- `VITE_ENABLE_ANALYTICS` — 埋点开关

## 7. CI/CD

GitHub Actions 配置见 `.github/workflows/ci.yml`：

1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

## 8. E2E 测试（可选扩展）

```bash
npm install -D cypress
npx cypress open
```

建议覆盖：加购 → 购物车 → 结算完整流程。

## 9. 线上动画动态开关

通过环境变量或后台配置注入 `VITE_ENABLE_SMOOTH_SCROLL=false` 可在不重新开发的情况下关闭平滑滚动。
