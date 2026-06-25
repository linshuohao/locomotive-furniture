import { describe, it, expect } from 'vitest'
import { formatPrice, getProductBySlug, getProducts, products } from '@/data/products'

describe('products data', () => {
  it('has exactly 10 SPUs', () => {
    expect(products).toHaveLength(10)
  })

  it('finds product by slug', () => {
    const product = getProductBySlug('nordic-lounge-chair')
    expect(product?.name).toBe('Nordic Lounge Chair')
  })

  it('finds localized product by slug', () => {
    const product = getProductBySlug('nordic-lounge-chair', 'zh')
    expect(product?.name).toBe('北欧休闲椅')
  })

  it('returns localized catalog', () => {
    const zhProducts = getProducts('zh')
    expect(zhProducts[0]?.category).toBe('座椅')
  })

  it('formats price in USD for en locale', () => {
    expect(formatPrice(1290, 'USD', 'en')).toMatch(/\$1,290/)
  })

  it('formats price for zh locale', () => {
    expect(formatPrice(1290, 'USD', 'zh')).toMatch(/1,290/)
  })
})
