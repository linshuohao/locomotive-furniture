import { describe, it, expect } from 'vitest'
import { getProductBySlug } from '@/data/products'
import { getDefaultVariant, isProductInStock } from '@/lib/product/stock'

describe('product stock helpers', () => {
  it('prefers in-stock variant over first variant', () => {
    const product = getProductBySlug('ph5-pendant')
    expect(product).toBeTruthy()
    expect(getDefaultVariant(product!).id).toBe('9b')
  })

  it('reports in-stock when any variant is available', () => {
    const product = getProductBySlug('ph5-pendant')
    expect(product).toBeTruthy()
    expect(isProductInStock(product!)).toBe(true)
  })
})
