# 性能监控与迭代优化手册

## 1. 量化指标阈值

| 指标 | 目标 | 告警 |
|------|------|------|
| LCP | < 2.5s | > 4.0s |
| CLS | < 0.1 | > 0.25 |
| FID | < 100ms | > 300ms |
| 滚动 FPS | ≥ 60 | < 30 |
| 生产包 gzip | < 600KB | > 800KB |

## 2. 埋点体系

### Web Vitals

`src/core/monitoring.ts` 自动采集 LCP、CLS，通过 `reportWebVital()` 上报。

### 业务埋点

| 事件 | 触发点 |
|------|--------|
| page_view | 路由切换 |
| add_to_cart | 加购成功 |
| checkout_complete | 结算完成 |
| scroll_fps | 开发环境滚动帧率 |
| Error / uncaught | 全局 JS 错误 |

开发环境：控制台 `console.debug('[Analytics]', ...)`
生产环境：设置 `VITE_ENABLE_ANALYTICS=true`

## 3. 设备降级配置

`src/core/performance.ts` → `detectPerformanceTier()`

| Tier | smoothScroll | parallax | animations |
|------|--------------|----------|------------|
| high | ✅ | ✅ | ✅ |
| medium | ✅ | ❌ | ✅ |
| low | ❌ | ❌ | ❌ |

触发条件：
- `prefers-reduced-motion: reduce` → low
- 移动端 → parallax off
- cores ≤ 2 或 memory ≤ 2 或 2g 网络 → low

## 4. 动画性能调优

1. **限制 transform DOM 数量**：仅大图/背景启用 `data-scroll-speed`
2. **禁用 scale 动画**：避免 layout shift
3. **路由切换 destroy scroll**：防止内存泄漏
4. **图片 lazy + WebP**：Unsplash auto=format 参数
5. **代码分包**：scroll 库独立 chunk

## 5. 迭代优化流程

```
采集 Web Vitals → 识别瓶颈 → 调整动效强度 → 回归测试 → 发布
```

### 常见问题

| 现象 | 排查 | 方案 |
|------|------|------|
| 首页掉帧 | FPS 监控 | 减少视差元素数量 |
| LCP 慢 | Network 面板 | 首屏图 eager + 压缩 |
| CLS 高 | Layout Shift | 移除 scale，固定 aspect-ratio |
| 路由切换卡顿 | 未 destroy | 检查 App.vue watch |

## 6. 线上运维

- CI 每次 push 自动 lint + test + build
- 静态资源 CDN 缓存 30 天
- 环境变量动态关闭动画：`VITE_ENABLE_SMOOTH_SCROLL=false`
