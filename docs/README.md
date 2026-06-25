# 项目 README

本页为 Demo 项目概览摘要；仓库根目录 `README.md` 含完整说明。

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 在线地址

| 站点     | 地址                                         |
| -------- | -------------------------------------------- |
| **主站** | https://locomotive-furniture.vercel.app      |
| **文档** | https://locomotive-furniture-docs.vercel.app |

元数据见仓库根目录 [`sites.json`](../sites.json)。推送到 `main` 后主站自动部署；文档项目 Git 关联见 [DEPLOYMENT](./DEPLOYMENT.md)。

## 主要脚本

| 命令                  | 说明                |
| --------------------- | ------------------- |
| `npm run dev`         | 开发主站            |
| `npm run docs:dev`    | 开发文档站          |
| `npm run build`       | 构建主站            |
| `npm run docs:build`  | 构建文档站          |
| `npm run deploy`      | 手动部署主站        |
| `npm run deploy:docs` | 手动部署文档站      |
| `npm run deploy:all`  | 主站 + 文档一并部署 |

详见 [DEPLOYMENT](./DEPLOYMENT.md)。
