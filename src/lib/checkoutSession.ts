const SESSION_KEY = 'atelier_checkout_session'
const SESSION_TTL_MS = 30 * 60 * 1000

export interface CheckoutSession {
  orderId: string
  subtotal: number
  createdAt: number
}

export function setCheckoutSession(orderId: string, subtotal: number): void {
  if (import.meta.server) return

  const payload: CheckoutSession = {
    orderId,
    subtotal,
    createdAt: Date.now(),
  }

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload))
  } catch {
    // sessionStorage unavailable — success page guard will redirect
  }
}

export function getCheckoutSession(): CheckoutSession | null {
  if (import.meta.server) return null

  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as CheckoutSession
    if (
      typeof parsed.orderId !== 'string' ||
      typeof parsed.subtotal !== 'number' ||
      typeof parsed.createdAt !== 'number'
    ) {
      return null
    }

    if (Date.now() - parsed.createdAt > SESSION_TTL_MS) {
      clearCheckoutSession()
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function clearCheckoutSession(): void {
  if (import.meta.server) return

  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

export function consumeCheckoutSession(orderId: string): CheckoutSession | null {
  const session = getCheckoutSession()
  if (!session || session.orderId !== orderId) return null

  clearCheckoutSession()
  return session
}
