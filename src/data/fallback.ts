import {
  products as catalogProducts,
  getProductBySlug as getCatalogProductBySlug,
} from '@/data/products'
import type { Product } from '@/data/schemas'
import type { CommerceResponse } from '@/data/types'
import { API_TIMEOUT_MS } from '@/data/client'

export function offlineProducts(): Product[] {
  return [...catalogProducts]
}

export function offlineProductBySlug(slug: string): Product | undefined {
  return getCatalogProductBySlug(slug)
}

export function catalogFallback<T>(data: T): CommerceResponse<T> {
  return {
    data,
    error: 'Using offline catalog fallback',
    meta: { latencyMs: API_TIMEOUT_MS, source: 'fallback' },
  }
}
