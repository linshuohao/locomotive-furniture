import type { CartItem, CheckoutForm, Product } from '@/data/schemas'

export interface CommerceResponse<T> {
  data: T | null
  error: string | null
  meta?: { latencyMs: number; source: 'cache' | 'api' | 'fallback' }
}

export interface CheckoutPayload extends CheckoutForm {
  items: CartItem[]
  subtotal: number
}

export type { Product, CheckoutForm, CartItem }
