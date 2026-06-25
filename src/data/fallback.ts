import { getProducts, getProductBySlug as getLocalizedProductBySlug } from '@/data/products'
import type { Product } from '@/data/schemas'
import type { CommerceResponse } from '@/data/types'
import { API_TIMEOUT_MS } from '@/data/client'
import { getCurrentLocale } from '@/lib/i18n/currentLocale'
import type { AppLocale } from '@/lib/i18n/constants'

/** i18n key returned in CommerceResponse.error — translate in the Page layer */
export const FALLBACK_MESSAGE_KEY = 'fallback.offlineCatalog'

export function offlineProducts(locale?: AppLocale): Product[] {
  return getProducts(locale ?? getCurrentLocale())
}

export function offlineProductBySlug(slug: string, locale?: AppLocale): Product | undefined {
  return getLocalizedProductBySlug(slug, locale ?? getCurrentLocale())
}

export function catalogFallback<T>(
  data: T,
  messageKey: string = FALLBACK_MESSAGE_KEY,
): CommerceResponse<T> {
  return {
    data,
    error: messageKey,
    meta: { latencyMs: API_TIMEOUT_MS, source: 'fallback' },
  }
}
