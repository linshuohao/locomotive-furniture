type AnalyticsEvent =
  | { name: 'page_view'; path: string }
  | { name: 'product_view'; slug: string; price: number }
  | { name: 'add_to_cart'; slug: string; variantId: string; price: number }
  | { name: 'begin_checkout'; itemCount: number; subtotal: number }
  | { name: 'purchase'; orderId: string; subtotal: number }
  | { name: 'motion_jank'; frameDeltaMs: number }
  | { name: 'web_vital'; metric: string; value: number; rating: string }

const queue: AnalyticsEvent[] = []

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

export function track(event: AnalyticsEvent): void {
  queue.push(event)

  if (import.meta.env.DEV || analyticsEnabled) {
    console.debug('[analytics]', event)
  }
}

export function getAnalyticsQueue(): readonly AnalyticsEvent[] {
  return queue
}

export function trackFunnelStep(
  step: 'view_collection' | 'view_pdp' | 'add_cart' | 'checkout' | 'purchase',
  meta?: Record<string, string | number>,
): void {
  track({ name: 'page_view', path: `funnel:${step}:${JSON.stringify(meta ?? {})}` })
}

export function trackPageView(path: string): void {
  track({ name: 'page_view', path })
}

export function trackAddToCart(payload: {
  slug: string
  variantId: string
  price: number
}): void {
  track({ name: 'add_to_cart', ...payload })
  trackFunnelStep('add_cart', { slug: payload.slug })
}

export function trackProductView(slug: string, price: number): void {
  track({ name: 'product_view', slug, price })
  trackFunnelStep('view_pdp', { slug })
}

export function trackBeginCheckout(itemCount: number, subtotal: number): void {
  track({ name: 'begin_checkout', itemCount, subtotal })
  trackFunnelStep('checkout', { itemCount, subtotal })
}

export function trackPurchase(orderId: string, subtotal: number): void {
  track({ name: 'purchase', orderId, subtotal })
  trackFunnelStep('purchase', { orderId, subtotal })
}

export function trackScrollFps(fps: number): void {
  if (import.meta.env.DEV) {
    console.debug('[scroll-fps]', fps)
  }
}

export function initErrorTracking(): void {
  window.addEventListener('error', (event) => {
    console.error('[Error]', event.message)
  })
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[UnhandledRejection]', event.reason)
  })
}
