import type { Product, ProductVariant } from '@/data/schemas'

export function isProductInStock(product: Product): boolean {
  return product.variants.some((variant) => variant.inStock !== false)
}

export function getDefaultVariant(product: Product): ProductVariant {
  return product.variants.find((variant) => variant.inStock !== false) ?? product.variants[0]!
}
