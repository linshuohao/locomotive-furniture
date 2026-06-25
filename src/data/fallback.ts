import { getProducts, getProductBySlug as getLocalizedProductBySlug } from '@/data/products'
import type { Product } from '@/data/schemas'
import type { CommerceResponse } from '@/data/types'
import { API_TIMEOUT_MS } from '@/data/client'
import { getCurrentLocale } from '@/lib/i18n/currentLocale'
import type { AppLocale } from '@/lib/i18n/constants'

function fallbackMessage(): string {
  try {
    const { t } = useI18n()
    return t('fallback.offlineCatalog')
  } catch {
    return 'Showing offline catalog'
  }
}

export function offlineProducts(locale?: AppLocale): Product[] {
  return getProducts(locale ?? getCurrentLocale())
}

export function offlineProductBySlug(slug: string, locale?: AppLocale): Product | undefined {
  return getLocalizedProductBySlug(slug, locale ?? getCurrentLocale())
}

export function catalogFallback<T>(data: T): CommerceResponse<T> {
  return {
    data,
    error: fallbackMessage(),
    meta: { latencyMs: API_TIMEOUT_MS, source: 'fallback' },
  }
}
