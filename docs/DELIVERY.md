# 全量交付产物目录

## 1. 可运行工程

| 路径 | 说明 |
|------|------|
| `locomotive-furniture/` | Vue3 + Vite + TS 完整前端项目 |
| `locomotive-furniture/src/` | 源码（core / components / views / store） |
| `locomotive-furniture/dist/` | 生产构建产物（`pnpm build` 后生成） |

## 2. 文档类交付物

| 文档 | 路径 | 内容 |
|------|------|------|
| 站点调研分析 | `docs/RESEARCH.md` | Locomotive.ca 原理、优劣势、复刻风险 |
| 架构与取舍 | `docs/ARCHITECTURE.md` | Trade-off、技术选型、分层设计 |
| 运行部署手册 | `docs/DEPLOYMENT.md` | 启动、构建、Nginx、CI/CD |
| 组件库文档 | `docs/COMPONENTS.md` | 组件 API、data-scroll 配置 |
| 性能监控手册 | `docs/PERFORMANCE.md` | Web Vitals、降级策略、调优 |
| 项目 README | `README.md` | 快速开始与总览 |

## 3. 工程配置

| 文件 | 说明 |
|------|------|
| `.env.development` / `.test` / `.production` | 多环境变量 |
| `eslint.config.js` | ESLint 规则 |
| `.prettierrc` | 代码格式化 |
| `commitlint.config.js` | Git 提交规范 |
| `.github/workflows/ci.yml` | CI 流水线 |
| `vitest.config.ts` | 单元测试配置 |

## 4. 核心模块

| 模块 | 路径 |
|------|------|
| Locomotive 滚动封装 | `src/core/useLocomotiveScroll.ts` |
| 性能分级降级 | `src/core/performance.ts` |
| Web Vitals 埋点 | `src/core/monitoring.ts` |
| 购物车状态 | `src/store/cart.ts` |
| 10 SPU 商品数据 | `src/data/products.ts` |

## 5. 验收命令

```bash
cd locomotive-furniture
pnpm install
pnpm dev      # 本地开发
pnpm build    # 生产构建 ✅
pnpm test     # 8 项单元测试 ✅
pnpm lint     # 代码规范
```

## 6. 性能指标（构建实测）

| 指标 | 目标 | 实测 |
|------|------|------|
| 生产 JS gzip（scroll chunk） | — | ~8.6 KB |
| 生产 JS gzip（vendor chunk） | — | ~39.9 KB |
| 总 gzip 体积 | < 600 KB | ✅ ~65 KB（核心 bundle） |

## 7. 未包含（按需求边界）

- 真实支付网关对接
- 后端库存 API
- 多语言 / 多币种（预留扩展路径见 ARCHITECTURE.md）
- Cypress E2E（脚本占位，见 DEPLOYMENT.md 扩展说明）
