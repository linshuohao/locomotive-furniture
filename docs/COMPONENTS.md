# 组件库参考

| 字段     | 内容                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------- |
| 适用范围 | 组件分层、API、composables、data-scroll 约定                                                        |
| 关联文档 | [ARCHITECTURE](./ARCHITECTURE.md) · [VISUAL-DESIGN](./VISUAL-DESIGN.md) · [RESEARCH](./RESEARCH.md) |
| 更新日期 | 2026-06-25                                                                                          |

> 微交互默认参数见 [VISUAL-DESIGN](./VISUAL-DESIGN.md)。动效选型见 [RESEARCH §3.3](./RESEARCH.md#33-动效选型决策树)。

本页是**开发时的组件速查手册**：分层职责、Props 约定、composables 门控与 data-scroll 优先级。

---

## 分层概览

| 目录       | 用途     | 代表组件                                                   |
| ---------- | -------- | ---------------------------------------------------------- |
| `home/`    | 首页区块 | `HomeHeroSection`, `HomeDynastyStrip`, `HomeFeaturedRail`  |
| `layout/`  | 布局     | `AppHeader`（含 `HoverShuffleText` 导航）                  |
| `ui/`      | 通用 UI  | `BaseButton`, `MagneticButton`, `LazyImage`, `ImageTilt3D` |
| `product/` | 商品域   | `ProductCard`, `ProductCardMedia`, `CartItem`              |
| `scroll/`  | 滚动动效 | `MotionSceneHost`, `ScrollReveal`, `HoverShuffleText`      |

动效分三层：

1. **Locomotive 声明式** — `ScrollReveal` / `ScrollSection` 的 `data-scroll-*`
2. **GSAP 声明式** — `MotionSceneHost` + `sceneRegistry`（页面级推荐）
3. **指针微交互** — `HoverShuffleText` / `useMagnetic` / `useMouseParallax`

---

## Motion Runtime（布局层）

`layouts/default.vue` 调用 `provideMotionRuntime()`，同时 provide：

- `motionRuntimeKey` — 完整 Motion 契约
- `scrollInjectionKey` — 向后兼容 `{ update, scrollTo }`

子组件布局变更后调用 `useLayoutInvalidation()`，**禁止**在 `components/ui` 直接 inject scroll。

```ts
import { useLayoutInvalidation } from '@/composables/useLayoutInvalidation'

const invalidateLayout = useLayoutInvalidation()
await invalidateLayout() // 图片 load、async 网格后
```

---

## MotionSceneHost

页面不再直接 `useGsapTimeline` + DOM ref，改为声明场景描述符：

```vue
<MotionSceneHost
  :scene="{
    id: 'products-hero-enter',
    trigger: 'mount',
    effect: 'hero-enter',
    targets: {
      eyebrow: '[data-hero-eyebrow]',
      title: '[data-hero-title]',
      subtitle: '[data-hero-subtitle]',
    },
  }"
  :when="!loading"
>
  <section>
    <p data-hero-eyebrow>...</p>
    <h1 data-hero-title>...</h1>
  </section>
</MotionSceneHost>
```

| Prop    | 类型                          | 说明                                            |
| ------- | ----------------------------- | ----------------------------------------------- |
| `scene` | `MotionSceneDescriptor`       | 见 `lib/motion/scene.ts`                        |
| `when`  | `boolean \| string \| number` | 覆盖 `scene.trigger`（如 `introComplete` gate） |

| `scene.trigger`  | 行为                                             |
| ---------------- | ------------------------------------------------ |
| `mount`          | root 挂载后激活                                  |
| `inview`         | IntersectionObserver 进入视口                    |
| `intro-complete` | 须配合 `:when`（如幕帘结束）                     |
| `scrub`          | root 挂载后激活，供 ScrollTrigger scrub 工厂使用 |

| effect            | 工厂                                             | 典型页面        |
| ----------------- | ------------------------------------------------ | --------------- |
| `hero-enter`      | `createHeroEnterTimeline`（含可选 `media` 目标） | 首页 Hero、列表 |
| `clip-image`      | `createClipImageReveal`                          | 理念区          |
| `scale-fade-grid` | `createScaleFadeReveal`                          | 商品列表        |
| `pdp-copy`        | `createPdpTimeline`                              | 商品详情        |
| `success-enter`   | `createSuccessTimeline`                          | 结账成功        |

能力不足时自动 `trackMotionSkipped` 并跳过动画。

---

## home（首页区块）

| 组件                    | 职责                                                                    |
| ----------------------- | ----------------------------------------------------------------------- |
| `HomeHeroSection`       | Hero + WebGL gate；`hero-enter` 经 `MotionSceneHost`（含 `media` 入场） |
| `HomeDynastyStrip`      | Dynasty 扫光 + `data-scroll-css-progress`                               |
| `HomeFeaturedRail`      | 精选网格（暗场）                                                        |
| `HomeFeaturedWorkItem`  | 单条精选 + `ImageTilt3D`                                                |
| `HomePhilosophySection` | 理念区 + `clip-image`                                                   |
| `HomeAgencySection`     | Agency 叙事 + `ShuffleLink`                                             |
| `HomeExtrasSection`     | 文章列表 + 商品 teaser                                                  |

`pages/index.vue` 仅负责数据 fetch 与区块组装。`MagneticButton` 用于 `/about` 底部 CTA。

---

## product

### ProductCard / ProductCardMedia 解耦

- **ProductCardMedia**：纯展示 + `useMouseParallax`；`emit('quick-add')`，不 import Pinia
- **ProductCard**：`useProductQuickAdd()` 处理加购；失败时展示 `cart.addFailed` 提示

```vue
<ProductCard :product="product" @quick-add="onQuickAdd" />
```

类型：`lib/product/contracts.ts` · 库存：`lib/product/stock.ts`

---

## scroll

| 组件                       | 用途                                                            |
| -------------------------- | --------------------------------------------------------------- |
| `ScrollReveal`             | InView + 可选 `cssProgress`；clip/scale 变体                    |
| `ScrollSection`            | Sticky 容器；优先 css-progress                                  |
| `MaskReveal`               | 逐行遮罩（`data-mask-line`）                                    |
| `PageIntroCurtain`         | 开场幕帘；`useGsapTimeline` + `createPageIntroCurtainTimeline`  |
| `MarqueeBand`              | 无限横向文字带（纯 CSS）                                        |
| `CharReveal` / `SplitText` | 逐字入场                                                        |
| `HoverShuffleText`         | hover 逐字跳动                                                  |
| `HeroDepthCanvas`          | Hero WebGL 深度（`webglCanvas` + `HERO_DEPTH_FRAGMENT_SHADER`） |
| `WebGLRevealMask`          | 遮罩 WebGL（共享 `webglCanvas` 层）                             |
| `TeamScene3D`              | About 页 3D 团队（InView 挂载）                                 |

### HoverShuffleText

```vue
<HoverShuffleText :text="t('nav.collection')" tag="span" :stagger="0.024" />
```

| Prop      | 默认    | 说明           |
| --------- | ------- | -------------- |
| `text`    | —       | 显示文案       |
| `tag`     | `span`  | 根元素标签     |
| `stagger` | `0.024` | 逐字延迟（秒） |

---

## ui

### MagneticButton

```vue
<MagneticButton :to="localizedPath('/products')" size="lg" :strength="0.28">
  Shop Collection
</MagneticButton>
```

| Prop       | 默认   | 说明                |
| ---------- | ------ | ------------------- |
| `to`       | —      | 有则渲染 `NuxtLink` |
| `strength` | `0.28` | 吸附强度 0–1        |

### LazyImage / ImageTilt3D

```vue
<LazyImage src="/img.jpg" alt="Product" priority aspect="4/3" />
```

`LazyImage` 与 `ImageTilt3D` 均在布局就绪后通过 `useLayoutInvalidation()` 通知 MotionRuntime。

---

## Composables

| Composable              | 用途                 | 门控                          |
| ----------------------- | -------------------- | ----------------------------- |
| `useMagnetic`           | 元素磁性偏移         | `animations` + `hover: hover` |
| `useMouseParallax`      | 商品图微动           | `animations` + `parallax`     |
| `useGsapTimeline`       | 组件内 GSAP 生命周期 | 内部使用                      |
| `useLayoutInvalidation` | 布局变更通知         | 替代 scroll inject            |

```ts
useMagnetic(shellRef, { strength: 0.28, maxOffset: 12, lerp: 0.15 })
useMouseParallax(mediaRef, stackRef, { maxX: 10, maxY: 8, lerp: 0.1 })
```

---

## GSAP 工厂（`lib/scroll/animation.ts`）

| 函数                             | 用途                                 |
| -------------------------------- | ------------------------------------ |
| `createHeroEnterTimeline`        | 页面 Hero 入场（含 `media` 3D 透视） |
| `createPageIntroCurtainTimeline` | 全屏幕帘 clip-path 揭示              |
| `createMaskLineReveal`           | 行遮罩上滑                           |
| `createSplitCharReveal`          | 逐字入场                             |
| `createHoverShuffle`             | hover 逐字跳动                       |
| `createScaleFadeReveal`          | 网格交错入场                         |
| `createClipImageReveal`          | clip-path 揭示                       |
| `createPdpTimeline`              | PDP 文案列                           |

页面级通过 `sceneRegistry` 引用；`PageIntroCurtain` 等 scroll 组件通过 `useGsapTimeline` 调用工厂。交互级由组件直接调用 `createHoverShuffle`。

---

## data-scroll 优先级

| 属性                       | 用途                            |
| -------------------------- | ------------------------------- |
| `data-scroll-css-progress` | **首选** — Hero、Dynasty、scrub |
| `data-scroll`              | InView 检测                     |
| `data-scroll-class`        | 进入视口 class（`is-inview`）   |
| `data-scroll-offset`       | IO rootMargin（默认 15%）       |
| `data-scroll-speed`        | 例外视差；**首页不用**          |
| `data-scroll-sticky`       | Sticky 吸附                     |

---

## 性能降级

| 层级     | 机制                                       |
| -------- | ------------------------------------------ |
| 静态     | `prefers-reduced-motion` → static          |
| 设备     | 低端 CPU/内存/2g → reduced                 |
| 运行时   | `jankGuard` → `forceMotionDegrade('jank')` |
| 环境变量 | `NUXT_PUBLIC_ENABLE_SMOOTH_SCROLL=false`   |

详见 [PERFORMANCE.md](./PERFORMANCE.md)。

---

## 内部约定

- 页面与组件**不应**直接调用 `useLocomotiveScroll`；通过 `MotionRuntime` 或 `useLayoutInvalidation` 消费
- 滚动常量：`lib/scroll/scrollConstants.ts`（`lerp: 0.12`）
- 全局错误页：`error.vue`（上报 `app_error`）

---

## 下一步阅读

- 微交互默认参数与验收清单 → [VISUAL-DESIGN](./VISUAL-DESIGN.md)
- 动效选型决策树 → [RESEARCH §3.3](./RESEARCH.md#33-动效选型决策树)
- 降级策略与 jankGuard → [PERFORMANCE](./PERFORMANCE.md)
