import {
  getCached,
  setCache,
  withTimeout,
  simulateLatency,
  API_TIMEOUT_MS,
} from '@/data/client'
import { catalogFallback, offlineProductBySlug, offlineProducts } from '@/data/fallback'
import type { Product } from '@/data/schemas'
import type { CheckoutPayload, CommerceResponse } from '@/data/types'
import type { CommerceProvider } from '@/data/providers/types'

async function fetchProductsMock(): Promise<CommerceResponse<Product[]>> {
  const cacheKey = 'products:all'
  const cached = getCached<Product[]>(cacheKey)
  if (cached) {
    return { data: cached, error: null, meta: { latencyMs: 0, source: 'cache' } }
  }

  const start = performance.now()
  try {
    const data = await withTimeout(() => simulateLatency(offlineProducts()))
    setCache(cacheKey, data)
    return {
      data,
      error: null,
      meta: { latencyMs: Math.round(performance.now() - start), source: 'api' },
    }
  } catch {
    return catalogFallback(offlineProducts())
  }
}

async function fetchProductBySlugMock(slug: string): Promise<CommerceResponse<Product>> {
  const cacheKey = `product:${slug}`
  const cached = getCached<Product>(cacheKey)
  if (cached) {
    return { data: cached, error: null, meta: { latencyMs: 0, source: 'cache' } }
  }

  const start = performance.now()
  try {
    const product = await withTimeout(() => {
      const p = offlineProductBySlug(slug)
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
    const fallback = offlineProductBySlug(slug)
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
