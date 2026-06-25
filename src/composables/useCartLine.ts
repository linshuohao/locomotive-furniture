import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { CartItem } from '@/types'
import { getProductById } from '@/data/products'
import { useLocale } from '@/composables/useLocale'

export function resolveCartLine(item: CartItem, locale?: Parameters<typeof getProductById>[1]) {
  const product = getProductById(item.productId, locale)
  if (!product) {
    return { name: item.slug, variantName: '' }
  }

  const variant = product.variants.find((entry) => entry.id === item.variantId)
  return {
    name: product.name,
    variantName: variant?.name ?? '',
  }
}

export function useCartLine(item: MaybeRefOrGetter<CartItem>) {
  const { locale } = useLocale()

  return computed(() => resolveCartLine(toValue(item), locale.value))
}
