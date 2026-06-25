import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const siteUrl = process.env.VITE_SITE_URL || 'http://localhost:5173'

/** Product slugs — keep in sync with src/data/products.ts */
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

const staticRoutes = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/products', priority: '0.9', changefreq: 'weekly' },
  { loc: '/about', priority: '0.7', changefreq: 'monthly' },
  { loc: '/cart', priority: '0.5', changefreq: 'monthly' },
]

const urls = [
  ...staticRoutes.map(
    (r) => `  <url>
    <loc>${siteUrl}${r.loc}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  ),
  ...productSlugs.map(
    (slug) => `  <url>
    <loc>${siteUrl}/products/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
  ),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
