import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, CheckoutForm } from '@/types'
import { getProductById } from '@/data/products'
import { CartItemInputSchema } from '@/data/schemas'
import { getStorageItem, setStorageItem } from '@/lib/storage'
import { submitCheckout as submitCheckoutApi } from '@/data/api'
import { trackAddToCart } from '@/lib/analytics/analytics'

const CART_KEY = 'atelier-cart-v2'
const MAX_QUANTITY = 99

function getVariantPrice(basePrice: number, priceModifier: number): number {
  return basePrice + priceModifier
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const recentAdd = ref<CartItem | null>(null)

  function sanitizeStoredItems(raw: unknown): CartItem[] {
    if (!Array.isArray(raw)) return []

    const sanitized: CartItem[] = []
    for (const entry of raw) {
      const parsed = CartItemInputSchema.safeParse(entry)
      if (!parsed.success) continue

      const line = resolveLine(parsed.data.productId, parsed.data.variantId, parsed.data.quantity)
      if (line) sanitized.push(line)
    }
    return sanitized
  }

  function hydrateFromStorage() {
    items.value = sanitizeStoredItems(getStorageItem<unknown>(CART_KEY, []))
  }

  const itemCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const subtotal = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

  function persist() {
    if (!setStorageItem(CART_KEY, items.value)) {
      console.warn('[Cart] localStorage unavailable, using memory only')
    }
  }

  function resolveLine(productId: string, variantId: string, quantity: number) {
    const product = getProductById(productId)
    if (!product) return null

    const variant = product.variants.find((v) => v.id === variantId)
    if (!variant || !variant.inStock) return null

    const parsed = CartItemInputSchema.safeParse({ productId, variantId, quantity })
    if (!parsed.success) return null

    const unitPrice = getVariantPrice(product.price, variant.priceModifier)

    return {
      productId,
      variantId,
      quantity: Math.min(MAX_QUANTITY, quantity),
      slug: product.slug,
      price: unitPrice,
      image: product.images[0],
    } satisfies CartItem
  }

  function addItem(productId: string, variantId: string, quantity = 1) {
    const line = resolveLine(productId, variantId, quantity)
    if (!line) return false

    const existing = items.value.find((i) => i.productId === productId && i.variantId === variantId)

    if (existing) {
      existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + line.quantity)
      existing.price = line.price
    } else {
      items.value.push(line)
    }

    persist()
    recentAdd.value = existing ?? line
    trackAddToCart({
      slug: line.slug,
      variantId: line.variantId,
      price: line.price * line.quantity,
    })
    return true
  }

  function updateQuantity(productId: string, variantId: string, quantity: number) {
    const item = items.value.find((i) => i.productId === productId && i.variantId === variantId)
    if (!item) return

    if (quantity <= 0) {
      removeItem(productId, variantId)
    } else {
      item.quantity = Math.min(MAX_QUANTITY, quantity)
      persist()
    }
  }

  function removeItem(productId: string, variantId: string) {
    items.value = items.value.filter(
      (i) => !(i.productId === productId && i.variantId === variantId),
    )
    persist()
  }

  function clearRecentAdd() {
    recentAdd.value = null
  }

  function clearCart() {
    items.value = []
    persist()
  }

  async function submitCheckout(form: CheckoutForm): Promise<{ orderId: string }> {
    const payload = {
      ...form,
      items: items.value,
      subtotal: subtotal.value,
    }

    const result = await submitCheckoutApi(payload)
    if (!result.data) {
      throw new Error(result.error ?? 'Checkout failed')
    }

    clearCart()
    return result.data
  }

  return {
    items,
    recentAdd,
    itemCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearRecentAdd,
    clearCart,
    submitCheckout,
    hydrateFromStorage,
  }
})
