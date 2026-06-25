import { describe, it, expect } from 'vitest'
import { formatPrice, getProductBySlug, getProducts, products } from '@/data/products'

describe('products data', () => {
  it('has exactly 10 SPUs', () => {
    expect(products).toHaveLength(10)
  })

  it('finds product by slug', () => {
    const product = getProductBySlug('eames-lounge-chair')
    expect(product?.name).toBe('Eames Lounge Chair & Ottoman')
  })

  it('finds localized product by slug', () => {
    const product = getProductBySlug('eames-lounge-chair', 'zh')
    expect(product?.name).toBe('伊姆斯休闲椅与脚凳')
  })

  it('returns localized catalog', () => {
    const zhProducts = getProducts('zh')
    expect(zhProducts[0]?.category).toBe('座椅')
  })

  it('formats price in USD for en locale', () => {
    expect(formatPrice(9295, 'USD', 'en')).toMatch(/\$9,295/)
  })

  it('formats price for zh locale', () => {
    expect(formatPrice(9295, 'USD', 'zh')).toMatch(/9,295/)
  })
})
