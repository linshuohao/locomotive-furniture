# 组件库使用文档

组件按职责分四层，路径与 import 示例：

| 目录                  | 用途     | 示例                                                                                           |
| --------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `components/layout/`  | 布局     | `AppHeader`                                                                                    |
| `components/ui/`      | 通用 UI  | `BaseButton`, `Skeleton`, `LazyImage`                                                          |
| `components/product/` | 商品域   | `ProductCard`, `CartItem`, `VariantSelector`                                                   |
| `components/scroll/`  | 滚动动效 | `ScrollReveal`, `MaskReveal`, `MarqueeBand`, `CyclingText`, `ScrollSection`, `WebGLRevealMask` |

---

## layout

### AppHeader

- 固定顶部导航
- 滚动方向显隐（`layouts/default.vue` 注入 scroll 上下文）
- 购物车数量角标 + bump 动画
- 导航链接 hover 下划线滑入（`.nav-link::after`）

```vue
import AppHeader from '@/components/layout/AppHeader.vue'
```

---

## ui

### BaseButton

```vue
<BaseButton variant="primary" size="lg" :disabled="false">
  Add to Cart
</BaseButton>
```

| Prop     | 类型                                  | 默认    | 说明     |
| -------- | ------------------------------------- | ------- | -------- |
| variant  | `'primary' \| 'secondary' \| 'ghost'` | primary | 样式变体 |
| size     | `'sm' \| 'md' \| 'lg'`                | md      | 尺寸     |
| disabled | boolean                               | false   | 禁用状态 |
| type     | `'button' \| 'submit'`                | button  | 按钮类型 |

### LazyImage

```vue
<LazyImage src="/img.jpg" alt="Product" :lazy="true" aspect="4/3" />
```

- 骨架屏占位
- 加载失败兜底文案
- 图片 load 后触发 Locomotive `update()`

### Skeleton / PageSkeleton / ProductCardSkeleton

加载态占位，用于 `pages/products/index.vue` async fetch 期间。

---

## product

### ProductCard

```vue
<ProductCard :product="product" />
```

接收 `Product`（`@/data/schemas`），渲染卡片 + 路由跳转。Hover 时图片放大、标题下划线滑入。

### VariantSelector

```vue
<VariantSelector v-model="variantId" :variants="product.variants" />
```

### ProductViewTracker

无 UI，挂载于 PDP，触发 `product_view` 埋点。

---

## scroll

动效分两层：

1. **Locomotive 声明式** — `ScrollReveal` / `ScrollSection` 的 `data-scroll-*`（视差、InView）
2. **GSAP 命令式** — `lib/scroll/animation.ts` 工厂 + `useGsapTimeline`（遮罩行、clip 图片、交错入场）

页面级 GSAP 须在 `detectPerformanceTier().animations === true` 时才会运行；`prefers-reduced-motion` 或低端设备自动跳过。

### ScrollReveal

DRY 封装 Locomotive InView + 可选视差：

```vue
<ScrollReveal :speed="-0.2" offset="0,100px">
  <h2>Section title</h2>
</ScrollReveal>

<!-- Locomotive 风格 clip / scale 变体（CSS transition，无 GSAP 开销） -->
<ScrollReveal variant="clip" :speed="0.12">
  <LazyImage src="/img.jpg" alt="Product" aspect="4/3" />
</ScrollReveal>

<ScrollReveal variant="scale" class="text-center">
  <h2>Featured</h2>
</ScrollReveal>
```

| Prop    | 类型                             | 默认      | 说明                               |
| ------- | -------------------------------- | --------- | ---------------------------------- |
| speed   | number                           | —         | 视差速度（负值背景慢、正值前景快） |
| offset  | string                           | `0,100px` | InView 触发偏移                    |
| variant | `'default' \| 'clip' \| 'scale'` | default   | CSS 揭示变体                       |
| tag     | string                           | div       | 根元素标签                         |

未进入视口时保持可见（仅位移），避免与 GSAP 双重隐藏。

### MaskReveal

Locomotive 标志性**逐行遮罩上滑**揭示。子元素须按行标记 `data-mask-line`，外层用 `.mask-line-wrap`（`overflow: hidden`）包一层：

```vue
<MaskReveal tag="h1" hero>
  <span class="mask-line-wrap">
    <span data-mask-line>Design that</span>
  </span>
  <span class="mask-line-wrap">
    <span data-mask-line>lives with you</span>
  </span>
</MaskReveal>

<!-- 滚动进入时触发（默认） -->
<MaskReveal tag="div">
  <span class="mask-line-wrap">
    <span data-mask-line>{{ t('about.title') }}</span>
  </span>
</MaskReveal>
```

| Prop    | 类型    | 默认  | 说明                                        |
| ------- | ------- | ----- | ------------------------------------------- |
| hero    | boolean | false | `true` 时页面加载即播放（无 ScrollTrigger） |
| stagger | number  | 0.08  | 行间交错间隔（秒）                          |
| delay   | number  | 0     | 整体延迟（秒）                              |
| tag     | string  | div   | 根元素标签                                  |

底层调用 `createHeroMaskLines` / `createMaskLineReveal`（`animation.ts`）。

### MarqueeBand

无限横向滚动文字带（纯 CSS animation，`prefers-reduced-motion` 下静止换行）：

