# Atelier Furniture — Locomotive Scroll 跨境家具独立站

> 10 SPU 极简高端家具独立站，复刻 Locomotive.ca 滚动视觉体系

## 快速开始

```bash
cd locomotive-furniture
pnpm install
pnpm dev
```

访问 http://localhost:5173

## 功能概览

- **滚动体验**：Locomotive Scroll v5 + Lenis 平滑滚动、分层视差、InView 入场动画
- **电商闭环**：10 SKU 展示 → 规格选择 → 加购 → 购物车 → 结算（Demo）
- **工程标准**：Vue 3 + TS + Pinia + TailwindCSS + Vitest + CI/CD
- **性能降级**：设备分级自动关闭平滑滚动/视差

## 页面

| 路由 | 页面 | 滚动动效 |
|------|------|----------|
| `/` | 首页（长页叙事） | ✅ |
| `/products` | 商品列表 | ❌ |
| `/products/:slug` | 商品详情 | ❌ |
| `/cart` | 购物车 | ❌ |
| `/checkout` | 结算 | ❌ |
| `/about` | 关于我们 | ✅ |

## 脚本

```bash
pnpm dev          # 开发
pnpm build        # 构建
pnpm preview      # 预览
pnpm lint         # 代码检查
pnpm test         # 单元测试
```

## 文档

| 文档 | 说明 |
|------|------|
| [docs/RESEARCH.md](docs/RESEARCH.md) | Locomotive.ca 调研分析 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架构与取舍权衡 |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | 运行/构建/部署 |
| [docs/COMPONENTS.md](docs/COMPONENTS.md) | 组件库使用 |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md) | 性能监控手册 |

## 目录结构

```
src/
├── core/           # 滚动引擎、监控、存储
├── components/
│   ├── base/       # 基础组件
│   └── business/   # 业务组件
├── views/          # 页面
├── store/          # Pinia 状态
├── data/           # 10 SPU 商品数据
├── router/         # 路由
├── types/          # TS 类型
└── assets/         # 样式与静态资源
```

## 技术栈

Vue 3 · Vite 5 · TypeScript · TailwindCSS 4 · Locomotive Scroll v5 · Lenis · GSAP · Pinia · Vitest

## License

MIT
