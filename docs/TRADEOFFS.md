# 全项目取舍权衡清单

## 维度一：视觉动效 vs 性能

| 选项                          | 选择        | 理由                                                                                            |
| ----------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| 全站 Locomotive 视差          | ✅ 是       | 所有路由 init 滚动实例 + ScrollReveal                                                           |
| 首页/About 叙事视差           | ✅ 是       | 品牌差异化核心                                                                                  |
| GSAP 复杂时间轴               | ✅ 是       | Hero 入场 + 遮罩行 + scrub 叙事 + 卡片 scale 交错；不用 ScrollTrigger pin（与 Locomotive 冲突） |
| 逐行遮罩 / Marquee / 循环文案 | ✅ 是       | 对标 Locomotive.ca 文字动效；Marquee 纯 CSS，reduced-motion 降级                                |
| ScrollReveal clip/scale 变体  | ✅ 是       | CSS transition 揭示，无额外 GSAP 开销                                                           |
| GSAP ticker 驱动 Lenis RAF    | ✅ 是       | 官方推荐，与 ScrollTrigger 帧同步                                                               |
| WebGL Hero 蒙层               | ✅ 条件启用 | 高端设备增强；`capabilities.webgl` 门控                                                         |
| 商品列表 IO 入场              | ✅ 是       | GSAP `createScaleFadeReveal` 交错；分类切换时重建动画                                           |
| 原生滚动降级                  | ✅ 是       | `prefers-reduced-motion` + 低端设备                                                             |

**量化约束**：LCP < 2.5s、CLS < 0.1、motion jank < 5% 帧 > 32ms

---

## 维度二：滚动体验 vs 工程复杂度

| 选项                                   | 选择  | 理由                                                     |
| -------------------------------------- | ----- | -------------------------------------------------------- |
| Locomotive v5                          | ✅ 是 | 对标 Locomotive.ca，声明式 `data-scroll-*`               |
| 纯 Lenis 自封装                        | ❌ 否 | 丢失 IO/视差封装，与参考站偏离                           |
| ScrollReveal 组件                      | ✅ 是 | DRY 滚动属性 + clip/scale 变体 + 图片 load 后 `resize()` |
| MaskReveal / MarqueeBand / CyclingText | ✅ 是 | Locomotive 风格专用动效组件                              |
| 路由 meta `scrollEffects`              | ✅ 是 | 全路由 init 滚动实例；checkout 等页动效较轻              |
| 路由切换 destroy/re-init               | ✅ 是 | 避免内存泄漏                                             |

---

## 维度三：电商业务 vs 品牌体验

| 选项                | 选择    | 理由                                                |
| ------------------- | ------- | --------------------------------------------------- |
| 10 SKU + Zod 校验   | ✅ 是   | 运行时数据完整性                                    |
| 客户端 commerce API | ✅ 是   | `data/providers` mock/http + timeout/cache/fallback |
| localStorage 购物车 | ✅ 是   | MVP 闭环；key `atelier-cart-v1`                     |
| 真实支付            | ❌ 否   | Demo checkout + 转化漏斗埋点                        |
| Checkout 独立成功页 | ✅ 是   | `/checkout/success?orderId=`                        |
| SPA SEO             | ⚠️ 部分 | 构建时 `sitemap.xml` + `robots.txt`                 |

**转化优先级**：PDP 加购 ≤ 2 次点击；Cart → Checkout → Success ≤ 3 步

---

## 维度四：可观测性 vs 包体积

| 选项                  | 选择   | 理由                                 |
| --------------------- | ------ | ------------------------------------ |
| `web-vitals` 全量指标 | ✅ 是  | LCP/INP/CLS/FCP/TTFB                 |
| Typed analytics 漏斗  | ✅ 是  | product_view → purchase              |
| motion:jank 事件      | ✅ 是  | GSAP ticker 帧差检测                 |
| 真实 analytics 上报   | ⏸ 预留 | `VITE_ENABLE_ANALYTICS` + fetch stub |

---

## 维度五：框架选型（Vue SPA）

| 选项                  | 选择  | 理由                                     |
| --------------------- | ----- | ---------------------------------------- |
| Vue 3 + Vite SPA      | ✅ 是 | 轻量、Locomotive 集成成熟                |
| Next.js SSR           | ❌ 否 | 作业范围 Vue 栈；SEO 用静态 sitemap 补偿 |
| Pinia                 | ✅ 是 | 购物车持久化                             |
| Vitest + CI typecheck | ✅ 是 | lint → typecheck → test → build          |

---

## 浏览器兼容策略

| 浏览器      | 支持 | 备注                    |
| ----------- | ---- | ----------------------- |
| Chrome 90+  | ✅   | 主开发目标              |
| Safari 15+  | ✅   | sticky + lenis 需实测   |
| Firefox 90+ | ✅   |                         |
| IE11        | ❌   | 不支持                  |
| 移动端      | ✅   | parallax/WebGL 自动降级 |

---

## 决策总结

**核心原则**：首页/About 叙事动效最大化；交易链路简洁；Data/Provider 分层可接真实 API；文档与 CI 保证可复现。

详见 [ARCHITECTURE.md](./ARCHITECTURE.md) 模块划分。
