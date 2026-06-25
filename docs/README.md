# 项目 README

本页为项目概览摘要；仓库根目录 `README.md` 含完整说明。

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 在线地址

文档为**独立站点**，与主站分域名部署：

- **主站**：由 `vercel.json` 部署
- **文档**：由 `vercel.docs.json` 部署；导航栏「返回站点」指向 `VITE_SITE_URL`

## 主要脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发主站 |
| `npm run docs:dev` | 开发文档站 |
| `npm run build` | 构建主站 |
| `npm run docs:build` | 构建文档站 |

详见 [DEPLOYMENT](./DEPLOYMENT.md)。
