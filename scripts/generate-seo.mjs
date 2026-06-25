import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || process.env.VITE_SITE_URL || 'http://localhost:3000'

/** Product slugs — keep in sync with src/data/productCatalog.ts */
const productSlugs = [
  'nordic-lounge-chair',
  'horizon-dining-table',
  'arc-floor-lamp',
  'cloud-modular-sofa',
  'pillar-sideboard',
  'zen-coffee-table',
  'frame-wall-shelf',
  'haven-bed-frame',
  'orbit-pendant-light',
  'studio-desk',
]

const locales = [
  { prefix: '', hreflang: 'en' },
  { prefix: '/zh', hreflang: 'zh-CN' },
]

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/products', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/cart', priority: '0.5', changefreq: 'monthly' },
]

function absoluteUrl(prefix, path) {
  const normalizedPath = path === '/' && prefix ? prefix : `${prefix}${path === '/' ? '' : path}`
  return `${siteUrl}${normalizedPath || '/'}`
}

function alternateLinks(path) {
  return locales
    .map(
      (locale) =>
        `    <xhtml:link rel="alternate" hreflang="${locale.hreflang}" href="${absoluteUrl(locale.prefix, path)}" />`,
    )
    .join('\n')
}

function urlEntry(path, priority, changefreq) {
  const primary = absoluteUrl('', path)
  return `  <url>
    <loc>${primary}</loc>
${alternateLinks(path)}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

const urls = [
  ...staticRoutes.map((route) => urlEntry(route.path, route.priority, route.changefreq)),
  ...productSlugs.map((slug) =>
    urlEntry(`/products/${slug}`, '0.8', 'weekly'),
  ),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

mkdirSync(join(root, 'src', 'public'), { recursive: true })
writeFileSync(join(root, 'src', 'public', 'sitemap.xml'), sitemap)
writeFileSync(join(root, 'src', 'public', 'robots.txt'), robots)

console.log('[generate-seo] Wrote src/public/sitemap.xml and src/public/robots.txt')
