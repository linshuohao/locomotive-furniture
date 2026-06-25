import { getCached, setCache, withTimeout, simulateLatency, API_TIMEOUT_MS } from '@/data/client'
import { catalogFallback, offlineProductBySlug, offlineProducts } from '@/data/fallback'
import type { Product } from '@/data/schemas'
import type { CheckoutPayload, CommerceResponse } from '@/data/types'
import type { CommerceProvider } from '@/data/providers/types'
import { getCurrentLocale } from '@/i18n'

async function fetchProductsMock(): Promise<CommerceResponse<Product[]>> {
  const locale = getCurrentLocale()
  const cacheKey = `products:all:${locale}`
  const cached = getCached<Product[]>(cacheKey)
  if (cached) {
    return { data: cached, error: null, meta: { latencyMs: 0, source: 'cache' } }
  }

  const start = performance.now()
  try {
    const data = await withTimeout(() => simulateLatency(offlineProducts(locale)))
    setCache(cacheKey, data)
    return {
      data,
      error: null,
      meta: { latencyMs: Math.round(performance.now() - start), source: 'api' },
    }
  } catch {
    return catalogFallback(offlineProducts(locale))
  }
}

async function fetchProductBySlugMock(slug: string): Promise<CommerceResponse<Product>> {
  const locale = getCurrentLocale()
  const cacheKey = `product:${slug}:${locale}`
  const cached = getCached<Product>(cacheKey)
  if (cached) {
    return { data: cached, error: null, meta: { latencyMs: 0, source: 'cache' } }
  }

  const start = performance.now()
  try {
    const product = await withTimeout(() => {
      const p = offlineProductBySlug(slug, locale)
      if (!p) throw new Error('NOT_FOUND')
      return simulateLatency(p)
    })
    setCache(cacheKey, product)
    return {
      data: product,
      error: null,
      meta: { latencyMs: Math.round(performance.now() - start), source: 'api' },
    }
  } catch (err) {
    const fallback = offlineProductBySlug(slug, locale)
    if (fallback) {
      return catalogFallback(fallback)
    }
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
      meta: { latencyMs: API_TIMEOUT_MS, source: 'fallback' },
    }
  }
}

async function submitCheckoutMock(
  payload: CheckoutPayload,
): Promise<CommerceResponse<{ orderId: string }>> {
  const start = performance.now()
  try {
    const result = await withTimeout(async () => {
      await simulateLatency(null, 400)
      if (!payload.email || payload.items.length === 0) {
        throw new Error('INVALID_CHECKOUT')
      }
      return { orderId: `ORD-${Date.now().toString(36).toUpperCase()}` }
    })
    return {
      data: result,
      error: null,
      meta: { latencyMs: Math.round(performance.now() - start), source: 'api' },
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Checkout failed',
      meta: { latencyMs: API_TIMEOUT_MS, source: 'fallback' },
    }
  }
}

export const mockProvider: CommerceProvider = {
  fetchProducts: fetchProductsMock,
  fetchProductBySlug: fetchProductBySlugMock,
  submitCheckout: submitCheckoutMock,
}
