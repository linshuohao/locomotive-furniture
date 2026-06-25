import { getProducts, getProductBySlug as getLocalizedProductBySlug } from '@/data/products'
import type { Product } from '@/data/schemas'
import type { CommerceResponse } from '@/data/types'
import { API_TIMEOUT_MS } from '@/data/client'
import { getCurrentLocale } from '@/i18n'
import { i18n } from '@/i18n'
import type { AppLocale } from '@/lib/i18n/constants'

export function offlineProducts(locale?: AppLocale): Product[] {
  return getProducts(locale ?? getCurrentLocale())
}

export function offlineProductBySlug(slug: string, locale?: AppLocale): Product | undefined {
  return getLocalizedProductBySlug(slug, locale ?? getCurrentLocale())
}

export function catalogFallback<T>(data: T): CommerceResponse<T> {
  return {
    data,
    error: i18n.global.t('fallback.offlineCatalog'),
    meta: { latencyMs: API_TIMEOUT_MS, source: 'fallback' },
  }
}
