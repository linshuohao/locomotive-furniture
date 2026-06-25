import { z } from 'zod'
import { fetchJson, getCached, setCache, withTimeout, API_TIMEOUT_MS } from '@/data/client'
import { catalogFallback, offlineProductBySlug, offlineProducts } from '@/data/fallback'
import { COMMERCE_ERROR_KEYS, resolveCommerceErrorKey } from '@/data/errors'
import { ProductSchema } from '@/data/schemas'
import type { Product } from '@/data/schemas'
import type { CheckoutPayload, CommerceResponse } from '@/data/types'
import type { CommerceProvider } from '@/data/providers/types'
import { getCurrentLocale } from '@/lib/i18n/currentLocale'

const ProductsResponseSchema = z.array(ProductSchema)

const OrderResponseSchema = z.object({
  orderId: z.string(),
})

async function fetchProductsHttp(): Promise<CommerceResponse<Product[]>> {
  const locale = getCurrentLocale()
  const cacheKey = `products:all:${locale}`
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
  const locale = getCurrentLocale()
  const cacheKey = `product:${slug}:${locale}`
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
  } catch {
    const fallback = offlineProductBySlug(slug)
    if (fallback) {
      return catalogFallback(fallback)
    }
    return {
      data: null,
      error: COMMERCE_ERROR_KEYS.PRODUCT_NOT_FOUND,
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
      error: resolveCommerceErrorKey(err, COMMERCE_ERROR_KEYS.CHECKOUT_FAILED),
      meta: { latencyMs: API_TIMEOUT_MS, source: 'fallback' },
    }
  }
}

export const httpProvider: CommerceProvider = {
  fetchProducts: fetchProductsHttp,
  fetchProductBySlug: fetchProductBySlugHttp,
  submitCheckout: submitCheckoutHttp,
}
