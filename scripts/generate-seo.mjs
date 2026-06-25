import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || process.env.VITE_SITE_URL || 'http://localhost:3000'

const catalogSource = readFileSync(join(root, 'app', 'data', 'productCatalog.ts'), 'utf8')
const productSlugs = [...catalogSource.matchAll(/^\s+slug:\s*'([^']+)'/gm)].map((match) => match[1])

if (productSlugs.length === 0) {
  throw new Error('[generate-seo] No product slugs found in app/data/productCatalog.ts')
}

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

mkdirSync(join(root, 'public'), { recursive: true })
writeFileSync(join(root, 'public', 'sitemap.xml'), sitemap)
writeFileSync(join(root, 'public', 'robots.txt'), robots)

console.log('[generate-seo] Wrote public/sitemap.xml and public/robots.txt')
