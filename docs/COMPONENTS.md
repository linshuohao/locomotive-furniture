# 组件库使用文档

## Base 组件

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
- `loading="lazy"` + `decoding="async"`

### AppHeader

- 固定顶部导航
- `hidden` prop 控制滚动方向显隐
- 购物车数量角标

## Business 组件

### ProductCard

```vue
<ProductCard :product="product" />
```

接收 `Product` 类型，渲染卡片 + 路由跳转。

### VariantSelector

```vue
<VariantSelector v-model="variantId" :variants="product.variants" />
```

### ScrollSection

Locomotive 滚动区块封装：

```vue
<ScrollSection :speed="0.3" :sticky="false">
  <div data-scroll data-scroll-class="is-inview">Content</div>
</ScrollSection>
```

## data-scroll 属性配置

| 属性 | 说明 | 示例 |
|------|------|------|
| `data-scroll` | 启用 InView 检测 | `<div data-scroll>` |
| `data-scroll-speed` | 视差速度（负=慢，正=快） | `data-scroll-speed="-0.5"` |
| `data-scroll-class` | 进入视口添加的 class | `data-scroll-class="is-inview"` |
| `data-scroll-sticky` | Sticky 吸附 | `<section data-scroll-sticky>` |
| `data-scroll-repeat` | 重复触发 | `data-scroll-repeat` |

## useLocomotiveScroll

```ts
import { useScrollLifecycle } from '@/core/useLocomotiveScroll'

// 在需要滚动效果的页面
const { scrollProgress, scrollDirection, tier } = useScrollLifecycle()
```

| 方法/属性 | 说明 |
|-----------|------|
| init() | 初始化实例 |
| destroy() | 销毁实例（路由切换必调） |
| update() | DOM 变更后 resize |
| scrollTo(target) | 编程式滚动 |
| tier | 设备性能分级 |

## 性能降级

自动检测 `prefers-reduced-motion`、CPU 核心数、内存、网络，低端设备关闭平滑滚动和视差。移动端（<768px）默认关闭视差。
