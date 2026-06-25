---
layout: home

hero:
  name: Atelier Docs
  text: Locomotive 家具独立站
  tagline: 架构 · 组件 · 部署 · 性能 — 与源码同步的项目文档
  actions:
    - theme: brand
      text: 进入站点
      link: https://locomotive-furniture.vercel.app
      target: _blank
    - theme: alt
      text: 快速开始
      link: /DEPLOYMENT
    - theme: alt
      text: 架构概览
      link: /ARCHITECTURE

features:
  - title: 滚动与动效
    details: Locomotive Scroll v5 + GSAP；MaskReveal 遮罩行、MarqueeBand、CyclingText、clip/scale 揭示；含降级策略与 TRADEOFFS 决策记录。
  - title: 电商闭环
    details: 10 SKU → 购物车 → 结算 Demo；data/providers 支持 mock / http 切换。
  - title: 工程化
    details: Vue 3 + TS + Vitest + CI + Husky 门禁；Conventional Commits 提交规范。
---

## 文档导航

| 文档                              | 说明                              |
| --------------------------------- | --------------------------------- |
| [RESEARCH](./RESEARCH.md)         | Locomotive.ca 调研                |
| [TRADEOFFS](./TRADEOFFS.md)       | 全项目取舍清单                    |
| [ARCHITECTURE](./ARCHITECTURE.md) | 分层架构与扩展路径                |
| [COMPONENTS](./COMPONENTS.md)     | 组件、GSAP 工厂与 data-scroll API |
| [PERFORMANCE](./PERFORMANCE.md)   | Web Vitals 与调优                 |
| [DEPLOYMENT](./DEPLOYMENT.md)     | 本地开发、Vercel 部署             |
| [CONTRIBUTING](./CONTRIBUTING.md) | 代码门禁与提交规范                |
| [DELIVERY](./DELIVERY.md)         | 交付验收清单                      |
