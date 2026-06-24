import type { WebVitalsMetric } from '@/types'

type AnalyticsEvent = {
  category: string
  action: string
  label?: string
  value?: number
}

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

export function trackEvent(event: AnalyticsEvent) {
  if (!analyticsEnabled && import.meta.env.DEV) {
    console.debug('[Analytics]', event)
    return
  }
  if (analyticsEnabled) {
    console.info('[Analytics]', event)
  }
}

export function reportWebVital(metric: WebVitalsMetric) {
  trackEvent({
    category: 'Web Vitals',
    action: metric.name,
    label: metric.rating,
    value: Math.round(metric.value),
  })
}

export function initWebVitals() {
  if (typeof window === 'undefined') return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        reportWebVital({
          name: 'LCP',
          value: entry.startTime,
          rating: entry.startTime < 2500 ? 'good' : entry.startTime < 4000 ? 'needs-improvement' : 'poor',
        })
      }
    }
  })

  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch {
    // LCP not supported
  }

  let clsValue = 0
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
      if (!shift.hadRecentInput && shift.value) clsValue += shift.value
    }
    reportWebVital({
      name: 'CLS',
      value: clsValue,
      rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
    })
  })

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true })
  } catch {
    // CLS not supported
  }
}

export function initErrorTracking() {
  window.addEventListener('error', (event) => {
    trackEvent({
      category: 'Error',
      action: 'uncaught',
      label: event.message,
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    trackEvent({
      category: 'Error',
      action: 'unhandledrejection',
      label: String(event.reason),
    })
  })
}

export function trackScrollFps(fps: number) {
  if (import.meta.env.DEV) {
    trackEvent({ category: 'Performance', action: 'scroll_fps', value: fps })
  }
}

export function trackPageView(path: string) {
  trackEvent({ category: 'Navigation', action: 'page_view', label: path })
}

export function trackAddToCart(productId: string) {
  trackEvent({ category: 'Ecommerce', action: 'add_to_cart', label: productId })
}

export function trackCheckout() {
  trackEvent({ category: 'Ecommerce', action: 'checkout_complete' })
}
