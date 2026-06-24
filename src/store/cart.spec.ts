import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/store/cart'

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
    expect(cart.subtotal).toBe(1290 * 2)
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
})
