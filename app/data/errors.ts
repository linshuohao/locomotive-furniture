/** i18n keys returned in CommerceResponse.error — translate in the Page layer via translateErrorKey */
export const COMMERCE_ERROR_KEYS = {
  OFFLINE_CATALOG: 'fallback.offlineCatalog',
  API_TIMEOUT: 'fallback.apiTimeout',
  API_ERROR: 'fallback.apiError',
  NOT_CONFIGURED: 'fallback.apiNotConfigured',
  PRODUCT_NOT_FOUND: 'fallback.productNotFound',
  CHECKOUT_FAILED: 'checkout.errors.failed',
} as const

export type CommerceErrorKey = (typeof COMMERCE_ERROR_KEYS)[keyof typeof COMMERCE_ERROR_KEYS]

export function resolveCommerceErrorKey(
  err: unknown,
  fallback: CommerceErrorKey = COMMERCE_ERROR_KEYS.API_ERROR,
): CommerceErrorKey {
  if (typeof err === 'string' && err.includes('.')) {
    return err as CommerceErrorKey
  }

  if (err instanceof Error) {
    if (err.message === 'API_TIMEOUT') return COMMERCE_ERROR_KEYS.API_TIMEOUT
    if (err.message === 'NUXT_PUBLIC_API_BASE_URL is not configured') {
      return COMMERCE_ERROR_KEYS.NOT_CONFIGURED
    }
    if (err.message.startsWith('HTTP_')) return COMMERCE_ERROR_KEYS.API_ERROR
    if (err.message.includes('.')) return err.message as CommerceErrorKey
  }

  return fallback
}
