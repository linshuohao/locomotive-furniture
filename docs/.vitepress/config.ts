import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const appUrl = process.env.VITE_SITE_URL || 'https://locomotive-furniture.vercel.app'

export default withMermaid(
  defineConfig({
    title: 'Atelier Docs',
    description: 'Locomotive Scroll 跨境家具独立站 — 架构、组件、部署与开发文档',
    base: '/',
    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: [
      /^https?:\/\/localhost/,
      /^\.\.\/README/,
      /^\.\.\/\.\.\/README/,
      /^\.\.\/\.env\.example/,
    ],
    themeConfig: {
      logo: '/favicon.svg',
      siteTitle: 'Atelier Docs',
      outline: {
        level: [2, 3],
        label: '本页目录',
      },
      nav: [
        { text: '文档中心', link: '/README' },
        { text: '架构', link: '/ARCHITECTURE' },
        { text: '组件', link: '/COMPONENTS' },
        { text: '部署', link: '/DEPLOYMENT' },
        { text: '返回站点', link: appUrl, target: '_blank', rel: 'noreferrer' },
      ],
      sidebar: [
        {
          text: '入门',
          collapsed: false,
          items: [
            { text: '文档中心', link: '/README' },
            { text: 'Demo 范围与产物', link: '/DELIVERY' },
          ],
        },
        {
          text: '设计与决策',
          collapsed: false,
          items: [
            { text: '站点调研', link: '/RESEARCH' },
            { text: '视觉与交互', link: '/VISUAL-DESIGN' },
            { text: '取舍权衡', link: '/TRADEOFFS' },
          ],
        },
        {
          text: '开发与架构',
          collapsed: false,
          items: [
            { text: '技术架构', link: '/ARCHITECTURE' },
            { text: '组件库', link: '/COMPONENTS' },
            { text: '性能监控', link: '/PERFORMANCE' },
          ],
        },
        {
          text: '运维与协作',
          collapsed: false,
          items: [
            { text: '运行与部署', link: '/DEPLOYMENT' },
            { text: '常见问题', link: '/FAQ' },
            { text: '贡献指南', link: '/CONTRIBUTING' },
          ],
        },
      ],
      docFooter: {
        prev: '上一篇',
        next: '下一篇',
      },
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
      optimizeDeps: {
        include: ['mermaid', 'vitepress-plugin-mermaid'],
      },
    },
  }),
  {
    mermaid: {
      theme: 'neutral',
    },
  },
)
