# 项目技术架构与取舍权衡

## 1. 四层架构

```
┌─────────────────────────────────────────┐
│  Views (页面层)                          │
│  Home / Products / Detail / Cart / ...  │
├─────────────────────────────────────────┤
│  Business Components (业务组件层)        │
│  ProductCard / ScrollSection / CartItem │
├─────────────────────────────────────────┤
│  Base Components (基础组件层)            │
│  Button / LazyImage / AppHeader         │
├─────────────────────────────────────────┤
│  Core (底层工具层)                       │
│  useLocomotiveScroll / monitoring / ... │
└─────────────────────────────────────────┘
```

## 2. 技术栈选型

| 类别 | 选型 | 理由 |
|------|------|------|
| 框架 | Vue 3 + Vite 5 + TS | 快速构建、类型安全、生态成熟 |
| 样式 | TailwindCSS 4 + SCSS | 设计 Token、品牌变量集中管理 |
| 滚动 | Locomotive Scroll v5 + Lenis | 对标参考站，声明式视差 |
| 动画 | GSAP（辅助入场） | 复杂时序动画，与 Locomotive 分工 |
| 状态 | Pinia + localStorage | 购物车轻量持久化 |
| 测试 | Vitest | 单元测试核心逻辑 |
| 规范 | ESLint + Prettier + Husky | 代码质量自动化 |

## 3. Trade-off 清单

### 3.1 动效 vs 性能

- ✅ Locomotive + Lenis（非纯原生/GSAP ScrollTrigger）
- ✅ 仅产品大图视差，文字禁用多层视差
- ✅ 入场一次性动画，滚动仅图片视差持续
- ✅ 移动端关闭多层视差
- ✅ 仅位移视差，移除 scale 避免 CLS

### 3.2 业务 vs 视觉

- ✅ 首页长页叙事，商品页简化动效
- ✅ 详情页渐进加载 + 懒加载
- ✅ 购物车/结算无复杂视差
- ✅ 低性能设备自动降级

### 3.3 工程 vs 成本

- ✅ 完整 lint/test/CI 基建（+1天初始化）
- ✅ 多环境 .env 隔离
- ✅ Web Vitals 埋点可观测

## 4. 组件设计规范

- 基础组件：无业务逻辑，props 类型完整
- 业务组件：接收 Product/CartItem 等领域类型
- 滚动区块：通过 `ScrollSection` 封装 `data-scroll-*` 属性
- 页面：仅组合组件，不写重复商品渲染逻辑

## 5. 扩展路径

- 新增 SPU：仅需在 `src/data/products.ts` 追加数据
- 多语言：i18n 插件 + 路由前缀
- 多币种：formatPrice 扩展 + Pinia 币种状态
- 营销活动：Business 层新增 Banner/Countdown 组件
