import type { Product } from '@/data/schemas'
import { ProductSchema, withDefaultSeo } from '@/data/schemas'
import { productCatalog } from '@/data/productCatalog'
import { getProductTranslation } from '@/data/productTranslations'
import { getCurrentLocale } from '@/lib/i18n/currentLocale'
import type { AppLocale } from '@/lib/i18n/constants'
import { DEFAULT_LOCALE, LOCALE_INTL } from '@/lib/i18n/constants'

function localizeEntry(entry: (typeof productCatalog)[number], locale: AppLocale) {
  const translation = getProductTranslation(entry.id, locale)
  if (!translation) {
    return withDefaultSeo({ ...entry, images: [...entry.images] })
  }

  return withDefaultSeo({
    ...entry,
    images: [...entry.images],
    name: translation.name,
    tagline: translation.tagline,
    description: translation.description,
    category: translation.category,
    dimensions: translation.dimensions,
    variants: entry.variants.map((variant) => {
      const variantTranslation = translation.variants[variant.id]
      if (!variantTranslation) return { ...variant }
      return {
        ...variant,
        name: variantTranslation.name,
        material: variantTranslation.material,
      }
    }),
    seo: {
      title: `${translation.name} — Atelier Furniture`,
      description: translation.tagline,
    },
  })
}

function parseProducts(locale: AppLocale): Product[] {
  return productCatalog.map((entry) => ProductSchema.parse(localizeEntry(entry, locale)))
}

export function getProducts(locale: AppLocale = getCurrentLocale()): Product[] {
  return parseProducts(locale)
}

export function getProductBySlug(
  slug: string,
  locale: AppLocale = getCurrentLocale(),
): Product | undefined {
  return getProducts(locale).find((product) => product.slug === slug)
}

export function getProductById(
  id: string,
  locale: AppLocale = getCurrentLocale(),
): Product | undefined {
  return getProducts(locale).find((product) => product.id === id)
}

/** @deprecated Use getProducts(locale) — kept for backward-compatible imports */
export const products: Product[] = parseProducts(DEFAULT_LOCALE)

export function formatPrice(
  amount: number,
  currency = 'USD',
  locale: AppLocale = getCurrentLocale(),
): string {
  return new Intl.NumberFormat(LOCALE_INTL[locale], { style: 'currency', currency }).format(amount)
}

export function resolveLocale(locale?: AppLocale): AppLocale {
  return locale ?? getCurrentLocale()
}
