# 组件库使用文档

组件按职责分四层，路径与 import 示例：

| 目录 | 用途 | 示例 |
|------|------|------|
| `components/layout/` | 布局 | `AppHeader` |
| `components/ui/` | 通用 UI | `BaseButton`, `Skeleton`, `LazyImage` |
| `components/product/` | 商品域 | `ProductCard`, `CartItem`, `VariantSelector` |
| `components/scroll/` | 滚动动效 | `ScrollReveal`, `ScrollSection`, `WebGLRevealMask` |

---

## layout

### AppHeader

- 固定顶部导航
- 滚动方向显隐（`App.vue` 注入 scroll 上下文）
- 购物车数量角标

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

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| variant | `'primary' \| 'secondary' \| 'ghost'` | primary | 样式变体 |
| size | `'sm' \| 'md' \| 'lg'` | md | 尺寸 |
| disabled | boolean | false | 禁用状态 |
| type | `'button' \| 'submit'` | button | 按钮类型 |

### LazyImage

```vue
<LazyImage src="/img.jpg" alt="Product" :lazy="true" aspect="4/3" />
```

- 骨架屏占位
- 加载失败兜底文案
- 图片 load 后触发 Locomotive `update()`

### Skeleton / PageSkeleton / ProductCardSkeleton

加载态占位，用于 `ProductsView` async fetch 期间。

---

## product

### ProductCard

```vue
<ProductCard :product="product" />
```

接收 `Product`（`@/data/schemas`），渲染卡片 + 路由跳转。

### VariantSelector

```vue
<VariantSelector v-model="variantId" :variants="product.variants" />
```

### ProductViewTracker

无 UI，挂载于 PDP，触发 `product_view` 埋点。

---

## scroll

### ScrollReveal

DRY 封装 Locomotive InView + 可选视差：

```vue
<ScrollReveal :speed="-0.2" offset="10%">
  <h2>Section title</h2>
</ScrollReveal>
```

未进入视口时保持可见（仅位移），避免与 GSAP 双重隐藏。

### ScrollSection

```vue
<ScrollSection :speed="0.3" :sticky="true">
  <ScrollReveal>Content</ScrollReveal>
</ScrollSection>
```

### WebGLRevealMask

Hero 蒙层，仅 `motionCapabilities.webgl === true` 时渲染。

---

## data-scroll 属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `data-scroll` | 启用 InView 检测 | `<div data-scroll>` |
| `data-scroll-speed` | 视差速度 | `data-scroll-speed="-0.5"` |
| `data-scroll-class` | 进入视口 class | `data-scroll-class="is-inview"` |
| `data-scroll-sticky` | Sticky 吸附 | `<section data-scroll-sticky>` |
| `data-scroll-css-progress` | CSS 进度变量 | Hero 进度条 |

---

## useLocomotiveScroll

```ts
import {
  useLocomotiveScroll,
  useScrollLifecycle,
  scrollInjectionKey,
} from '@/composables/useLocomotiveScroll'
```

| API | 说明 |
|-----|------|
| `useLocomotiveScroll()` | 在 `App.vue` 初始化/销毁实例 |
| `useScrollLifecycle()` | 页面级生命周期封装 |
| `scrollInjectionKey` | provide/inject 滚动上下文 |
| `update()` | DOM 变更后 resize |
| `scrollTo(target)` | 编程式滚动 |

---

## 性能降级

自动检测 `prefers-reduced-motion`、CPU、内存、网络；低端设备关闭平滑滚动和视差。移动端视差受 `motionCapabilities` 与环境变量共同门控。

详见 [PERFORMANCE.md](./PERFORMANCE.md)。
