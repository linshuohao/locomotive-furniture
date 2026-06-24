import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, CheckoutForm } from '@/types'
import { getProductById } from '@/data/products'
import { getStorageItem, setStorageItem } from '@/core/storage'
import { trackAddToCart, trackCheckout } from '@/core/monitoring'

const CART_KEY = 'cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(getStorageItem<CartItem[]>(CART_KEY, []))

  const itemCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const subtotal = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

  function persist() {
    if (!setStorageItem(CART_KEY, items.value)) {
      console.warn('[Cart] localStorage unavailable, using memory only')
    }
  }

  function addItem(productId: string, variantId: string, quantity = 1) {
    const product = getProductById(productId)
    if (!product) return false

    const variant = product.variants.find((v) => v.id === variantId)
    if (!variant) return false

    const price = product.price + variant.priceModifier
    const existing = items.value.find(
      (i) => i.productId === productId && i.variantId === variantId,
    )

    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({
        productId,
        variantId,
        quantity,
        name: product.name,
        price,
        image: product.images[0],
        variantName: variant.name,
      })
    }

    persist()
    trackAddToCart(productId)
    return true
  }

  function updateQuantity(productId: string, variantId: string, quantity: number) {
    const item = items.value.find(
      (i) => i.productId === productId && i.variantId === variantId,
    )
    if (!item) return

    if (quantity <= 0) {
      removeItem(productId, variantId)
    } else {
      item.quantity = quantity
      persist()
    }
  }

  function removeItem(productId: string, variantId: string) {
    items.value = items.value.filter(
      (i) => !(i.productId === productId && i.variantId === variantId),
    )
    persist()
  }

  function clearCart() {
    items.value = []
    persist()
  }

  function submitCheckout(_form: CheckoutForm): Promise<{ orderId: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        trackCheckout()
        const orderId = `ORD-${Date.now()}`
        clearCart()
        resolve({ orderId })
      }, 800)
    })
  }

  return {
    items,
    itemCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    submitCheckout,
  }
})
