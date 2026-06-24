import { describe, it, expect } from 'vitest'
import { formatPrice, getProductBySlug, products } from '@/data/products'

describe('products data', () => {
  it('has exactly 10 SPUs', () => {
    expect(products).toHaveLength(10)
  })

  it('finds product by slug', () => {
    const product = getProductBySlug('nordic-lounge-chair')
    expect(product?.name).toBe('Nordic Lounge Chair')
  })

  it('formats price in USD', () => {
    expect(formatPrice(1290)).toMatch(/\$1,290/)
  })
})
