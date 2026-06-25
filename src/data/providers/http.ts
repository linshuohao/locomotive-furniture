import { z } from 'zod'
import {
  fetchJson,
  getCached,
  setCache,
  withTimeout,
  API_TIMEOUT_MS,
} from '@/data/client'
import { catalogFallback, offlineProductBySlug, offlineProducts } from '@/data/fallback'
import { ProductSchema } from '@/data/schemas'
import type { Product } from '@/data/schemas'
import type { CheckoutPayload, CommerceResponse } from '@/data/types'
import type { CommerceProvider } from '@/data/providers/types'

const ProductsResponseSchema = z.array(ProductSchema)

const OrderResponseSchema = z.object({
  orderId: z.string(),
})

async function fetchProductsHttp(): Promise<CommerceResponse<Product[]>> {
  const cacheKey = 'products:all'
  const cached = getCached<Product[]>(cacheKey)
  if (cached) {
    return { data: cached, error: null, meta: { latencyMs: 0, source: 'cache' } }
  }

  const start = performance.now()
  try {
    const raw = await withTimeout(() => fetchJson<unknown>('/products'))
    const data = ProductsResponseSchema.parse(raw)
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

async function fetchProductBySlugHttp(slug: string): Promise<CommerceResponse<Product>> {
  const cacheKey = `product:${slug}`
  const cached = getCached<Product>(cacheKey)
  if (cached) {
    return { data: cached, error: null, meta: { latencyMs: 0, source: 'cache' } }
  }

  const start = performance.now()
  try {
    const raw = await withTimeout(() => fetchJson<unknown>(`/products/${slug}`))
    const product = ProductSchema.parse(raw)
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

async function submitCheckoutHttp(
  payload: CheckoutPayload,
): Promise<CommerceResponse<{ orderId: string }>> {
  const start = performance.now()
  try {
    const raw = await withTimeout(() =>
      fetchJson<unknown>('/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    )
    const result = OrderResponseSchema.parse(raw)
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

export const httpProvider: CommerceProvider = {
  fetchProducts: fetchProductsHttp,
  fetchProductBySlug: fetchProductBySlugHttp,
  submitCheckout: submitCheckoutHttp,
}
