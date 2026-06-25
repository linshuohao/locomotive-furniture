# 常见问题（FAQ）

| 字段     | 内容                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------- |
| 适用范围 | 本地开发、动效、i18n、Commerce、CI 排错                                                             |
| 关联文档 | [DEPLOYMENT](./DEPLOYMENT.md) · [ARCHITECTURE](./ARCHITECTURE.md) · [PERFORMANCE](./PERFORMANCE.md) |
| 更新日期 | 2026-06-25                                                                                          |

本页汇总开发中最常遇到的问题与排查路径。环境变量完整列表见 [DEPLOYMENT §8](./DEPLOYMENT.md#8-环境切换)。

---

## 动效与滚动

### 平滑滚动 / 入场动画不生效？

按以下顺序排查：

1. **首屏直链** — 须见 `document.documentElement` 带 `scroll-ready`；若无，检查 `layouts/default.vue` 是否在 `onMounted` 调用了 scroll init
2. **系统偏好** — DevTools → Rendering → 勾选 `prefers-reduced-motion: reduce` 会强制 `static` tier，关闭后刷新
3. **环境变量** — 确认 `.env.development` 中 `NUXT_PUBLIC_ENABLE_SMOOTH_SCROLL=true`
4. **设备分级** — 低端 CPU（≤2 核）、弱网（2g）会降为 `reduced`，视差与 WebGL 关闭属预期行为
5. **运行时降级** — 控制台若有 `motion_jank` 事件，说明 `jankGuard` 已触发降级；整页刷新可恢复（若设备仍卡顿会再次降级）

详见 [PERFORMANCE §3 降级策略](./PERFORMANCE.md#3-降级策略)。

### 路由切换后滚动异常或「双 init」？

`layouts/default.vue` 在路由离开时须 `destroy()` Locomotive 实例；启用 page transition 时由 `onAfterEnter` 重新 init，**首屏**则在 `onMounted` 直接 init。若自定义布局：

- **不要**在 Page 层直接调用 `useLocomotiveScroll`
- 布局变更后调用 `useLayoutInvalidation()` 通知 resize

### 图片加载后布局跳动 / 滚动进度错位？

异步内容（懒加载图、商品网格）渲染后须通知 Motion Runtime：

```ts
const invalidateLayout = useLayoutInvalidation()
await invalidateLayout()
```

`LazyImage` 已内置此逻辑；自定义异步区块需手动调用。

---

## 国际化

### 中文页面 URL 是什么格式？

默认语言为英文，**无前缀**（如 `/products`）。中文使用 `prefix_except_default` 策略，路径前加 `/zh`：

| 英文        | 中文           |
| ----------- | -------------- |
| `/products` | `/zh/products` |
| `/cart`     | `/zh/cart`     |

页面内链接统一通过 `useLocale().localizedPath('/path')` 生成，**不要手写** `/zh` 前缀。

翻译文件物理路径：`i18n/locales/en.json`、`i18n/locales/zh-CN.json`。`nuxt.config.ts` 中配置为 `langDir: 'locales'`（`@nuxtjs/i18n` 自动解析到 `i18n/locales/`，勿写成 `i18n/locales` 以免路径重复）。

切换语言时 `switchLocale()` 会清空 commerce 内存缓存（`clearCache()`）。

---

## Commerce 与数据

### 如何切换 mock / 真实 API？

```bash
# mock（默认）— 读取 app/data/products.ts
NUXT_PUBLIC_COMMERCE_PROVIDER=mock

# http — 请求远程 REST API
NUXT_PUBLIC_COMMERCE_PROVIDER=http
NUXT_PUBLIC_API_BASE_URL=https://api.example.com
```

Page / Store **只**通过 `@/data/api.ts` 取数，不直接 import provider。数据流详见 [ARCHITECTURE §5](./ARCHITECTURE.md#5-commerce-数据层)。

### API 请求失败会怎样？

`CommerceResponse` 统一返回 `{ data, error, meta }`。http 模式超时或校验失败时，自动 fallback 到本地 `products.ts` 目录，并在 `error` 字段返回 i18n key，由页面层通过 `te()` + `t()` 或 `translateErrorKey()` 翻译。

常用 key（见 `app/data/errors.ts`）：`fallback.offlineCatalog`、`fallback.apiTimeout`、`fallback.apiError`、`fallback.productNotFound`、`checkout.errors.failed`。

### E2E 测试因 Commerce 超时失败？

`npm run e2e` 使用 `build:e2e`，会强制 `NUXT_PUBLIC_COMMERCE_PROVIDER=mock` 并关闭动效。若本地直接 `playwright test` 而未走 `build:e2e`，可能读到 `.env.production` 的 http 配置导致超时。

当前 E2E 用例（`e2e/`）：

| 文件                      | 覆盖                                       |
| ------------------------- | ------------------------------------------ |
| `checkout-flow.spec.ts`   | 加购 → 购物车 → 结算 → 成功页              |
| `checkout-guards.spec.ts` | 空购物车访问 checkout 重定向               |
| `locale-routing.spec.ts`  | `/zh` 前缀与目录标题翻译                   |
| `scroll-init.spec.ts`     | 首屏 `scroll-ready` 与 `--scroll-progress` |

---

## 构建与 CI

### `npm run check` 与 `check:changed` 区别？

| 命令            | 范围                                | 触发时机           |
| --------------- | ----------------------------------- | ------------------ |
| `check:changed` | 增量 lint + typecheck + 相关 Vitest | pre-push hook 默认 |
| `check`         | 全量 lint + typecheck + 全部测试    | 推送前手动、CI     |

配置或依赖变更时，`check:changed` 会自动回退为全量 `check`。

### 包体积数字与文档不一致？

以本地构建输出为准：

```bash
npm run build
npm run check:perf
```

`DELIVERY` 中的 gzip 数据仅为参考快照，非自动同步。

### 埋点不上报？

1. 确认 `NUXT_PUBLIC_ENABLE_ANALYTICS=true`
2. 开发环境仅 `console.debug('[analytics]', …)`，不 POST
3. 生产环境批量 POST `/api/analytics`（见 `server/api/analytics.post.ts`）

---

## 下一步阅读

- Commerce 数据层架构 → [ARCHITECTURE §5](./ARCHITECTURE.md#5-commerce-数据层)
- 环境变量与部署 → [DEPLOYMENT](./DEPLOYMENT.md)
- 动效验收操作 → [VISUAL-DESIGN §七](./VISUAL-DESIGN.md#七验收与调试)
