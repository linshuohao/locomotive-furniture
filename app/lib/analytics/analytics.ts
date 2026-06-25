import { enqueueTransport } from '@/lib/analytics/transport'

export type FunnelStep = 'view_collection' | 'view_pdp' | 'add_cart' | 'checkout' | 'purchase'

export type AnalyticsEvent =
  | { name: 'page_view'; path: string }
  | { name: 'product_view'; slug: string; price: number }
  | { name: 'add_to_cart'; slug: string; variantId: string; price: number }
  | { name: 'begin_checkout'; itemCount: number; subtotal: number }
  | { name: 'purchase'; orderId: string; subtotal: number }
  | { name: 'funnel_step'; step: FunnelStep; meta?: Record<string, string | number> }
  | { name: 'motion_jank'; frameDeltaMs: number }
  | { name: 'motion_skipped'; sceneId: string; reason: string }
  | { name: 'web_vital'; metric: string; value: number; rating: string }
  | { name: 'app_error'; statusCode: number; message: string }

const queue: AnalyticsEvent[] = []

function isAnalyticsEnabled(): boolean {
  if (import.meta.client) {
    try {
      return useRuntimeConfig().public.enableAnalytics === 'true'
    } catch {
      return false
    }
  }
  return process.env.NUXT_PUBLIC_ENABLE_ANALYTICS === 'true'
}

export function track(event: AnalyticsEvent): void {
  queue.push(event)

  if (import.meta.dev || isAnalyticsEnabled()) {
    console.debug('[analytics]', event)
  }

  enqueueTransport(event)
}

export function getAnalyticsQueue(): readonly AnalyticsEvent[] {
  return queue
}

export function trackFunnelStep(step: FunnelStep, meta?: Record<string, string | number>): void {
  track({ name: 'funnel_step', step, meta })
}

export function trackPageView(path: string): void {
  track({ name: 'page_view', path })
}

export function trackAddToCart(payload: { slug: string; variantId: string; price: number }): void {
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

export function trackMotionSkipped(sceneId: string, reason: string): void {
  track({ name: 'motion_skipped', sceneId, reason })
}

export function trackScrollFps(fps: number): void {
  if (import.meta.env.DEV) {
    console.debug('[scroll-fps]', fps)
  }
}

export function initErrorTracking(): void {
  window.addEventListener('error', (event) => {
    track({
      name: 'app_error',
      statusCode: 500,
      message: event.message || 'Uncaught error',
    })
    console.error('[Error]', event.message)
  })
  window.addEventListener('unhandledrejection', (event) => {
    const message =
      event.reason instanceof Error ? event.reason.message : String(event.reason ?? 'rejection')
    track({ name: 'app_error', statusCode: 500, message })
    console.error('[UnhandledRejection]', event.reason)
  })
}
