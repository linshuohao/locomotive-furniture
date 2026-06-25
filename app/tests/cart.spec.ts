import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/store/cart'
import { setStorageItem } from '@/lib/storage'

const CART_KEY = 'atelier-cart-v2'

describe('cart store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('adds item to cart', () => {
    const cart = useCartStore()
    const ok = cart.addItem('1', '1a', 2)
    expect(ok).toBe(true)
    expect(cart.itemCount).toBe(2)
    expect(cart.subtotal).toBe(9295 * 2)
  })

  it('rejects invalid product', () => {
    const cart = useCartStore()
    expect(cart.addItem('invalid', '1a')).toBe(false)
  })

  it('removes item from cart', () => {
    const cart = useCartStore()
    cart.addItem('1', '1a')
    cart.removeItem('1', '1a')
    expect(cart.itemCount).toBe(0)
  })

  it('recalculates price when hydrating tampered storage', () => {
    setStorageItem(CART_KEY, [
      {
        productId: '1',
        variantId: '1a',
        quantity: 1,
        slug: 'eames-lounge-chair',
        price: 1,
        image: '/images/products/1-1.jpg',
      },
    ])

    const cart = useCartStore()
    cart.hydrateFromStorage()

    expect(cart.items).toHaveLength(1)
    expect(cart.items[0]?.price).toBe(9295)
    expect(cart.subtotal).toBe(9295)
  })

  it('drops invalid stored cart lines', () => {
    setStorageItem(CART_KEY, [
      { productId: 'invalid', variantId: '1a', quantity: 1, price: 10 },
      { productId: '1', variantId: '1a', quantity: 2 },
    ])

    const cart = useCartStore()
    cart.hydrateFromStorage()

    expect(cart.items).toHaveLength(1)
    expect(cart.itemCount).toBe(2)
  })
})