```vue
<MarqueeBand :items="['Craftsmanship', 'Sustainability', 'Global Shipping']" speed="slow" reverse />
```

| Prop      | 类型                           | 默认   | 说明                                   |
| --------- | ------------------------------ | ------ | -------------------------------------- |
| items     | string[]                       | —      | 滚动文案（内部复制一份以实现无缝循环） |
| speed     | `'slow' \| 'normal' \| 'fast'` | normal | 滚动速度                               |
| reverse   | boolean                        | false  | 反向滚动                               |
| separator | string                         | ·      | 项间分隔符                             |

### CyclingText

Hero 区循环切换文案（类似 Locomotive.ca「Digital → Digital-First → …」）：

```vue
<CyclingText
  :phrases="['Timeless', 'Timeless Design', 'Timeless Living']"
  tag="span"
  :interval="2800"
/>
```

| Prop     | 类型     | 默认 | 说明           |
| -------- | -------- | ---- | -------------- |
| phrases  | string[] | —    | 循环短语       |
| interval | number   | 2800 | 切换间隔（ms） |
| tag      | string   | span | 内层文本标签   |

`motionCapabilities.tier === 'static'` 时不循环。

### ScrollSection

```vue
<ScrollSection :speed="0.3" :sticky="true">
  <ScrollReveal>Content</ScrollReveal>
</ScrollSection>
```

### WebGLRevealMask

Hero 蒙层，仅 `motionCapabilities.webgl === true` 时渲染。

### InViewReveal

轻量 IntersectionObserver 入场（无 Locomotive 依赖），用于不需视差的区块。

---

## GSAP 动画工厂（`lib/scroll/animation.ts`）

页面通过 `useGsapTimeline` 挂载，卸载时自动 `ctx.revert()`：

```ts
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import { createScaleFadeReveal } from '@/lib/scroll/animation'

const gridRef = ref<HTMLElement | null>(null)

useGsapTimeline(
  () => {
    if (gridRef.value) {
      createScaleFadeReveal(gridRef.value, '[data-product-card]', { stagger: 0.08 })
    }
  },
  { watchSource: gridRef },
)
```

| 工厂函数                  | 用途                                   | 典型页面           |
| ------------------------- | -------------------------------------- | ------------------ |
| `createHeroEnterTimeline` | Hero eyebrow / subtitle / CTA 交错入场 | 首页、商品列表     |
| `createHeroMaskLines`     | Hero 标题逐行遮罩（mount-only）        | 首页               |
| `createMaskLineReveal`    | 滚动触发逐行遮罩                       | About、首页区块    |
| `createStaggerReveal`     | 网格 y + fade 交错                     | —                  |
| `createClipImageReveal`   | 图片 clip-path 自下展开                | 首页理念区         |
| `createScaleFadeReveal`   | 卡片 scale + fade 交错                 | 首页精选、商品列表 |
| `createScrubParallax`     | 单元素 scrub 视差                      | —                  |
| `createNarrativeScrub`    | Sticky 叙事区内 scrub（无 pin）        | 首页               |
| `createHorizontalDrift`   | 水平 scrub 漂移                        | —                  |
| `createPdpTimeline`       | PDP 文案列 `[data-pdp-reveal]` 交错    | 商品详情           |
| `createFormCascade`       | 表单字段横向 cascade                   | 结算               |
| `createSuccessTimeline`   | 成功页庆祝 burst                       | 订单确认           |

**约定**：ScrollTrigger 默认 `toggleActions: 'play none none none'`（不 reverse，避免上滚内容消失）；叙事 scrub **不使用 pin**（与 Locomotive transform 冲突会产生巨大空白）。

### useGsapTimeline

```ts
useGsapTimeline(factory, { watchSource?: Ref })  // watchSource 变化时重建动画
```

内部注入 `scrollInjectionKey`，动画就绪后调用 `scroll.update()` + `ScrollTrigger.refresh()`。

---

## data-scroll 属性

| 属性                       | 说明             | 示例                            |
| -------------------------- | ---------------- | ------------------------------- |
| `data-scroll`              | 启用 InView 检测 | `<div data-scroll>`             |
| `data-scroll-speed`        | 视差速度         | `data-scroll-speed="-0.5"`      |
| `data-scroll-class`        | 进入视口 class   | `data-scroll-class="is-inview"` |
| `data-scroll-sticky`       | Sticky 吸附      | `<section data-scroll-sticky>`  |
| `data-scroll-css-progress` | CSS 进度变量     | Hero 进度条                     |

---

## useLocomotiveScroll

```ts
import {
  useLocomotiveScroll,
  useScrollLifecycle,
  scrollInjectionKey,
} from '@/composables/useLocomotiveScroll'
```

| API                     | 说明                                     |
| ----------------------- | ---------------------------------------- |
| `useLocomotiveScroll()` | 在 `layouts/default.vue` 初始化/销毁实例 |
| `useScrollLifecycle()`  | 页面级生命周期封装                       |
| `scrollInjectionKey`    | provide/inject 滚动上下文                |
| `update()`              | DOM 变更后 resize                        |
| `scrollTo(target)`      | 编程式滚动                               |

---

## 性能降级

自动检测 `prefers-reduced-motion`、CPU、内存、网络；低端设备关闭平滑滚动和视差。移动端视差受 `motionCapabilities` 与环境变量共同门控。

详见 [PERFORMANCE.md](./PERFORMANCE.md)。
