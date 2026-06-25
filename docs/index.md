---
layout: home

hero:
  name: Atelier Docs
  text: Locomotive 家具独立站 Demo
  tagline: 原理调研 · 视觉规范 · 分层架构 · 组件参考 · 部署与性能
  actions:
    - theme: brand
      text: 进入站点
      link: https://locomotive-furniture.vercel.app
      target: _blank
    - theme: alt
      text: 文档中心
      link: /README
    - theme: alt
      text: 快速开始
      link: /DEPLOYMENT#2-本地开发
    - theme: alt
      text: 站点调研
      link: /RESEARCH

features:
  - title: 原理与调研
    details: Lenis lerp、css-progress、单 RAF 循环；对标 Locomotive.ca 的复刻策略与组件映射。
    link: /RESEARCH
  - title: 视觉与交互
    details: 排版阶梯、液态色彩 scrub、hover shuffle / 磁性 CTA / 商品视差参数与降级矩阵。
    link: /VISUAL-DESIGN
  - title: 架构与组件
    details: 六层依赖、Motion Runtime 契约、MotionSceneHost 声明式场景、组件分层 API。
    link: /ARCHITECTURE
  - title: 工程与交付
    details: 10 SPU 电商闭环、Vercel 双项目部署、Web Vitals + jankGuard、CI / E2E 门禁。
    link: /DELIVERY
---

## 文档导航

按角色选择阅读路径，完整索引见 [文档中心](./README.md)。

| 分类           | 文档                                | 说明                          |
| -------------- | ----------------------------------- | ----------------------------- |
| **入门**       | [DELIVERY](./DELIVERY.md)           | Demo 范围、产物清单、验收标准 |
| **设计与决策** | [RESEARCH](./RESEARCH.md)           | 原站机制原理与复刻映射        |
|                | [VISUAL-DESIGN](./VISUAL-DESIGN.md) | 视觉与微交互规范              |
|                | [TRADEOFFS](./TRADEOFFS.md)         | 全项目取舍矩阵                |
| **开发与架构** | [ARCHITECTURE](./ARCHITECTURE.md)   | 六层架构与 Motion Runtime     |
|                | [COMPONENTS](./COMPONENTS.md)       | 组件 API 与 composables       |
|                | [PERFORMANCE](./PERFORMANCE.md)     | Web Vitals、降级与包体积预算  |
| **运维与协作** | [DEPLOYMENT](./DEPLOYMENT.md)       | 本地开发、构建、Vercel 部署   |
|                | [FAQ](./FAQ.md)                     | 动效、i18n、Commerce 排错     |
|                | [CONTRIBUTING](./CONTRIBUTING.md)   | GitHub Flow 与代码门禁        |
