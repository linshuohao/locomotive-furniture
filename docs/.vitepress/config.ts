import { defineConfig } from 'vitepress'

const appUrl = process.env.VITE_SITE_URL || 'http://localhost:5173'

export default defineConfig({
  title: 'Atelier Docs',
  description: 'Locomotive Scroll 跨境家具独立站 — 架构、部署与开发文档',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [/^https?:\/\/localhost/, /^\.\.\/README/, /^\.\.\/\.env\.example/],
  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: 'Atelier Docs',
    nav: [
      { text: '返回站点', link: appUrl, target: '_blank', rel: 'noreferrer' },
      { text: '架构', link: '/ARCHITECTURE' },
      { text: '部署', link: '/DEPLOYMENT' },
    ],
    sidebar: [
      {
        text: '概览',
        items: [
          { text: '文档首页', link: '/' },
          { text: '项目 README', link: '/README' },
          { text: '交付清单', link: '/DELIVERY' },
        ],
      },
      {
        text: '设计与决策',
        items: [
          { text: '站点调研', link: '/RESEARCH' },
          { text: '取舍权衡', link: '/TRADEOFFS' },
          { text: '技术架构', link: '/ARCHITECTURE' },
        ],
      },
      {
        text: '开发参考',
        items: [
          { text: '组件库', link: '/COMPONENTS' },
          { text: '性能监控', link: '/PERFORMANCE' },
          { text: '运行与部署', link: '/DEPLOYMENT' },
          { text: '贡献指南', link: '/CONTRIBUTING' },
        ],
      },
    ],
    socialLinks: [],
    footer: {
      message: 'Atelier Furniture — Demo Project',
      copyright: 'MIT License',
    },
    search: {
      provider: 'local',
    },
  },
  vite: {
    publicDir: '../../public',
  },
})
