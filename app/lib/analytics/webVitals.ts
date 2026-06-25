import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals'
import { track } from '@/lib/analytics/analytics'

function sendMetric(metric: Metric): void {
  track({
    name: 'web_vital',
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
  })
}

export function initWebVitals(): void {
  if (typeof window === 'undefined') return

  onCLS(sendMetric)
  onINP(sendMetric)
  onLCP(sendMetric)
  onFCP(sendMetric)
  onTTFB(sendMetric)

  window.addEventListener('motion:jank', (event) => {
    const detail = (event as CustomEvent<{ frameDeltaMs: number }>).detail
    track({ name: 'motion_jank', frameDeltaMs: detail.frameDeltaMs })
  })
}
