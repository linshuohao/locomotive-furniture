import { describe, it, expect, beforeEach } from 'vitest'
import { CheckoutFormSchema } from '@/data/schemas'
import {
  clearCheckoutSession,
  consumeCheckoutSession,
  setCheckoutSession,
} from '@/lib/checkoutSession'

describe('CheckoutFormSchema', () => {
  it('accepts valid checkout form', () => {
    const result = CheckoutFormSchema.safeParse({
      email: 'buyer@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      address: '1 Main St',
      city: 'Montreal',
      country: 'CA',
      postalCode: 'H2X 1Y4',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = CheckoutFormSchema.safeParse({
      email: 'not-an-email',
      firstName: 'Ada',
      lastName: 'Lovelace',
      address: '1 Main St',
      city: 'Montreal',
      country: 'CA',
      postalCode: 'H2X 1Y4',
    })

    expect(result.success).toBe(false)
  })
})

describe('checkout session', () => {
  beforeEach(() => {
    sessionStorage.clear()
    clearCheckoutSession()
  })

  it('consumes a matching checkout session once', () => {
    setCheckoutSession('ORD-TEST', 1290)

    const session = consumeCheckoutSession('ORD-TEST')
    expect(session).toEqual(expect.objectContaining({ orderId: 'ORD-TEST', subtotal: 1290 }))
    expect(consumeCheckoutSession('ORD-TEST')).toBeNull()
  })

  it('rejects mismatched order ids', () => {
    setCheckoutSession('ORD-TEST', 1290)
    expect(consumeCheckoutSession('ORD-OTHER')).toBeNull()
  })
})
